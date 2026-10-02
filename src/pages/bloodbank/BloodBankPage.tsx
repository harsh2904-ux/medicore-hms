import React, { useState, useEffect } from 'react';
import { operationsService } from '../../services/operationsService';
import { BloodStockItem } from '../../types/operations';
import { GlassCard } from '../../components/ui/GlassCard';
import { StatCard } from '../../components/ui/StatCard';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { useNotification } from '../../context/NotificationContext';
import {
  Droplets,
  Plus,
  Minus,
  AlertTriangle,
  CheckCircle2,
  Heart
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export const BloodBankPage: React.FC = () => {
  const { showToast } = useNotification();
  const [bloodStock, setBloodStock] = useState<BloodStockItem[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<BloodStockItem | null>(null);
  const [unitsDelta, setUnitsDelta] = useState<number>(2);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBlood = async () => {
    setIsLoading(true);
    try {
      const data = await operationsService.getBloodBank();
      setBloodStock(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlood();
  }, []);

  const totalUnits = bloodStock.reduce((acc, curr) => acc + curr.unitsAvailable, 0);
  const totalReserved = bloodStock.reduce((acc, curr) => acc + curr.reservedUnits, 0);

  const handleUpdateUnits = async (delta: number) => {
    if (!selectedGroup) return;
    try {
      await operationsService.updateBloodUnits(selectedGroup.bloodGroup, delta);
      showToast(`Updated units for ${selectedGroup.bloodGroup} by ${delta > 0 ? '+' : ''}${delta}`, 'success');
      setIsUpdateModalOpen(false);
      fetchBlood();
    } catch {
      showToast('Update failed', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight font-sans">
            Blood Bank & Transfusion Medicine
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
            Component separation (PRBC, FFP, Platelets), ABO inventory reserve, and critical alert monitoring
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => {
            setSelectedGroup(bloodStock[0] || null);
            setIsUpdateModalOpen(true);
          }}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Receive Blood Bags
        </Button>
      </div>

      {/* Blood Bank KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          label="Total Units Stocked"
          value={totalUnits}
          icon={<Droplets className="w-5 h-5 text-status-danger" />}
          comparisonText="Tested & screened"
          indicatorColor="danger"
        />
        <StatCard
          label="Reserved Units"
          value={totalReserved}
          icon={<Heart className="w-5 h-5 text-status-warning" />}
          comparisonText="Cross-matched for surgery"
          indicatorColor="warning"
        />
        <StatCard
          label="Universal Donors (O-)"
          value="5 Units"
          icon={<AlertTriangle className="w-5 h-5 text-amber-400" />}
          comparisonText="Critical emergency pool"
          indicatorColor="warning"
        />
        <StatCard
          label="Screening Safety"
          value="100% NAT"
          icon={<CheckCircle2 className="w-5 h-5 text-status-success" />}
          comparisonText="Zero transfusion infections"
          indicatorColor="success"
        />
      </div>

      {/* Blood Groups Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {bloodStock.map(b => {
          const isCritical = b.unitsAvailable <= b.criticalThreshold;
          return (
            <GlassCard
              key={b.bloodGroup}
              onClick={() => {
                setSelectedGroup(b);
                setIsUpdateModalOpen(true);
              }}
              className={`p-5 cursor-pointer hover:border-white/[0.18] transition-all relative overflow-hidden ${
                isCritical ? 'border-status-danger/40 bg-status-danger/[0.03]' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl font-bold font-mono text-status-danger">
                  {b.bloodGroup}
                </span>
                {isCritical ? (
                  <Badge variant="danger" size="sm">
                    Low Stock
                  </Badge>
                ) : (
                  <Badge variant="success" size="sm">
                    Adequate
                  </Badge>
                )}
              </div>

              <div className="space-y-1">
                <div className="text-2xl font-bold text-text-primary font-mono">
                  {b.unitsAvailable} <span className="text-xs font-normal text-text-muted">Units Available</span>
                </div>
                <div className="text-xs text-text-secondary">
                  Reserved: <strong className="font-mono text-text-primary">{b.reservedUnits}</strong> units
                </div>
                <div className="text-[10px] text-text-muted pt-1">
                  Threshold: {b.criticalThreshold} units • {b.lastUpdated}
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Stock Chart */}
      <GlassCard className="p-5">
        <h3 className="text-sm font-semibold text-text-primary mb-1">ABO / Rh Blood Units Inventory Graph</h3>
        <p className="text-xs text-text-muted mb-4">Available vs Critical Threshold units across blood phenotypes</p>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={bloodStock} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="bloodGroup" stroke="#687386" fontSize={12} tickLine={false} />
              <YAxis stroke="#687386" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F131A',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '12px',
                  color: '#F5F7FA'
                }}
              />
              <Bar dataKey="unitsAvailable" name="Available Units" fill="#FF5C70" radius={[6, 6, 0, 0]} />
              <Bar dataKey="reservedUnits" name="Reserved Units" fill="#FFB547" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      {/* Update Blood Units Modal */}
      {selectedGroup && (
        <Modal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          title={`Update Blood Bank Stock: ${selectedGroup.bloodGroup}`}
          subtitle={`Current Available: ${selectedGroup.unitsAvailable} Units • Reserved: ${selectedGroup.reservedUnits} Units`}
          maxWidth="sm"
        >
          <div className="space-y-4">
            <Input
              label="Quantity to Add / Issue (Units)"
              type="number"
              min={1}
              value={unitsDelta}
              onChange={e => setUnitsDelta(Number(e.target.value))}
            />

            <div className="grid grid-cols-2 gap-2 pt-2">
              <Button
                variant="primary"
                onClick={() => handleUpdateUnits(unitsDelta)}
                leftIcon={<Plus className="w-3.5 h-3.5" />}
              >
                Add Stock (+{unitsDelta})
              </Button>
              <Button
                variant="outline"
                onClick={() => handleUpdateUnits(-unitsDelta)}
                leftIcon={<Minus className="w-3.5 h-3.5 text-status-danger" />}
              >
                Issue / Cross-match (-{unitsDelta})
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
