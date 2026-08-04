---
title: "Embrace the Framework: Why Working With Laravel Beats Working Around It"
description: Laravel gives us more than convenient helpers. This is an introduction to why leaning into its conventions and tools leads to clearer, more maintainable applications.
seoDescription: Learn why embracing Laravel's conventions, collections, pipelines, and built-in tools creates clearer, more maintainable applications.
published: '2026-07-23'
updated: '2026-08-05'
draft: false
series: embrace-the-framework
seriesOrder: 1
tags:
  - laravel
  - php
  - clean-code
  - architecture
---

Laravel is a framework with a lot of opinions.

It gives us conventions for where code lives, how routes and controllers are structured, how models talk to a database, how validation works, and much more. It also gives us a large collection of small, well-considered tools for common problems.

Those opinions are not a cage. Laravel will not stop us from organising an application differently, introducing our own abstractions, or using plain PHP when it is the clearest solution. It gives us a strong default rather than insisting there is only one possible way to build.

That flexibility is useful, but it also means we need to make deliberate choices about when moving away from the framework's conventions genuinely helps the application.

Sometimes that can feel restrictive. When we are working on a feature, it is tempting to reach straight for a custom helper, a large service class, or a familiar bit of plain PHP. There is nothing inherently wrong with custom code, and Laravel certainly does not remove the need for it.

The problem comes when we start rebuilding things the framework already does well.

Over time, that can leave an application full of slightly different ways to solve the same problem. One developer uses arrays and loops, another uses a query scope, another builds a helper, and somebody else writes a service with several hundred lines of conditionals. All of those approaches may work, but the application becomes harder to understand because there is no consistent language for it.

This article is the beginning of a series about doing the opposite: embracing the framework.

## What I mean by embracing Laravel

Embracing Laravel does not mean blindly using every feature it offers.

It means learning the tools Laravel provides, understanding the problems they solve, and using them when they are a good fit. It means following conventions when they make an application easier for the next developer to work on. It also means extending Laravel in ways that feel natural when the application genuinely has its own domain language.

The goal is not to make code look clever. The goal is to make it easier to read, test, change, and maintain.

A good Laravel application often reads less like a set of instructions for the computer and more like a description of the business problem being solved.

## The cost of fighting the framework

Most of us have seen a controller that starts small and slowly turns into the centre of an entire feature.

It might begin by fetching some orders, applying a few rules, calculating totals, sending notifications, and returning a response. A few months later, there are more conditions, more special cases, and more copied logic in other parts of the application.

The code may still work, but changing it starts to feel risky.

This is often not because the developer made a bad decision. Features grow, deadlines happen, and the simplest solution at the time is usually the one that gets written. The trouble is that custom logic tends to accumulate without providing a clear structure for where the next piece should go.

Laravel has structures for many of these situations already:

- Form Requests can hold validation and authorisation rules.
- Eloquent query scopes can describe reusable database queries.
- Events and listeners can separate a business action from its side effects.
- Jobs can move slow work out of a web request.
- Policies can make permissions explicit.
- Collections can make in-memory data transformations easier to understand.
- Pipelines can break a complex process into small, ordered steps.

Using these tools does not guarantee good code, but it gives us shared places to put it.

## Shared conventions are a feature

One of Laravel's biggest benefits is that developers already have a rough idea of where to look.

If an application uses a Form Request for validation, a policy for authorisation, and a custom collection for group behaviour, another Laravel developer can orient themselves quickly. They do not need to learn a new internal architecture before they can make a small change.

That is especially valuable as an application grows.

There is also a cost to being too inventive with an application's structure.

A developer may come up with a genuinely effective solution to a problem, perhaps even one that is more flexible or technically elegant than Laravel's usual approach. That does not automatically make it the best choice for the team.

If that solution is not documented, understood by others, or consistent with the rest of the application, every future developer has to spend time working out the idea before they can safely change it. The code relies on an assumption that someone has seen the pattern before, remembers why it exists, and knows when it should be used.

