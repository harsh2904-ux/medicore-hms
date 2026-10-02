import React, { useState, useEffect } from 'react';
import { pharmacyService } from '../../services/pharmacyService';
import { MedicineItem, PharmacyPrescriptionOrder } from '../../types/pharmacy';
import { GlassCard } from '../../components/ui/GlassCard';
import { StatCard } from '../../components/ui/StatCard';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Button } from '../../components/ui/Button';
import { Tabs } from '../../components/ui/Tabs';
import { SearchInput } from '../../components/ui/SearchInput';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { useNotification } from '../../context/NotificationContext';
import {
  Pill,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Plus,
  ArrowRightLeft,
  Package,
  Layers
} from 'lucide-react';

export const PharmacyPage: React.FC = () => {
  const { showToast } = useNotification();
  const [activeTab, setActiveTab] = useState<'prescriptions' | 'inventory'>('prescriptions');
  const [prescriptions, setPrescriptions] = useState<PharmacyPrescriptionOrder[]>([]);
  const [medicines, setMedicines] = useState<MedicineItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedMed, setSelectedMed] = useState<MedicineItem | null>(null);
  const [adjustQuantity, setAdjustQuantity] = useState<number>(100);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [isAddMedModalOpen, setIsAddMedModalOpen] = useState(false);

  // Add medicine state
  const [newMedName, setNewMedName] = useState('');
  const [newMedGeneric, setNewMedGeneric] = useState('');
  const [newMedCategory, setNewMedCategory] = useState<any>('Antibiotic');
  const [newMedBatch, setNewMedBatch] = useState('BAT-2026-09');
  const [newMedExpiry, setNewMedExpiry] = useState('2027-12-31');
  const [newMedStock, setNewMedStock] = useState(200);
  const [newMedMrp, setNewMedMrp] = useState(150);
  const [newMedLocation, setNewMedLocation] = useState('Rack A-01');

  const [isLoading, setIsLoading] = useState(true);

  const fetchPharmacyData = async () => {
    setIsLoading(true);
    try {
      const [rxRes, medRes] = await Promise.all([
        pharmacyService.getPrescriptions(),
        pharmacyService.getMedicines({ search: searchQuery, status: statusFilter }),
      ]);
      setPrescriptions(rxRes);
      setMedicines(medRes);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPharmacyData();
  }, [searchQuery, statusFilter]);

  const handleDispense = async (orderId: string) => {
    try {
      await pharmacyService.dispensePrescription(orderId, 'Deepak Sawant (Pharmacist)');
      showToast('Prescription order dispensed and stock decremented', 'success', 'Medicines Dispensed');
      fetchPharmacyData();
    } catch {
      showToast('Dispensing failed', 'error');
    }
  };

  const handleStockUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMed) return;
    try {
      await pharmacyService.updateStock(selectedMed.id, adjustQuantity);
      showToast(`Stock updated for ${selectedMed.name} to ${adjustQuantity} units`, 'success');
      setIsStockModalOpen(false);
      fetchPharmacyData();
    } catch {
      showToast('Failed to adjust stock', 'error');
    }
  };

  const handleAddMedicineSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await pharmacyService.addMedicine({
        name: newMedName,
        genericName: newMedGeneric,
        category: newMedCategory,
        manufacturer: 'Cipla Ltd',
        batchNumber: newMedBatch,
        expiryDate: newMedExpiry,
        stockQuantity: newMedStock,
        reorderLevel: 50,
        unit: 'Tablets',
        mrp: newMedMrp,
        purchasePrice: Math.round(newMedMrp * 0.7),
        status: 'In Stock',
        locationRack: newMedLocation,
      });
      showToast(`Medicine ${newMedName} added to catalog`, 'success');
      setIsAddMedModalOpen(false);
      fetchPharmacyData();
    } catch {
      showToast('Failed to add medicine', 'error');
    }
  };

  const tabs = [
    { id: 'prescriptions', label: 'Prescription Queue', badge: prescriptions.filter(p => p.status === 'Pending').length },
    { id: 'inventory', label: 'Medicine Catalog & Stock', badge: medicines.length },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight font-sans">
            Central Pharmacy & Drug Formulary
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
            Prescription verification, automated dispensing, batch tracking, and shelf reconciliation
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            onClick={() => setIsAddMedModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Medicine
          </Button>
        </div>
      </div>

      {/* Pharmacy KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <StatCard
          label="Today's Prescriptions"
          value="94"
          icon={<Pill className="w-5 h-5 text-accent-primary" />}
          comparisonText="From OPD & IPD"
          indicatorColor="primary"
        />
        <StatCard
          label="Dispensed Orders"
          value="86"
          icon={<CheckCircle2 className="w-5 h-5 text-status-success" />}
          comparisonText="91% fulfilled"
          indicatorColor="success"
        />
        <StatCard
          label="Pending Queue"
          value="8"
          icon={<Clock className="w-5 h-5 text-status-warning" />}
          comparisonText="Avg dispense 4m"
          indicatorColor="warning"
        />
        <StatCard
          label="Low Stock Alerts"
          value="3"
          icon={<AlertTriangle className="w-5 h-5 text-status-danger" />}
          comparisonText="Below threshold"
          indicatorColor="danger"
        />
        <StatCard
          label="Total Formulary Items"
          value="640"
          icon={<Package className="w-5 h-5 text-accent-secondary" />}
          comparisonText="Active batches"
          indicatorColor="secondary"
        />
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={(id) => setActiveTab(id as any)} />

      {/* TAB 1: Prescription Queue */}
      {activeTab === 'prescriptions' && (
        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-text-primary">E-Prescription Dispensing Worklist</h2>
              <p className="text-xs text-text-muted">Physician electronic orders awaiting pharmacist packaging and dispensing</p>
            </div>
            <span className="text-xs font-mono text-text-muted">{prescriptions.length} Active Orders</span>
          </div>

          <div className="space-y-4">
            {prescriptions.map(order => (
              <div
                key={order.id}
                className="p-4 rounded-xl bg-white/[0.025] border border-white/[0.06] flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-mono text-xs font-bold text-accent-primary bg-accent-primary/10 px-2 py-0.5 rounded">
                      {order.id}
                    </span>
                    <h3 className="font-bold text-sm text-text-primary">{order.patientName}</h3>
                    <span className="font-mono text-xs text-text-muted">({order.mrn})</span>
                    <StatusBadge status={order.status} size="sm" />
                  </div>

                  <div className="text-xs text-text-secondary">
                    Prescribed by: <strong className="text-text-primary">{order.prescribedBy}</strong> • {order.prescribedDate}
                  </div>

                  {/* Item pills */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {order.items.map(it => (
                      <span key={it.id} className="text-[11px] px-2 py-0.5 rounded-lg bg-white/[0.05] border border-white/[0.06] text-text-secondary">
                        {it.medicineName} ({it.dosage}) • {it.frequency}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <div className="text-xs text-text-muted">Total Bill</div>
                    <div className="font-mono text-sm font-bold text-status-success">
                      ₹{order.totalAmount.toFixed(2)}
                    </div>
                  </div>

                  {order.status === 'Pending' ? (
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => handleDispense(order.id)}
                      leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                    >
                      Dispense Now
                    </Button>
                  ) : (
                    <div className="text-right text-[11px] text-text-muted">
                      <span className="text-status-success font-medium">Dispensed</span>
                      <div>by {order.dispensedBy}</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* TAB 2: Medicine Catalog & Stock */}
      {activeTab === 'inventory' && (
        <GlassCard className="p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2 flex-1 max-w-sm">
              <SearchInput
                placeholder="Search medicine, generic, batch..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onClear={() => setSearchQuery('')}
              />
            </div>

            <Select
              options={[
                { value: 'All', label: 'All Status' },
                { value: 'In Stock', label: 'In Stock' },
                { value: 'Low Stock', label: 'Low Stock' },
                { value: 'Expiring', label: 'Expiring Soon' },
                { value: 'Out of Stock', label: 'Out of Stock' },
              ]}
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="py-1 text-xs min-w-[140px]"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[750px]">
              <thead>
                <tr className="border-b border-white/[0.08] text-text-muted uppercase">
                  <th className="py-2.5 px-3">Medicine Brand</th>
                  <th className="py-2.5 px-3">Generic Salt</th>
                  <th className="py-2.5 px-3">Batch & Rack</th>
                  <th className="py-2.5 px-3">Expiry Date</th>
                  <th className="py-2.5 px-3">Stock Units</th>
                  <th className="py-2.5 px-3">MRP (₹)</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {medicines.map(med => (
                  <tr key={med.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-semibold text-text-primary text-sm">{med.name}</div>
                      <div className="text-[10px] text-text-muted">{med.manufacturer}</div>
                    </td>
                    <td className="py-3 px-3 text-text-secondary">{med.genericName}</td>
                    <td className="py-3 px-3 font-mono">
                      <span className="text-text-primary">{med.batchNumber}</span>
                      <div className="text-[10px] text-accent-secondary">{med.locationRack}</div>
                    </td>
                    <td className="py-3 px-3 font-mono text-text-muted">{med.expiryDate}</td>
                    <td className="py-3 px-3 font-mono font-bold text-text-primary">
                      {med.stockQuantity} {med.unit}
                    </td>
                    <td className="py-3 px-3 font-mono text-status-success font-semibold">
                      ₹{med.mrp.toFixed(2)}
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge status={med.status} size="sm" />
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          setSelectedMed(med);
                          setAdjustQuantity(med.stockQuantity);
                          setIsStockModalOpen(true);
                        }}
                        leftIcon={<ArrowRightLeft className="w-3.5 h-3.5 text-accent-primary" />}
                        className="py-1 text-xs"
                      >
                        Adjust Stock
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {/* Adjust Stock Modal */}
      {selectedMed && (
        <Modal
          isOpen={isStockModalOpen}
          onClose={() => setIsStockModalOpen(false)}
          title={`Adjust Inventory: ${selectedMed.name}`}
          subtitle={`Batch: ${selectedMed.batchNumber} • Current Stock: ${selectedMed.stockQuantity} ${selectedMed.unit}`}
          maxWidth="sm"
        >
          <form onSubmit={handleStockUpdate} className="space-y-4">
            <Input
              label="Updated Physical Count (Units)"
              type="number"
              required
              value={adjustQuantity}
              onChange={e => setAdjustQuantity(Number(e.target.value))}
            />
            <div className="pt-2 border-t border-white/[0.08] flex items-center justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsStockModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Save Adjustment
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Add Medicine Modal */}
      <Modal
        isOpen={isAddMedModalOpen}
        onClose={() => setIsAddMedModalOpen(false)}
        title="Add New Medicine to Formulary"
        subtitle="Catalog pharmaceutical brand with batch, MRP and shelf location"
        maxWidth="md"
      >
        <form onSubmit={handleAddMedicineSubmit} className="space-y-4">
          <Input
            label="Brand Name"
            required
            placeholder="e.g. Azithral 500"
            value={newMedName}
            onChange={e => setNewMedName(e.target.value)}
          />
          <Input
            label="Generic Formula"
            required
            placeholder="e.g. Azithromycin 500mg"
            value={newMedGeneric}
            onChange={e => setNewMedGeneric(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Batch Number"
              required
              value={newMedBatch}
              onChange={e => setNewMedBatch(e.target.value)}
            />
            <Input
              label="Expiry Date"
              type="date"
              required
              value={newMedExpiry}
              onChange={e => setNewMedExpiry(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Initial Stock Quantity"
              type="number"
              required
              value={newMedStock}
              onChange={e => setNewMedStock(Number(e.target.value))}
            />
            <Input
              label="MRP (₹)"
              type="number"
              required
              value={newMedMrp}
              onChange={e => setNewMedMrp(Number(e.target.value))}
            />
          </div>
          <Input
            label="Storage Rack / Bay"
            value={newMedLocation}
            onChange={e => setNewMedLocation(e.target.value)}
          />
          <div className="pt-2 border-t border-white/[0.08] flex items-center justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsAddMedModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" leftIcon={<CheckCircle2 className="w-4 h-4" />}>
              Save to Catalog
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
