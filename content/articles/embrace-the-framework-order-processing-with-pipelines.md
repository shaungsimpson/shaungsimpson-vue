---
title: "Embrace the Framework: Break Order Processing Into Steps With Pipelines"
description: Laravel Pipelines let complex workflows grow one focused, testable step at a time instead of one large service method.
seoDescription: Learn how Laravel Pipelines make order processing easier to test, extend, and understand with focused processing steps.
published: '2026-07-31'
updated: '2026-08-05'
draft: false
series: embrace-the-framework
seriesOrder: 4
tags:
  - laravel
  - php
  - pipelines
  - ecommerce
---

Some problems are about transforming a group of data. Collections are a very good fit for those.

Other problems are about moving one piece of work through a sequence of decisions. An order needs its address checked, its stock reserved, its pricing confirmed, its shipping calculated, and perhaps its risk assessed. Each step is related, but each has a different responsibility.

That is where Laravel Pipelines can help.

## The service method that keeps growing

A checkout service often starts in a perfectly reasonable place:

```php
public function process(Order $order): Order
{
    $this->validateAddress($order);
    $this->reserveStock($order);
    $this->applyContractPricing($order);
    $this->calculateShipping($order);
    $this->runFraudChecks($order);
    $this->saveOrder($order);

    return $order;
}
```

This is clear at first. The trouble comes when each method starts to have exceptions, dependencies, early exits, logging, and special cases. The service can become a large coordinator that knows far too much about every stage of the process.

It is still functional code, but it makes change more expensive. Adding a new check means touching a central class. Reusing just one processing stage means either duplicating it or pulling methods apart. Testing a single rule can require setting up the whole workflow.

## A Pipeline gives each stage a focused job

Laravel's Pipeline class lets us pass an object through a sequence of small classes, often called pipes.

Our order service can focus on the workflow itself:

```php
use Illuminate\Pipeline\Pipeline;
use Illuminate\Support\Facades\DB;

class ProcessOrder
{
    private const PIPES = [
        ValidateDeliveryAddress::class,
        ReserveStock::class,
        ApplyContractPricing::class,
        CalculateShipping::class,
        RunFraudChecks::class,
        PersistOrder::class,
    ];

    public function process(Order $order): Order
    {
        return DB::transaction(function () use ($order) {
            $order->loadMissing('items');

            return app(Pipeline::class)
                ->send($order)
                ->through(self::PIPES)
                ->thenReturn();
        });
    }
}
```

The sequence is visible immediately. It is also easy to change: inserting a new stage is a deliberate change to the workflow rather than another concern hidden inside a large method. Keeping the pipe list in one named constant also means the transactional and non-transactional explanations never depend on an unexplained `$this->pipes` property.

## A pipe should be small and honest

Here is a simple stock reservation pipe:

```php
<?php

namespace App\Pipelines\OrderProcessing;

use App\Exceptions\InsufficientStock;
use App\Models\Order;
use App\Models\Product;
use Closure;

class ReserveStock
{
    public function handle(Order $order, Closure $next): mixed
    {
        foreach ($order->items->sortBy('product_id') as $item) {
            $product = Product::query()
                ->lockForUpdate()
                ->findOrFail($item->product_id);

            if (! $product->hasAvailableStock($item->quantity)) {
                throw new InsufficientStock($product);
            }

            $product->reserveStock($item->quantity);
            $item->setRelation('product', $product);
        }

        return $next($order);
    }
}
```

This class does not need to know whether shipping has been calculated, whether the order will be persisted, or what happens after it calls `$next`. It has one responsibility: ensure stock is available and reserve it.

The row lock is an important part of that responsibility. A database transaction by itself does not stop two workers from reading the same available quantity before either worker updates it. `lockForUpdate()` holds each selected product row until the surrounding transaction completes, so the availability check and reservation operate on the same locked state. Sorting by `product_id` also gives concurrent orders a consistent lock order.

The service loads `items` before the Pipeline starts, and this pipe deliberately reloads each product under a lock. It then places that locked model on the item relation so later pricing pipes can reuse it without issuing a hidden lazy-loading query.

That narrow focus makes the class easier to test too.

```php
it('stops processing when an item is out of stock', function () {
    $order = Order::factory()->withOutOfStockItem()->create();
    $order->load('items');

    expect(fn () => DB::transaction(
        fn () => app(ReserveStock::class)->handle($order, fn () => null)
    ))
        ->toThrow(InsufficientStock::class);
});
```

## The order of the steps is part of the design

A Pipeline makes the sequence explicit, which is useful because order matters.

We should validate an address before calculating shipping. We should confirm stock before accepting an order. We may need contract pricing before fraud checks if the order value affects the risk rules.

Keeping the order in one place makes those decisions visible during code review. It also gives the team a clear answer to the question: what exactly happens when an order is processed?

## Do not use a Pipeline just because it exists

A Pipeline has some overhead. For two small operations, a simple method may be easier to read. It becomes valuable when the process has several independent stages, stages need their own tests, or the sequence is likely to grow.

Pipelines are also not a replacement for transactions. If the workflow changes data in several places, the surrounding service still needs to decide where the database transaction begins and ends. That is why `ProcessOrder` wraps the complete Pipeline in `DB::transaction()`: an exception from any pipe rolls back the stock, pricing, and order changes together, while the `ReserveStock` pipe supplies the row-level lock needed for its check-then-update rule.

The Pipeline describes the business process. The service still owns the wider application concerns, such as the transaction boundary and deciding which pipes apply.

## Collections and Pipelines solve different problems

The collection examples earlier in this series took a group of orders and helped us decide what each group meant. This example takes one order and moves it through a defined process.

That distinction is useful:

- Use a Collection when you are transforming or summarising a group of things.
- Use a Pipeline when one thing needs to move through a sequence of focused stages.

Both approaches lean into tools Laravel already provides. More importantly, both help the code describe the work the application is actually doing.
