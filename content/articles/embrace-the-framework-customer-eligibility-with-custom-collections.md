---
title: "Embrace the Framework: Make Eligibility Rules Read Like Business Policy"
description: Use a custom Laravel Collection to turn scattered loyalty and promotion rules into clear, reusable business language.
seoDescription: Learn how a custom Laravel Collection makes customer eligibility rules clear, reusable, and easy to test.
published: '2026-08-04'
draft: false
series: embrace-the-framework
seriesOrder: 6
tags:
  - laravel
  - php
  - collections
  - business-logic
---

Eligibility rules have a habit of becoming more complicated than anyone expects.

A promotion might begin with a simple requirement: customers who have spent more than $500 can receive a reward. A little later, marketing asks to exclude refunded orders. Support wants to avoid customers with an overdue invoice. The offer should only apply to customers in Australia, and only if they have not already used it.

Each rule makes sense on its own. Put them all in a controller, though, and the application starts to lose the language of the business.

A custom Collection is a useful way to keep those rules readable.

## The customer reward scenario

Imagine an online retailer offering a loyalty reward. A customer is eligible when they:

- have an active account;
- live in Australia;
- have spent at least $500 on completed, non-refunded orders in the last year;
- do not have an overdue invoice; and
- have not already claimed the reward.

The customer service team needs a list of eligible customers, and the marketing team needs a count for campaign planning.

## The controller version

A functional implementation could start like this:

```php
$eligibleCustomers = $customers->filter(function (Customer $customer) {
    $completedOrderValue = $customer->orders
        ->filter(fn (Order $order) =>
            $order->status === 'completed'
            && $order->refunded_at === null
            && $order->completed_at->greaterThan(now()->subYear())
        )
        ->sum('total_in_cents');

    return $customer->status === 'active'
        && $customer->country_code === 'AU'
        && $completedOrderValue >= 50000
        && $customer->invoices->every(fn (Invoice $invoice) => $invoice->status !== 'overdue')
        && ! $customer->rewards->contains('code', 'LOYALTY-500');
});
```

It works, and it may be acceptable when the rule is only needed once.

The problem is that this is not really controller knowledge. A controller should not need to know how a loyalty reward is earned. The same rule will likely be needed in a scheduled campaign, an API endpoint, an admin dashboard, and perhaps the customer's own account page.

## Give the policy a home

A `CustomerCollection` lets the application ask a business question directly:

```php
$eligibleCustomers = $customers->eligibleForLoyaltyReward();
```

Here is one possible implementation:

```php
<?php

namespace App\Collections;

use App\Models\Customer;
use Illuminate\Database\Eloquent\Collection;

class CustomerCollection extends Collection
{
    public function eligibleForLoyaltyReward(): self
    {
        return $this
            ->active()
            ->inAustralia()
            ->withAnnualCompletedSpendOfAtLeast(50000)
            ->withoutOverdueInvoices()
            ->withoutReward('LOYALTY-500');
    }

    public function active(): self
    {
        return $this->where('status', 'active');
    }

    public function inAustralia(): self
    {
        return $this->where('country_code', 'AU');
    }
}
```

The first method reads much more like a policy than a set of implementation details. The smaller methods can be private if they are only used to support this rule, or public if they are meaningful concepts elsewhere in the application.

The remaining conditions can still use familiar Collection operations:

```php
public function withoutOverdueInvoices(): self
{
    return $this->filter(fn (Customer $customer) =>
        $customer->invoices->every(fn (Invoice $invoice) => $invoice->status !== 'overdue')
    );
}

public function withoutReward(string $code): self
{
    return $this->reject(fn (Customer $customer) =>
        $customer->rewards->contains('code', $code)
    );
}
```

## Load the data deliberately

A custom Collection does not remove the need to think about data access. The rules above use orders, invoices, and rewards, so those relations should be loaded before the Collection is asked to make a decision.

```php
$customers = Customer::query()
    ->with([
        'orders',
        'invoices',
        'rewards',
    ])
    ->get();

$eligibleCustomers = $customers->eligibleForLoyaltyReward();
```

For a very large customer base, some eligibility conditions should be expressed in the database query instead. The Collection can then apply the rules that are best evaluated in memory. The aim is not to force every decision into a Collection; it is to give the rules a clear, reusable home.

## A policy is easier to change and test

Campaign rules change. That is normal.

If the minimum spend becomes $750, or a customer must have made three completed orders as well as spending enough, there is one named method to update. A focused test can state the behaviour clearly:

```php
it('finds Australian active customers who qualify for the loyalty reward', function () {
    $customers = new CustomerCollection([
        Customer::factory()->active()->inAustralia()->withEligibleSpend()->create(),
        Customer::factory()->active()->inAustralia()->withOverdueInvoice()->create(),
        Customer::factory()->inactive()->inAustralia()->withEligibleSpend()->create(),
    ]);

    expect($customers->eligibleForLoyaltyReward())->toHaveCount(1);
});
```

The test describes the business outcome, not the loops and conditionals used to reach it.

## The value is shared language

The useful part of this approach is not hiding complexity for its own sake. It is making complexity understandable.

`eligibleForLoyaltyReward()` gives developers, support staff, and product owners a shared phrase for the same policy. The implementation can evolve, but the rest of the application does not have to relearn the rule every time it changes.

That is a good sign that a custom Collection is earning its place in the codebase.