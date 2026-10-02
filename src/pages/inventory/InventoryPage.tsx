import React, { useState, useEffect } from 'react';
import { pharmacyService } from '../../services/pharmacyService';
import { InventoryItem } from '../../types/pharmacy';
import { GlassCard } from '../../components/ui/GlassCard';
import { StatCard } from '../../components/ui/StatCard';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Button } from '../../components/ui/Button';
import { useNotification } from '../../context/NotificationContext';
import {
  Package,
  AlertTriangle,
  Clock,
  ShoppingCart,
  Plus,
  Truck,
  CheckCircle2
} from 'lucide-react';

export const InventoryPage: React.FC = () => {
  const { showToast } = useNotification();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInv = async () => {
      setIsLoading(true);
      try {
        const data = await pharmacyService.getGeneralInventory();
        setItems(data);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInv();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight font-sans">
            Hospital Supply & Inventory
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
            Surgical disposables, PPE, diagnostic reagents, and procurement orders
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => showToast('Purchase order PO-2026-991 created', 'success')}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Create Purchase Order
        </Button>
      </div>

      {/* Inventory KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          label="Total Supply Items"
          value="1,450"
          icon={<Package className="w-5 h-5 text-accent-primary" />}
          comparisonText="Stocked across 3 bays"
          indicatorColor="primary"
        />
        <StatCard
          label="Low Stock Alerts"
          value="4"
          icon={<AlertTriangle className="w-5 h-5 text-status-warning" />}
          comparisonText="Reorder needed"
          indicatorColor="warning"
        />
        <StatCard
          label="Expiring (30 Days)"
          value="2"
          icon={<Clock className="w-5 h-5 text-status-danger" />}
          comparisonText="Action required"
          indicatorColor="danger"
        />
        <StatCard
          label="Purchase Orders"
          value="14"
          icon={<ShoppingCart className="w-5 h-5 text-status-success" />}
          comparisonText="6 delivered this week"
          indicatorColor="success"
        />
      </div>

      {/* Stock Items Table */}
      <GlassCard className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-text-primary">Medical Supply Stock Roster</h2>
            <p className="text-xs text-text-muted">Live on-hand balance and vendor replenishment thresholds</p>
          </div>
          <span className="text-xs font-mono text-text-muted">{items.length} Tracked Categories</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/[0.08] text-text-muted uppercase">
                <th className="py-2.5 px-3">Item Code</th>
                <th className="py-2.5 px-3">Description</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Primary Supplier</th>
                <th className="py-2.5 px-3">On Hand</th>
                <th className="py-2.5 px-3">Unit Cost</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {items.map(it => (
                <tr key={it.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-3 font-mono font-semibold text-accent-primary">{it.code}</td>
                  <td className="py-3 px-3 font-medium text-text-primary text-sm">{it.name}</td>
                  <td className="py-3 px-3 text-text-muted">{it.category}</td>
                  <td className="py-3 px-3 text-text-secondary">{it.supplier}</td>
                  <td className="py-3 px-3 font-mono font-bold text-text-primary">
                    {it.quantityOnHand} {it.unit}
                  </td>
                  <td className="py-3 px-3 font-mono text-status-success">₹{it.unitCost.toFixed(2)}</td>
                  <td className="py-3 px-3">
                    <StatusBadge status={it.status} size="sm" />
                  </td>
                  <td className="py-3 px-3 text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => showToast(`Restock requisition dispatched for ${it.name}`, 'info')}
                      leftIcon={<Truck className="w-3.5 h-3.5" />}
                      className="py-1 text-xs"
                    >
                      Reorder
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};
