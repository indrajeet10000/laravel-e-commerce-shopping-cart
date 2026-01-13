<?php

namespace App\Jobs;

use App\Models\OrderItem;
use App\Mail\DailySalesReport;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;

class DailySalesReportJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function handle()
    {
        $today = Carbon::today();

        $sales = OrderItem::whereDate('created_at', $today)
            ->with('product')
            ->get()
            ->groupBy('product_id');

        // Prepare data for email
        $reportData = [];
        foreach ($sales as $productId => $items) {
            $productName = $items->first()->product->name;
            $totalQty = $items->sum('quantity');
            $totalRevenue = $items->sum(function ($item) {
                return $item->price * $item->quantity;
            });

            $reportData[] = [
                'name' => $productName,
                'quantity' => $totalQty,
                'revenue' => $totalRevenue,
            ];
        }

        Mail::to('admin@example.com')->send(new DailySalesReport($reportData));
    }
}
