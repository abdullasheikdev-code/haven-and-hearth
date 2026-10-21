import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { formatCurrency } from '../../lib/utils';
import {
  DollarSign,
  ShoppingBag,
  TrendingUp,
  BedDouble,
  Boxes,
  AlertTriangle,
  ArrowUpRight,
  Receipt,
  ChefHat,
  Sparkles,
} from 'lucide-react';

export const OwnerOverviewPage: React.FC = () => {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const data = await api.get('/reports/overview');
        setReport(data);
      } catch (err) {
        console.error('Failed to load operational reports:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 rounded-3xl bg-ivory-200 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const sales = report?.sales || { totalSales: 0, orderCount: 0, averageOrderValue: 0 };
  const hotel = report?.hotel || { totalRevenue: 0, bookingCount: 0, occupancyRate: 0, totalRooms: 0, occupiedRooms: 0 };
  const inventory = report?.inventory || { inventoryValuation: 0, lowStockAlerts: 0 };

  return (
    <div className="space-y-8 text-left">
      {/* Page Title & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-terracotta-600">
            Executive Command
          </span>
          <h1 className="font-serif text-3xl font-bold text-charcoal-900 mt-0.5">
            Operations &amp; Revenue Overview
          </h1>
          <p className="text-xs text-charcoal-500 mt-1">
            Authoritative financial metrics and live operational activity aggregated from MongoDB.
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            to="/app/pos"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-forest-800 text-ivory-50 text-xs font-bold shadow-soft hover:bg-forest-900 transition-colors"
          >
            <Receipt className="w-4 h-4 text-mango-300" />
            <span>Launch POS Terminal</span>
          </Link>
          <Link
            to="/app/kitchen"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-ivory-300 text-charcoal-800 text-xs font-bold hover:bg-ivory-200 transition-colors"
          >
            <ChefHat className="w-4 h-4 text-terracotta-500" />
            <span>View Kitchen KDS</span>
          </Link>
        </div>
      </div>

      {/* Primary KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Metric 1: Total Sales */}
        <div className="bg-white p-6 rounded-3xl border border-ivory-300 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500">
              Total F&amp;B Revenue
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-3xl font-bold text-charcoal-900 mt-2">
            {formatCurrency(sales.totalSales)}
          </p>
          <p className="text-[11px] text-emerald-700 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{sales.orderCount} Verified Transactions</span>
          </p>
        </div>

        {/* Metric 2: Average Order Value */}
        <div className="bg-white p-6 rounded-3xl border border-ivory-300 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500">
              Average Order Value
            </span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-700">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-3xl font-bold text-charcoal-900 mt-2">
            {formatCurrency(sales.averageOrderValue)}
          </p>
          <p className="text-[11px] text-charcoal-500 mt-1">Across dine-in, takeaway &amp; room service</p>
        </div>

        {/* Metric 3: Hotel Occupancy */}
        <div className="bg-white p-6 rounded-3xl border border-ivory-300 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500">
              Suite Occupancy Rate
            </span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-700">
              <BedDouble className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-3xl font-bold text-charcoal-900 mt-2">
            {hotel.occupancyRate}%
          </p>
          <p className="text-[11px] text-purple-700 font-semibold mt-1">
            {hotel.occupiedRooms} of {hotel.totalRooms} Suites Occupied
          </p>
        </div>

        {/* Metric 4: Inventory Valuation */}
        <div className="bg-white p-6 rounded-3xl border border-ivory-300 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500">
              Pantry Inventory Value
            </span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-3xl font-bold text-charcoal-900 mt-2">
            {formatCurrency(inventory.inventoryValuation)}
          </p>
          <p className="text-[11px] text-amber-700 font-semibold mt-1 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{inventory.lowStockAlerts} Ingredients Low Stock</span>
          </p>
        </div>
      </div>

      {/* Two Column Grid: Top Selling Dishes & Channel Sales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Channel Breakdown */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-ivory-300 shadow-soft">
          <div className="flex items-center justify-between pb-4 border-b border-ivory-200">
            <div>
              <h3 className="font-serif text-xl font-bold text-charcoal-900">
                Revenue by Hospitality Channel
              </h3>
              <p className="text-xs text-charcoal-500 mt-0.5">Authoritative sales distribution</p>
            </div>
            <span className="text-xs font-semibold text-forest-800 bg-forest-50 px-3 py-1 rounded-full border border-forest-200">
              Live Aggregate
            </span>
          </div>

          <div className="mt-6 space-y-4">
            {report?.channelSales &&
              Object.entries(report.channelSales).map(([channel, data]: [string, any]) => (
                <div key={channel} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-charcoal-800">
                      {channel.replace('_', ' ')}
                    </span>
                    <span className="font-mono font-bold text-forest-900">
                      {formatCurrency(data.total)} ({data.count} orders)
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-ivory-200 overflow-hidden">
                    <div
                      className="h-full bg-forest-800 rounded-full"
                      style={{
                        width: `${Math.min(100, Math.round((data.total / Math.max(1, sales.totalSales)) * 100))}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Top 5 Dishes */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-ivory-300 shadow-soft">
          <div className="flex items-center justify-between pb-4 border-b border-ivory-200">
            <div>
              <h3 className="font-serif text-xl font-bold text-charcoal-900">
                Top Performing Culinary Creations
              </h3>
              <p className="text-xs text-charcoal-500 mt-0.5">Ranked by volume ordered</p>
            </div>
            <Sparkles className="w-4 h-4 text-mango-500" />
          </div>

          <div className="mt-6 divide-y divide-ivory-200">
            {report?.topDishes?.map((dish: any, idx: number) => (
              <div key={idx} className="py-3.5 first:pt-0 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-ivory-200 text-charcoal-700 font-bold text-xs flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="font-serif text-sm font-bold text-charcoal-900 leading-tight">
                      {dish.name}
                    </h4>
                    <p className="text-[11px] text-charcoal-400">
                      {dish.quantity} portions served
                    </p>
                  </div>
                </div>
                <span className="font-mono font-bold text-xs text-forest-900">
                  {formatCurrency(dish.revenue)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
