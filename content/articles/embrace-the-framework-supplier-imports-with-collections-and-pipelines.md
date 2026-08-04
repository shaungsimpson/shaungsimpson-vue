---
title: "Embrace the Framework: Combine Collections and Pipelines for Reliable Supplier Imports"
description: A practical supplier inventory import that uses Pipelines for processing and Collections for reconciliation, reporting, and action.
seoDescription: Learn how Laravel Collections and Pipelines work together to validate supplier inventory imports and produce useful reconciliation reports.
published: '2026-08-08'
updated: '2026-08-05'
draft: false
series: embrace-the-framework
seriesOrder: 8
tags:
  - laravel
  - php
  - collections
  - pipelines
  - imports
---

Supplier inventory imports are a good example of a task that needs more than one Laravel tool.

A supplier sends a CSV or API payload containing product codes, stock levels, prices, and availability dates. We need to validate the input, match it to our products, apply the changes, and tell the operations team what happened. Some records may be invalid, some product codes may no longer exist, and some stock changes may be unusual enough to need attention.

A Pipeline and a Collection each have a useful role here.

- The Pipeline moves one import through a series of processing stages.
- Collections help us group the results, identify exceptions, and produce a useful reconciliation report.

## The import context

As with order processing, a context object is a convenient way to move the import and its results through the Pipeline.

```php
<?php

namespace App\SupplierImport;

use App\Models\Product;
use Illuminate\Support\Collection;

final readonly class InventoryChange
{
    public function __construct(
        public Product $product,
        public int $previousStockLevel,
        public int $newStockLevel,
    ) {
    }

    public function isUnusual(): bool
    {
        $difference = abs($this->newStockLevel - $this->previousStockLevel);

        return $this->previousStockLevel === 0
            ? $this->newStockLevel > 0
            : $difference > ($this->previousStockLevel * 0.5);
    }
}

class SupplierImportContext
{
    public function __construct(
        public Collection $rows,
        public Collection $validRows,
        public Collection $inventoryChanges,
        public Collection $issues,
    ) {
    }

    public function rejectRow(array $row, string $type, string $message): void
    {
        $this->issues->push([
            'row_number' => $row['row_number'],
            'type' => $type,
            'message' => $message,
        ]);

        $this->validRows = $this->validRows
            ->reject(fn (array $candidate) =>
                $candidate['row_number'] === $row['row_number']
            )
            ->values();
    }
}
```

The context makes both the input and output of the import explicit. `rows` preserves the complete numbered input for reporting, while `validRows` is the shrinking set that may reach the database update. Validation and matching pipes call `rejectRow()` when a record cannot continue, which both records a consistently shaped issue and removes that row from later processing.

`InventoryChange` is a snapshot of one successful update. Keeping the previous and new quantities in a result object avoids attaching undocumented temporary properties to an Eloquent `Product`. Its `isUnusual()` method also defines what happens when the previous quantity was zero.

## The processing stages

The import service can describe the workflow in one place:

```php
use Illuminate\Support\Facades\DB;

public function handle(Collection $rows): SupplierImportContext
{
    $numberedRows = $rows
        ->values()
        ->map(fn (array $row, int $index) => [
            ...$row,
            'row_number' => $index + 1,
        ]);

    $context = new SupplierImportContext(
        rows: $numberedRows,
        validRows: $numberedRows,
        inventoryChanges: collect(),
        issues: collect(),
    );

    return DB::transaction(fn () =>
        app(Pipeline::class)
            ->send($context)
            ->through([
                NormaliseSupplierRows::class,
                ValidateRequiredFields::class,
                MatchProductsBySupplierCode::class,
                ApplyInventoryChanges::class,
                FlagStockAnomalies::class,
            ])
            ->thenReturn()
    );
}
```

Each pipe has one responsibility. `NormaliseSupplierRows` standardises column names and trims values in both row Collections. `ValidateRequiredFields` and `MatchProductsBySupplierCode` call `rejectRow()` for records that cannot continue. `ApplyInventoryChanges` therefore iterates only over `validRows`.

For each successful update, that pipe captures the state before changing the product:

```php
$previousStockLevel = $product->stock_level;
$newStockLevel = (int) $row['stock_level'];

$product->update(['stock_level' => $newStockLevel]);

$context->inventoryChanges->push(new InventoryChange(
    product: $product,
    previousStockLevel: $previousStockLevel,
    newStockLevel: $newStockLevel,
));
```

The service wraps the complete Pipeline in one transaction. Expected bad rows are reported and skipped, while an unexpected exception rolls back every inventory update from this import. If an application deliberately wants each valid row to commit independently, that is a different partial-success policy and should be expressed with a per-row transaction instead.

The Pipeline is concerned with processing. It is not where we decide how to present the outcome to a person.

## Use Collections to understand the result

After the Pipeline has finished, the context contains the information needed for a reconciliation report.

```php
$context = $importSupplierInventory->handle($rows);

$issuesByType = $context->issues
    ->groupBy('type')
    ->map(fn (Collection $issues) => $issues->count());

$updatedByWarehouse = $context->inventoryChanges
    ->groupBy(fn (InventoryChange $change) => $change->product->warehouse_id)
    ->map(fn (Collection $changes) => $changes->count());
```

This is the point where Collections shine. We already have the import result in memory, and we want to ask useful questions about it.

We can also identify unusually large stock changes. Perhaps any change of more than 50 percent should be reviewed before the supplier feed is trusted fully:

```php
$unusualChanges = $context->inventoryChanges
    ->filter(fn (InventoryChange $change) => $change->isUnusual());
```

The result is not a vague boolean hidden inside the import process. It is a named Collection that can be shown in an admin screen, included in a Slack notification, or queued for review.

## Produce an honest report

The final report can describe both successful work and the parts that need attention:

```php
$report = [
    'rows_received' => $context->rows->count(),
    'products_updated' => $context->inventoryChanges->count(),
    'issues_by_type' => $issuesByType,
    'updates_by_warehouse' => $updatedByWarehouse,
    'unusual_stock_changes' => $unusualChanges,
];
```

This is a much more useful outcome than simply returning "import completed". Operations can see how much changed, whether the feed has data-quality issues, and what needs a person to look at next.

## Why not put it all in one class?

A single import service with a few loops can work. It may validate rows, update products, store errors, and return a report. The issue is not that one class is always wrong; the issue is that it tends to grow in several directions at once.

Pipelines keep the processing stages separate and testable. Collections keep the result analysis expressive. The service coordinating the import stays small enough to understand.

Each piece uses Laravel for the job it is good at, without inventing a large internal framework around a routine business process.

## The point of the series

Collections, custom Collections, and Pipelines are all small tools. Their value becomes clear when an application has real rules, real data, and a team that needs to keep changing both safely.

Embracing the framework is not about avoiding custom code. It is about using Laravel's conventions where they help, then adding application-specific language where it matters. That gives us software that is easier to explain, easier to extend, and much more comfortable to hand to the next developer.
