import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { formatCurrency } from '../../lib/utils';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { Download, BarChart3, TrendingUp, DollarSign, BedDouble, Boxes } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const data = await api.get('/reports/overview');
        setReport(data);
      } catch (err) {
        console.error('Failed to load reports:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  const exportCSV = () => {
    if (!report) return;

    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Category,Metric,Value\n';
    csvContent += `Sales,Total Revenue,${report.sales?.totalSales || 0}\n`;
    csvContent += `Sales,Order Count,${report.sales?.orderCount || 0}\n`;
    csvContent += `Sales,Average Order Value,${report.sales?.averageOrderValue || 0}\n`;
    csvContent += `Hotel,Total Revenue,${report.hotel?.totalRevenue || 0}\n`;
    csvContent += `Hotel,Occupancy Rate %,${report.hotel?.occupancyRate || 0}\n`;
    csvContent += `Inventory,Valuation,${report.inventory?.inventoryValuation || 0}\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Haven_Hearth_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-forest-800 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const chartData = report?.channelSales
    ? Object.entries(report.channelSales).map(([channel, data]: [string, any]) => ({
        channel: channel.replace('_', ' '),
        revenue: data.total,
        count: data.count,
      }))
    : [];

  return (
    <div className="space-y-8 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-terracotta-600">
            Business Intelligence
          </span>
          <h1 className="font-serif text-3xl font-bold text-charcoal-900 mt-0.5">
            Operational Analytics &amp; Performance
          </h1>
          <p className="text-xs text-charcoal-500 mt-1">
            Aggregated revenue, occupancy statistics, and menu performance metrics.
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-ivory-50 text-xs font-bold shadow-soft transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Export Summary CSV</span>
        </button>
      </div>

      {/* Visual Chart Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-ivory-300 shadow-soft">
        <div className="flex items-center justify-between pb-6 border-b border-ivory-200">
          <div>
            <h2 className="font-serif text-xl font-bold text-charcoal-900">
              Revenue by Hospitality Channel ($)
            </h2>
            <p className="text-xs text-charcoal-500 mt-0.5">
              Live server-side aggregation across dining rooms, room service, and takeout.
            </p>
          </div>
          <BarChart3 className="w-5 h-5 text-forest-700" />
        </div>

        <div className="h-80 w-full mt-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ECE3D8" />
              <XAxis dataKey="channel" stroke="#585E5A" fontSize={12} tickLine={false} />
              <YAxis stroke="#585E5A" fontSize={12} tickLine={false} />
              <Tooltip
                formatter={(value: any) => [formatCurrency(Number(value)), 'Revenue']}
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid #ECE3D8',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                }}
              />
              <Bar dataKey="revenue" fill="#1A382B" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Numerical Data Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-ivory-300 shadow-soft">
          <span className="text-[10px] font-bold text-charcoal-400 uppercase">Hospitality Revenue</span>
          <p className="font-serif text-3xl font-bold text-forest-900 mt-1">
            {formatCurrency(report.sales?.totalSales || 0)}
          </p>
          <span className="text-xs text-charcoal-500 mt-2 block">
            {report.sales?.orderCount || 0} Total Orders Handled
          </span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-ivory-300 shadow-soft">
          <span className="text-[10px] font-bold text-charcoal-400 uppercase">Hotel Suite Bookings</span>
          <p className="font-serif text-3xl font-bold text-purple-900 mt-1">
            {formatCurrency(report.hotel?.totalRevenue || 0)}
          </p>
          <span className="text-xs text-charcoal-500 mt-2 block">
            {report.hotel?.bookingCount || 0} Bookings • {report.hotel?.occupancyRate || 0}% Occupancy
          </span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-ivory-300 shadow-soft">
          <span className="text-[10px] font-bold text-charcoal-400 uppercase">Pantry Asset Valuation</span>
          <p className="font-serif text-3xl font-bold text-amber-900 mt-1">
            {formatCurrency(report.inventory?.inventoryValuation || 0)}
          </p>
          <span className="text-xs text-charcoal-500 mt-2 block">
            {report.inventory?.totalIngredients || 0} Ingredients Managed
          </span>
        </div>
      </div>
    </div>
  );
};
