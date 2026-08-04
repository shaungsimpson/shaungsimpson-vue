---
title: "Embrace the Framework: Build Clear Operational Reports With Collections"
description: Use Laravel Collections to turn subscription and invoice data into a useful daily report without filling a controller with loops and temporary arrays.
seoDescription: Learn how Laravel Collections create clear operational reports from subscription and invoice data using grouping, filtering, and aggregation.
published: '2026-08-02'
updated: '2026-08-05'
draft: false
series: embrace-the-framework
seriesOrder: 5
tags:
  - laravel
  - php
  - collections
  - reporting
---

Reports often start life as a simple request: "Can we see what needs attention?"

Then the questions arrive. How much recurring revenue is currently active? Which payments failed this week? Which customers have been overdue for more than seven days? Which plans are growing, and which ones are losing customers?

None of these questions are particularly unusual in a subscription application. The difficulty is that a report can quickly turn into a large controller method full of loops, flags, and arrays that only make sense once you have read the whole thing twice.

Laravel Collections give us a much cleaner way to turn a set of subscriptions and invoices into useful operational information.

## The daily subscription report

Imagine a support and finance team that wants a daily snapshot containing:

- active monthly recurring revenue;
- payments that failed in the last seven days;
- customers who are overdue and need follow-up; and
- recurring revenue grouped by subscription plan.

We will assume the subscriptions and the data the report needs have already been loaded:

```php
$subscriptions = Subscription::query()
    ->with(['customer', 'latestInvoice', 'plan'])
    ->get();
```

Loading the relationships up front is important. It avoids quietly performing more database queries while the Collection is being processed.

## A working report built with loops

A manual version may look like this:

```php
$monthlyRecurringRevenue = 0;
$failedPayments = [];
$overdueCustomers = [];
$revenueByPlan = [];

foreach ($subscriptions as $subscription) {
    if ($subscription->status === 'active') {
        $monthlyRecurringRevenue += $subscription->monthly_amount_in_cents;

        $planName = $subscription->plan->name;

        if (! isset($revenueByPlan[$planName])) {
            $revenueByPlan[$planName] = 0;
        }

        $revenueByPlan[$planName] += $subscription->monthly_amount_in_cents;
    }

    $invoice = $subscription->latestInvoice;

    if (
        $invoice?->status === 'failed'
        && $invoice->failed_at->greaterThan(now()->subDays(7))
    ) {
        $failedPayments[] = $subscription;
    }

    if (
        $invoice?->status === 'overdue'
        && $invoice->due_at->lessThan(now()->subDays(7))
    ) {
        $overdueCustomers[] = $subscription->customer;
    }
}
```

Again, there is nothing technically wrong here. It produces a report.

The downside is that several questions are being answered inside one loop. The report's important concepts are mixed in with the mechanics of building arrays and incrementing totals. It also becomes tempting to keep adding more report fields to the same loop because the relevant data is already there.

## Name the useful starting point

A Collection lets us begin with the subset that matters to several of the report's metrics:

```php
$activeSubscriptions = $subscriptions
    ->where('status', 'active');
```

That small step makes the rest of the report more readable. We can calculate active monthly recurring revenue directly:

```php
$monthlyRecurringRevenue = $activeSubscriptions
    ->sum('monthly_amount_in_cents');
```

There is no accumulator to initialise and no need to scan a larger loop to understand what is being totalled.

## Group revenue by plan

Grouping data is one of the places Collections are particularly pleasant to use.

```php
$revenueByPlan = $activeSubscriptions
    ->groupBy(fn (Subscription $subscription) => $subscription->plan->name)
    ->map(fn (Collection $subscriptions) =>
        $subscriptions->sum('monthly_amount_in_cents')
    )
    ->sortDesc();
```

This reads as a sequence of business decisions:

1. Start with active subscriptions.
2. Group them by plan.
3. Total the recurring revenue for each plan.
4. Put the highest-value plans first.

The resulting Collection is also convenient to pass to a view, an API resource, or a notification without changing it back into a manually maintained array.

## Make the exception lists explicit

Failed payments and overdue customers are different operational concerns, so it is useful to calculate them independently.

```php
$failedPayments = $subscriptions
    ->filter(fn (Subscription $subscription) =>
        $subscription->latestInvoice?->status === 'failed'
        && $subscription->latestInvoice->failed_at->greaterThan(now()->subDays(7))
    );
```

For overdue follow-up, we can return customers rather than subscriptions. Calling `unique` means a customer with more than one overdue subscription will only appear once in the team list.

```php
$customersRequiringFollowUp = $subscriptions
    ->filter(fn (Subscription $subscription) =>
        $subscription->latestInvoice?->status === 'overdue'
        && $subscription->latestInvoice->due_at->lessThan(now()->subDays(7))
    )
    ->pluck('customer')
    ->filter()
    ->unique('id')
    ->values();
```

The `values()` call is a small but useful finishing step. It resets the Collection keys after `unique`, which is usually what an API or frontend expects when it receives a list.

## Assemble a report that explains itself

The final report can be a simple array of named values:

```php
$report = [
    'monthly_recurring_revenue_in_cents' => $monthlyRecurringRevenue,
    'active_subscription_count' => $activeSubscriptions->count(),
    'revenue_by_plan' => $revenueByPlan,
    'failed_payment_count' => $failedPayments->count(),
    'customers_requiring_follow_up' => $customersRequiringFollowUp,
];
```

Each value has already been calculated in a focused step. The final structure is not where the business logic lives; it is simply a useful description of the finished report.

This also makes it easy to introduce separate presentation rules later. A JSON API may expose the cents as formatted money through a Resource, while a scheduled email may render the same report in a table. Neither needs to repeat the reporting rules.

## Know where Collections stop being the right tool

Collections work in memory. That is usually ideal for a modest set of already-loaded models, such as a team's daily operational report.

For a report over hundreds of thousands of invoices, it would be better to let the database do more of the grouping and summing first. Laravel's query builder can perform those aggregations efficiently, and a Collection can still be useful for shaping the final result.

The point is not to use a Collection for every report. It is to recognise when a Collection makes a manageable group of data easier to understand.

## The report is a conversation with the business

A useful report should make it easy for a team to answer a question and take the next action.

Collections help because each transformation can be named after that question: active subscriptions, revenue by plan, failed payments, and customers requiring follow-up. That is a much better starting point than a loop that happens to calculate all four along the way.

As business rules become more important and more widely reused, the next natural step is to give them a permanent home in a custom Collection. That lets the application speak the same language as the people using it.