The cost of a custom solution is not always visible when it is first written. Even when it is technically sound, the team now owns the responsibility for explaining it, documenting it, testing its edge cases, and teaching new developers how and when to use it. Hiring becomes a little harder too, because the application depends on knowledge that exists only within the team.

Laravel conventions reduce that cost. Developers who already know Laravel can usually understand the structure, recognise familiar patterns, and become productive much faster. The framework's tools have also been used, tested, questioned, and improved across a much broader range of applications than most internal solutions ever will be.

A custom abstraction can still be excellent when it describes something unique about the business. A `SubscriptionCollection`, for example, may make perfect sense in an application that manages recurring billing. It can expose useful concepts such as active subscriptions, subscriptions at risk, or monthly recurring revenue.

A generic `DataManager`, however, usually tells us very little. It may be doing important work, but the name does not help us understand what that work is or where it belongs.

Laravel's conventions give us a useful default. We can then introduce our own abstractions when they add meaningful language to the application and enough value to justify the ongoing cost of owning them.

## A small example

Imagine we need to identify the orders that are ready to be sent to the warehouse.

A perfectly functional approach might be to use a loop and build an array as we go:

```php
$ordersReadyToShip = [];

foreach ($orders as $order) {
    $hasStockForEveryItem = true;

    foreach ($order->items as $item) {
        if (! $item->is_in_stock) {
            $hasStockForEveryItem = false;
            break;
        }
    }

    if (
        $order->is_paid
        && $order->shipping_address !== null
        && $hasStockForEveryItem
    ) {
        $ordersReadyToShip[] = $order;
    }
}
```

There is nothing broken about this. It will produce the required result, and for a small one-off task it may be exactly what we need.

The trade-off is that we are manually managing the process: creating an array, looping through orders, looping through items, tracking state, and adding qualifying orders ourselves. As the conditions grow, the intent can become harder to pick out.

Laravel Collections let us describe the actual operation more directly:

```php
$ordersReadyToShip = $orders
    ->filter(fn (Order $order) =>
        $order->is_paid
        && $order->shipping_address !== null
        && $order->items->every(fn ($item) => $item->is_in_stock)
        && $order->total_in_cents < 100000
    );
```

The important improvement is not simply that this has fewer lines. It tells a clearer story: take the orders and filter them to the ones that are ready to ship. In this scenario, orders worth $1,000 or more are held for manual review, so the introductory rule matches the fuller definition used in the next article.

The collection remains a Collection too, so further work stays expressive:

```php
$ordersReadyToShip
    ->groupBy('warehouse_id')
    ->each(fn (Collection $orders, int $warehouseId) =>
        dispatch(new PrepareWarehousePickList($warehouseId, $orders))
    );
```

When 'ready to ship' becomes an important business concept used throughout the application, we can take it further:

```php
$orders->readyToShip();
```

That method might live on a custom collection. The controller no longer needs to understand the detailed rules. It asks a question in the same language the warehouse team would use.

The alternative example is not a mistake. It is working code. The question is whether it gives the next developer the clearest possible expression of the problem.

## Framework features should remove accidental complexity

The business rules in an application are usually complex enough already.

We need to deal with pricing, stock, customers, permissions, reporting, notifications, and integrations. We should not also have to spend unnecessary energy on repeatedly solving framework-level problems such as validation, queues, caching, or transforming lists of data.

Laravel gives us a strong foundation for that work.

When we use the framework well, our code can focus more clearly on the decisions that are unique to the application. The framework handles the common plumbing, while our own code explains what makes this particular business different.

That is the real value in embracing the framework: not less thought, but more thought spent in the right place.

## This series

The first practical part of this series will focus on Collections.

Collections are one of Laravel's most useful features because they help turn a messy group of data into a clear sequence of decisions. We will start with everyday examples: filtering, grouping, and summarising real application data.

From there, we will look at custom collections and how they can capture meaningful business rules. Finally, we will move into Laravel Pipelines, which are useful when a complex task needs to pass through a series of small, focused steps.

The aim throughout will be practical examples that are useful in real applications, not examples created purely to show off a method.

Laravel has a lot to offer once we stop treating it as something to work around. It is worth leaning into.
