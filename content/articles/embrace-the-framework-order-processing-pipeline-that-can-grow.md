---
title: "Embrace the Framework: Build an Order Processing Pipeline That Can Grow"
description: A complete Laravel Pipeline example for validating, pricing, reserving, and persisting an order without creating an oversized service class.
seoDescription: Build an extensible Laravel order processing Pipeline with focused validation, pricing, stock, and persistence stages.
published: '2026-08-06'
draft: false
series: embrace-the-framework
seriesOrder: 7
tags:
  - laravel
  - php
  - pipelines
  - ecommerce
---

In the previous Pipeline article, we looked at why a series of focused processing stages is often easier to maintain than one large service method.

This time, let us build the shape of a complete order-processing workflow. The aim is not a perfect checkout implementation for every application. It is a practical example of how Laravel Pipelines let a workflow grow without making one class responsible for every decision.

## The workflow

A wholesale order needs to pass through these stages:

1. normalise the submitted data;
2. validate the delivery address;
3. check customer payment terms;
4. reserve stock;
5. apply contract pricing;
6. calculate shipping;
7. flag exceptions for review; and
8. persist the order.

Some steps may stop the workflow by throwing an exception. Others enrich the order and let it continue. The order is important, and it should be visible.

## Start with a context object

Passing an Eloquent model alone is sometimes enough. For a richer process, a small context object gives each pipe one shared place to store calculated values and flags.

```php
<?php

namespace App\OrderProcessing;

use App\Models\Order;
use Illuminate\Support\Collection;

class OrderProcessingContext
{
    public function __construct(
        public Order $order,
        public Collection $exceptions,
    ) {
    }

    public function addException(string $message): void
    {
        $this->exceptions->push($message);
    }
}
```

The context is not a second model. It is simply the object travelling through the workflow.

## Make the pipeline explicit

The service that starts the process stays small:

```php
<?php

namespace App\Services;

use App\OrderProcessing\OrderProcessingContext;
use App\Pipelines\Orders\ApplyContractPricing;
use App\Pipelines\Orders\CalculateShipping;
use App\Pipelines\Orders\CheckCustomerTerms;
use App\Pipelines\Orders\FlagExceptions;
use App\Pipelines\Orders\NormaliseOrderData;
use App\Pipelines\Orders\PersistOrder;
use App\Pipelines\Orders\ReserveStock;
use App\Pipelines\Orders\ValidateDeliveryAddress;
use Illuminate\Pipeline\Pipeline;
use Illuminate\Support\Facades\DB;

class ProcessOrder
{
    public function handle(OrderProcessingContext $context): OrderProcessingContext
    {
        return DB::transaction(fn () =>
            app(Pipeline::class)
                ->send($context)
                ->through([
                    NormaliseOrderData::class,
                    ValidateDeliveryAddress::class,
                    CheckCustomerTerms::class,
                    ReserveStock::class,
                    ApplyContractPricing::class,
                    CalculateShipping::class,
                    FlagExceptions::class,
                    PersistOrder::class,
                ])
                ->thenReturn()
        );
    }
}
```

This class owns the boundaries of the process: the order of the stages and the database transaction. It does not need to contain the detailed implementation of every rule.

## Keep individual pipes narrow

For example, contract pricing can be isolated in its own pipe:

```php
<?php

namespace App\Pipelines\Orders;

use App\OrderProcessing\OrderProcessingContext;
use Closure;

class ApplyContractPricing
{
    public function handle(OrderProcessingContext $context, Closure $next): mixed
    {
        $contract = $context->order->customer->activeContract;

        foreach ($context->order->items as $item) {
            $item->unit_price_in_cents = $contract
                ? $contract->priceFor($item->product)
                : $item->product->standard_price_in_cents;
        }

        return $next($context);
    }
}
```

The pipe answers one question: what price should this customer receive for each item? It does not need to know how the delivery address was checked or how the order will be saved.

A pipe that identifies a non-blocking concern can simply record it:

```php
class FlagExceptions
{
    public function handle(OrderProcessingContext $context, Closure $next): mixed
    {
        if ($context->order->total_in_cents >= 100000) {
            $context->addException('High-value order requires review.');
        }

        return $next($context);
    }
}
```

Later, `PersistOrder` can save those exceptions, or the caller can decide to route the order into a review queue.

## Adding a new rule stays local

Suppose the company begins shipping dangerous goods. A new check can be introduced without reopening every existing pipe:

```php
->through([
    NormaliseOrderData::class,
    ValidateDeliveryAddress::class,
    ValidateDangerousGoodsDestination::class,
    CheckCustomerTerms::class,
    ReserveStock::class,
    // ...
])
```

The new pipe has a clear position in the workflow, and its own tests can focus on that one rule.

This is where a Pipeline becomes more valuable than a long service method. The workflow grows by adding a well-named step rather than adding another branch to a central class that already knows too much.

## Use the right boundaries

There are two details worth keeping clear.

First, a Pipeline does not make database changes safe by itself. The transaction in `ProcessOrder` is still important when stock, pricing, and order records must remain consistent.

Second, not every side effect belongs inside the transaction. Sending an email or calling a third-party shipping provider is often better handled after the order has been committed, using an event and queued listener.

The Pipeline coordinates the core decision-making process. Laravel's events, jobs, and queues can then handle the follow-up work in their own appropriate places.

## A process that explains itself

A good pipeline should read like a concise description of what happens to an order. If a new developer can look at the `through` list and understand the business flow, it is doing its job.

That clarity is the real benefit. The framework provides a small, familiar tool; the application uses it to make a complex process easier to reason about and safer to change.