---
title: "Embrace the Framework: Make Order Fulfilment Clearer With Collections"
description: A practical look at using Laravel Collections to turn a confusing order fulfilment task into readable, testable code.
seoDescription: Learn how Laravel Collections simplify order fulfilment by filtering, grouping, and summarising real application data.
published: '2026-07-25'
updated: '2026-08-05'
draft: false
series: embrace-the-framework
seriesOrder: 2
tags:
  - laravel
  - php
  - collections
  - ecommerce
---

A list of orders is rarely just a list of orders.

Once an application is doing real work, that list may need to tell us which orders can ship today, which are blocked by stock, which need manual review, and how that work should be divided between warehouses. It is a common piece of application logic, and it is surprisingly easy for it to become difficult to follow.

Laravel Collections are a great fit for this kind of work. They let us take a group of models and describe the decisions we need to make with them, one clear step at a time.

## The problem

Imagine a small ecommerce business preparing its daily warehouse pick lists. An order can be sent to the warehouse only when it has been paid for, has a shipping address, and every ordered item is in stock. Orders above $1,000 also need a quick manual review before they are released.

The outcome we want is straightforward:

- a list of orders ready to ship, grouped by warehouse;
- a list of orders blocked by stock; and
- a list of high-value orders that need review.

## A functional but manual approach

Plain PHP can certainly handle this. A first version might look like this:

```php
$readyToShip = [];
$blockedByStock = [];
$requiresReview = [];

foreach ($orders as $order) {
    $allItemsInStock = true;

    foreach ($order->items as $item) {
        if (! $item->is_in_stock) {
            $allItemsInStock = false;
            break;
        }
    }

    if (! $order->is_paid || $order->shipping_address === null) {
        continue;
    }

    if (! $allItemsInStock) {
        $blockedByStock[] = $order;
        continue;
    }

    if ($order->total_in_cents >= 100000) {
        $requiresReview[] = $order;
        continue;
    }

    $readyToShip[$order->warehouse_id][] = $order;
}
```

This works. It is also the kind of code that tends to grow awkwardly over time. It is doing several jobs at once, so a reader has to keep track of temporary state, `continue` statements, and the order in which each condition is checked.

If a new rule is added later, such as excluding orders with an expired delivery promise, there is one more branch to fit into an already busy loop.

## Start with the question being asked

With a Collection, we can make the first question more obvious:

```php
$ordersReadyToShip = $orders
    ->filter(fn (Order $order) =>
        $order->is_paid
        && $order->shipping_address !== null
        && $order->items->every(fn (OrderItem $item) => $item->is_in_stock)
        && $order->total_in_cents < 100000
    );
```

The code now reads from left to right: take the orders and filter them to the ones ready to ship.

The benefit is not that a Collection always produces fewer lines. The benefit is that the important operation is visible. We are no longer manually building an array and managing the route each order takes through the loop.

## Split the work into useful groups

Collections give us a few nice ways to separate a set of models without re-processing the original data repeatedly.

For example, `partition` divides a Collection into two Collections:

```php
[$ordersWithStock, $ordersBlockedByStock] = $orders
    ->partition(fn (Order $order) =>
        $order->items->every(fn (OrderItem $item) => $item->is_in_stock)
    );
```

That gives the warehouse team a useful exception list immediately. We can then work with the orders that do have stock:

```php
[$highValueOrders, $standardOrders] = $ordersWithStock
    ->partition(fn (Order $order) => $order->total_in_cents >= 100000);
```

Finally, the ready orders can be grouped by where they need to go:

```php
$ordersByWarehouse = $standardOrders
    ->filter(fn (Order $order) =>
        $order->is_paid && $order->shipping_address !== null
    )
    ->groupBy('warehouse_id');
```

At this point, `$ordersByWarehouse` is a Collection where each value is another Collection of orders. That makes dispatching warehouse work clear too:

```php
$ordersByWarehouse->each(
    fn (Collection $orders, int $warehouseId) =>
        PrepareWarehousePickList::dispatch($warehouseId, $orders)
);
```

## Collections make reporting less painful too

The same order data can answer useful operational questions without a new loop for every total.

