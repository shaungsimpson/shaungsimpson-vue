---
title: "Embrace the Framework: Put Subscription Business Rules in a Custom Collection"
description: Custom Eloquent Collections give repeated business rules a clear home and let application code speak the language of the domain.
seoDescription: Learn how custom Laravel Collections keep subscription business rules readable, reusable, and out of controllers.
published: '2026-07-28'
updated: '2026-08-05'
draft: false
series: embrace-the-framework
seriesOrder: 3
tags:
  - laravel
  - php
  - collections
  - business-logic
---

Collections are excellent for transforming data, but they become even more useful when they can speak the language of the application.

A subscription product, for example, has concepts that matter everywhere: active subscriptions, failed payments, customers at risk of churn, and monthly recurring revenue. Those are not just filters. They are business terms the whole team should be able to recognise.

A custom Eloquent Collection gives those terms a natural home.

## The repeated-rule problem

Consider a SaaS application that needs to identify subscriptions requiring payment follow-up. A subscription should be followed up when it is active, its latest payment has failed, and the failure happened within the last seven days.

Without a shared abstraction, the rule often appears in a controller first:

```php
$subscriptionsToContact = $subscriptions
    ->filter(fn (Subscription $subscription) =>
        $subscription->status === 'active'
        && $subscription->latestPayment?->status === 'failed'
        && $subscription->latestPayment?->failed_at?->greaterThan(now()->subDays(7))
    );
```

It is reasonable code. The problem is what happens next.

A dashboard needs the same list. Then a scheduled command needs it. Then the support team asks for a count. Each place can copy the chain, perhaps with a small variation. Before long, nobody is entirely certain whether every screen is using the same definition of "requires payment follow-up".

## Give the rule a name

First, create a Collection for the domain:

```php
<?php

namespace App\Collections;

use App\Models\Subscription;
use Illuminate\Database\Eloquent\Collection;

class SubscriptionCollection extends Collection
{
    public function requiringPaymentFollowUp(): self
    {
        return $this->filter(fn (Subscription $subscription) =>
            $subscription->status === 'active'
            && $subscription->latestPayment?->status === 'failed'
            && $subscription->latestPayment?->failed_at?->greaterThan(now()->subDays(7))
        );
    }
}
```

## Connect the Collection in Laravel 13

Defining the Collection is only half of the setup. Eloquent must also know that a group of `Subscription` models should be returned as a `SubscriptionCollection`.

Laravel 13 gives us a direct model-level extension point for this: the `CollectedBy` attribute.

```php
<?php

namespace App\Models;

use App\Collections\SubscriptionCollection;
use Illuminate\Database\Eloquent\Attributes\CollectedBy;
use Illuminate\Database\Eloquent\Model;

#[CollectedBy(SubscriptionCollection::class)]
class Subscription extends Model
{
    // ...
}
```

The attribute is important: without it, `get()` returns Laravel's standard Eloquent Collection, which does not have `requiringPaymentFollowUp()`.

Older examples often override `newCollection()` and return the custom Collection directly. Laravel 13 still supports that approach, but its current implementation also preserves automatic relationship loading when that feature is enabled. Using `#[CollectedBy]` keeps this example focused and lets Eloquent take care of constructing the Collection correctly.

Now any operation for `Subscription` models that would normally return an Eloquent Collection can use the new language:

```php
$subscriptionsToContact = Subscription::query()
    ->with('latestPayment')
    ->get()
    ->requiringPaymentFollowUp();
```

The controller does not need to know how the rule is calculated. It asks a question the product team would understand.

## Keep related behaviour together

Once the Collection exists, it can hold other operations that only make sense for a group of subscriptions.

```php
class SubscriptionCollection extends Collection
{
    public function active(): self
    {
        return $this->where('status', 'active');
    }

    public function requiringPaymentFollowUp(): self
    {
        return $this->active()
            ->filter(fn (Subscription $subscription) =>
                $subscription->latestPayment?->status === 'failed'
                && $subscription->latestPayment?->failed_at?->greaterThan(now()->subDays(7))
            );
    }

    public function monthlyRecurringRevenue(): int
    {
        return $this->active()->sum('monthly_amount_in_cents');
    }
}
```

This gives us expressive application code:

```php
$subscriptions = Subscription::query()
    ->with('latestPayment')
    ->get();

$summary = [
    'active_subscriptions' => $subscriptions->active()->count(),
    'payment_follow_ups' => $subscriptions->requiringPaymentFollowUp()->count(),
    'monthly_recurring_revenue' => $subscriptions->monthlyRecurringRevenue(),
];
```

The important detail is that these methods are not generic helpers. They represent concepts specific to subscriptions. A `SubscriptionCollection` is a better home for them than a broad `DataManager` or a controller utility trait.

## This also makes change safer

Business rules change. A follow-up may need to exclude subscriptions with an open support ticket, or revenue may need to exclude subscriptions in a trial period.

With copied filters, that change requires finding every version of the rule and hoping none are missed. With a custom Collection, we have one named place to update and a focused unit test to describe the expected behaviour.

```php
it('finds active subscriptions with a recent failed payment', function () {
    $subscriptions = new SubscriptionCollection([
        Subscription::factory()->active()->withFailedPayment()->create(),
        Subscription::factory()->cancelled()->withFailedPayment()->create(),
        Subscription::factory()->active()->withSuccessfulPayment()->create(),
    ]);

    expect($subscriptions->requiringPaymentFollowUp())->toHaveCount(1);
});
```

The test is easier to write because the method is focused. It also documents the business rule in a way a long controller test often does not.

## A custom Collection is not a dumping ground

It is tempting to put every operation on a custom Collection once one exists. I would avoid that.

A collection method should answer a question about the group of models it contains. If it needs to load more data, persist changes, send notifications, or coordinate several unrelated services, it probably belongs somewhere else.

The simple rule I use is this: if the method sounds natural after the collection name, it is probably a good candidate.

- `subscriptions->active()` makes sense.
- `subscriptions->monthlyRecurringRevenue()` makes sense.
- `subscriptions->sendRenewalEmails()` is probably coordinating a separate process.

Custom Collections let us extend Laravel without moving away from Laravel. The framework gives us the extension point; our application adds the business language.

Next, we will look at a different kind of complexity: one task that needs to move through several distinct processing stages. That is where Laravel Pipelines are a great fit.
