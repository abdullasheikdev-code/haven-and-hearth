import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../lib/utils';
import { StockMovementTypes } from '@haven/shared';
import {
  Boxes,
  AlertTriangle,
  Plus,
  RefreshCw,
  Truck,
  CheckCircle2,
  X,
  FileText,
  DollarSign,
} from 'lucide-react';

export const InventoryPage: React.FC = () => {
  const { user } = useAuth();
  const [ingredients, setIngredients] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Stock Adjustment Modal
  const [adjustingIngredient, setAdjustingIngredient] = useState<any>(null);
  const [adjType, setAdjType] = useState<string>(StockMovementTypes.USAGE);
  const [adjQuantity, setAdjQuantity] = useState<number>(1);
  const [adjReason, setAdjReason] = useState<string>('Daily dinner prep usage');
  const [submittingAdj, setSubmittingAdj] = useState(false);

  const fetchData = async () => {
    try {
      const branchId = user?.branchId;
      const [ingData, supData, poData] = await Promise.all([
        api.get<any[]>(`/inventory/ingredients?branchId=${branchId}`),
        api.get<any[]>(`/inventory/suppliers?branchId=${branchId}`),
        api.get<any[]>(`/inventory/purchases?branchId=${branchId}`),
      ]);
      setIngredients(ingData || []);
      setSuppliers(supData || []);
      setPurchaseOrders(poData || []);
    } catch (err) {
      console.error('Failed to load inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleAdjustStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingIngredient) return;

    try {
      setSubmittingAdj(true);
      await api.post('/inventory/movements', {
        ingredientId: adjustingIngredient._id,
        type: adjType,
        quantity: Number(adjQuantity),
        reason: adjReason,
      });

      setAdjustingIngredient(null);
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to adjust stock');
    } finally {
      setSubmittingAdj(false);
    }
  };

  const handleReceivePO = async (poId: string) => {
    try {
      await api.patch(`/inventory/purchases/${poId}/receive`);
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to receive purchase order');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-forest-800 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const lowStockCount = ingredients.filter((i) => i.currentStock <= i.minimumThreshold).length;
  const valuation = ingredients.reduce((sum, i) => sum + i.currentStock * i.costPerUnit, 0);

  return (
    <div className="space-y-8 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-terracotta-600">
            Pantry &amp; Procurement
          </span>
          <h1 className="font-serif text-3xl font-bold text-charcoal-900 mt-0.5">
            Inventory &amp; Stock Levels
          </h1>
          <p className="text-xs text-charcoal-500 mt-1">
            Authoritative ingredient stocks, threshold alerts, and supplier purchase orders.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white px-4 py-2 rounded-2xl border border-ivory-300 shadow-soft text-right">
            <span className="text-[10px] text-charcoal-400 uppercase font-bold block">Pantry Value</span>
            <span className="font-serif text-lg font-bold text-forest-900">{formatCurrency(valuation)}</span>
          </div>
          {lowStockCount > 0 && (
            <div className="bg-amber-50 px-4 py-2 rounded-2xl border border-amber-200 text-amber-900 font-bold text-xs flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>{lowStockCount} Low Stock</span>
            </div>
          )}
        </div>
      </div>

      {/* Ingredients Stock Table Card */}
      <div className="bg-white rounded-3xl border border-ivory-300 shadow-soft overflow-hidden">
        <div className="p-6 border-b border-ivory-200 flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold text-charcoal-900">Ingredients Master Table</h2>
          <span className="text-xs font-semibold text-charcoal-500">{ingredients.length} Ingredients</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-ivory-100 border-b border-ivory-200 text-charcoal-600 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-6">SKU</th>
                <th className="py-3 px-6">Ingredient Name</th>
                <th className="py-3 px-6">Current Stock</th>
                <th className="py-3 px-6">Threshold</th>
                <th className="py-3 px-6">Cost / Unit</th>
                <th className="py-3 px-6">Supplier</th>
                <th className="py-3 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ivory-200">
              {ingredients.map((ing) => {
                const isLow = ing.currentStock <= ing.minimumThreshold;
                return (
                  <tr key={ing._id} className="hover:bg-ivory-50 transition-colors">
                    <td className="py-3.5 px-6 font-mono font-bold text-charcoal-600">{ing.sku}</td>
                    <td className="py-3.5 px-6 font-bold text-charcoal-900">{ing.name}</td>
                    <td className="py-3.5 px-6">
                      <span
                        className={`font-mono font-bold text-sm ${
                          isLow ? 'text-red-600' : 'text-forest-900'
                        }`}
                      >
                        {ing.currentStock} {ing.unit}
                      </span>
                      {isLow && (
                        <span className="ml-2 px-2 py-0.5 rounded bg-red-100 text-red-800 text-[10px] font-bold">
                          Low Stock
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-6 text-charcoal-500 font-mono">
                      {ing.minimumThreshold} {ing.unit}
                    </td>
                    <td className="py-3.5 px-6 font-mono font-semibold text-charcoal-800">
                      {formatCurrency(ing.costPerUnit)}
                    </td>
                    <td className="py-3.5 px-6 text-charcoal-600">{ing.supplierId?.name || 'Local Market'}</td>
                    <td className="py-3.5 px-6 text-right">
                      <button
                        onClick={() => {
                          setAdjustingIngredient(ing);
                          setAdjQuantity(1);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-ivory-200 hover:bg-ivory-300 text-charcoal-800 font-bold text-[11px] transition-colors"
                      >
                        Adjust Stock
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Purchase Orders Section */}
      <div className="bg-white rounded-3xl border border-ivory-300 shadow-soft p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-ivory-200">
          <div>
            <h2 className="font-serif text-xl font-bold text-charcoal-900">
              Procurement &amp; Purchase Orders
            </h2>
            <p className="text-xs text-charcoal-500 mt-0.5">
              Orders placed with organic suppliers. Receiving orders automatically increments pantry inventory.
            </p>
          </div>
          <Truck className="w-5 h-5 text-forest-700" />
        </div>

        {purchaseOrders.length === 0 ? (
          <p className="text-xs text-charcoal-400 py-4 text-center">No purchase orders found.</p>
        ) : (
          <div className="divide-y divide-ivory-200">
            {purchaseOrders.map((po) => {
              const isReceived = po.status === 'RECEIVED';
              return (
                <div key={po._id} className="py-4 first:pt-0 flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-forest-900">{po.poNumber}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          isReceived ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {po.status}
                      </span>
                    </div>
                    <p className="text-xs text-charcoal-700 mt-1 font-semibold">
                      Supplier: {po.supplierId?.name}
                    </p>
                    <p className="text-[11px] text-charcoal-500">
                      Items: {po.items?.map((i: any) => `${i.quantity} ${i.unit} ${i.ingredientName}`).join(', ')}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="font-mono font-bold text-sm text-forest-900">
                      {formatCurrency(po.totalAmount)}
                    </span>
                    {!isReceived && (
                      <button
                        onClick={() => handleReceivePO(po._id)}
                        className="px-3.5 py-1.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-ivory-50 text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
                      >
                        Receive Goods
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Stock Adjustment Modal */}
      {adjustingIngredient && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-editorial border border-ivory-300 animate-in zoom-in-95 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-ivory-200">
              <h3 className="font-serif text-lg font-bold text-charcoal-900">
                Adjust {adjustingIngredient.name}
              </h3>
              <button onClick={() => setAdjustingIngredient(null)}>
                <X className="w-5 h-5 text-charcoal-400" />
              </button>
            </div>

            <form onSubmit={handleAdjustStock} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-charcoal-700 mb-1">
                  Adjustment Type
                </label>
                <select
                  value={adjType}
                  onChange={(e) => setAdjType(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-ivory-100 border border-ivory-300 font-semibold focus:outline-none"
                >
                  <option value={StockMovementTypes.USAGE}>Kitchen Usage (Deduction)</option>
                  <option value={StockMovementTypes.WASTAGE}>Spoilage / Wastage (Deduction)</option>
                  <option value={StockMovementTypes.PURCHASE}>Direct Restock (Addition)</option>
                  <option value={StockMovementTypes.ADJUSTMENT}>Count Correction</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-charcoal-700 mb-1">
                  Quantity ({adjustingIngredient.unit})
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={adjQuantity}
                  onChange={(e) => setAdjQuantity(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-ivory-100 border border-ivory-300 font-bold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-charcoal-700 mb-1">
                  Reason / Audit Log Note
                </label>
                <input
                  type="text"
                  required
                  value={adjReason}
                  onChange={(e) => setAdjReason(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-ivory-100 border border-ivory-300 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={submittingAdj}
                className="w-full py-3 rounded-xl bg-forest-800 hover:bg-forest-900 disabled:opacity-50 text-ivory-50 text-xs font-bold uppercase tracking-wider"
              >
                {submittingAdj ? 'Recording...' : 'Save Stock Movement'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