```php
$summary = [
    'orders_ready_to_ship' => $ordersReadyToShip->count(),
    'orders_blocked_by_stock' => $ordersBlockedByStock->count(),
    'ready_to_ship_value' => $ordersReadyToShip->sum('total_in_cents'),
];
```

If the finance or operations team needs a breakdown by payment method, the intent remains easy to follow:

```php
$revenueByPaymentMethod = $ordersReadyToShip
    ->groupBy('payment_method')
    ->map(fn (Collection $orders) => $orders->sum('total_in_cents'));
```

This is the kind of code that is pleasant to revisit later. The business question is visible in the variable name, and the transformation that answers it is visible in the Collection chain.

## Do not turn every chain into a puzzle

Collections are not an excuse to put all of an application's business rules into one enormous chain.

When a callback starts carrying a lot of domain knowledge, give that knowledge a name. A small private method, a query scope, or a custom Collection method can make the code much easier to understand.

For example, this is a useful point to stop repeating the same shipping rules:

```php
<?php

namespace App\Collections;

use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Database\Eloquent\Collection;

class OrderCollection extends Collection
{
    public function readyToShip(): self
    {
        return $this->filter(fn (Order $order) =>
            $order->is_paid
            && $order->shipping_address !== null
            && $order->items->every(
                fn (OrderItem $item) => $item->is_in_stock
            )
            && $order->total_in_cents < 100000
        );
    }
}
```

`OrderCollection` extends Eloquent's Collection, so it keeps all the familiar Collection operations while adding language that belongs specifically to orders.

The `readyToShip` method calls `filter` on the current group of orders. `filter` leaves the original Collection alone and returns a new Collection containing only the orders for which every condition is true:

- the order has been paid;
- a shipping address is present;
- `every` confirms that all of its items are in stock; and
- the total is below $1,000, because higher-value orders require manual review.

The `self` return type makes the result explicit: callers receive another `OrderCollection`, not an array or an unrelated value. That means the result can continue through another Collection operation.

Defining the class is only the first half of the setup. Eloquent still needs to know that a group of `Order` models should be returned as an `OrderCollection`. We connect the Collection to the model by overriding `newCollection`:

```php
<?php

namespace App\Models;

use App\Collections\OrderCollection;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    public function newCollection(array $models = []): OrderCollection
    {
        return new OrderCollection($models);
    }
}
```

Eloquent calls `newCollection` when it needs to create a Collection for this model. It passes the retrieved models into the method, and the method wraps them in our `OrderCollection`. From that point on, an Eloquent operation that would normally return a Collection of orders can expose `readyToShip` as well as the standard Collection methods.

The application code can now use the business rule directly:

```php
$ordersByWarehouse = Order::query()
    ->with('items')
    ->get()
    ->readyToShip()
    ->groupBy('warehouse_id');
```

There are two stages in this chain. `with('items')` tells Eloquent to load the order items alongside the orders, and `get()` executes the database query. That eager loading matters because `readyToShip` inspects every order's items; without it, accessing `items` could issue an additional query for each order.

After `get()`, we are working with an `OrderCollection` in memory. `readyToShip()` applies the named rule, and `groupBy('warehouse_id')` organises the matching orders for the warehouse. The code reads as a sequence of business decisions without repeating the conditions at the point of use.

The improvement is not simply that the calling code is shorter. Controllers, scheduled jobs, and reports can now use the same definition of "ready to ship" without copying its conditions. When the fulfilment policy changes, there is one method to update and one focused behaviour to test.

Because `readyToShip` returns an `OrderCollection`, the result also remains chainable with the Collection operations we have already used, including `groupBy`, `sum`, and `each`.

There is also an important boundary here: `readyToShip()` filters orders after they have been loaded. That is a good fit for a daily fulfilment batch that already needs the orders and their items. If the application has millions of candidate orders and only needs a small subset, the database should narrow the result first with query conditions or a local query scope. A custom Collection is most useful once we have a meaningful group of models and want to apply reusable rules or transformations to that group.

That is where custom Collections become particularly useful. Instead of merely transforming a list, we can teach a collection of orders what its business terms mean.

The next article takes this pattern further by putting a larger set of subscription rules into their own custom Collection.
