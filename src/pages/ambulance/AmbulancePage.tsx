import React, { useState, useEffect } from 'react';
import { operationsService } from '../../services/operationsService';
import { AmbulanceVehicle } from '../../types/operations';
import { GlassCard } from '../../components/ui/GlassCard';
import { StatCard } from '../../components/ui/StatCard';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Button } from '../../components/ui/Button';
import { useNotification } from '../../context/NotificationContext';
import {
  Ambulance,
  CheckCircle2,
  Navigation,
  Wrench,
  Phone,
  Fuel,
  MapPin
} from 'lucide-react';

export const AmbulancePage: React.FC = () => {
  const { showToast } = useNotification();
  const [ambulances, setAmbulances] = useState<AmbulanceVehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAmbulances = async () => {
    setIsLoading(true);
    try {
      const data = await operationsService.getAmbulances();
      setAmbulances(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAmbulances();
  }, []);

  const handleDispatch = async (amb: AmbulanceVehicle) => {
    try {
      const newStatus = amb.status === 'Available' ? 'On Trip' : 'Available';
      await operationsService.updateAmbulanceStatus(amb.id, newStatus);
      showToast(`Ambulance ${amb.vehicleNumber} marked as ${newStatus}`, 'success');
      fetchAmbulances();
    } catch {
      showToast('Action failed', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight font-sans">
            Ambulance & Emergency EMS Fleet
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
            Advanced Life Support (ALS) tracking, GPS coordinates, crew allocation, and dispatch
          </p>
        </div>

        <Button
          variant="danger"
          onClick={() => showToast('Emergency 1066 dispatch sequence initialized', 'info')}
          leftIcon={<Navigation className="w-4 h-4" />}
        >
          Dispatch Nearest ALS
        </Button>
      </div>

      {/* Fleet KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          label="Total Fleet Units"
          value="4"
          icon={<Ambulance className="w-5 h-5 text-accent-primary" />}
          comparisonText="2 ALS, 1 BLS, 1 Van"
          indicatorColor="primary"
        />
        <StatCard
          label="Available at Base"
          value="2"
          icon={<CheckCircle2 className="w-5 h-5 text-status-success" />}
          comparisonText="Ready for immediate run"
          indicatorColor="success"
        />
        <StatCard
          label="Active On Trip"
          value="1"
          icon={<Navigation className="w-5 h-5 text-status-warning" />}
          comparisonText="En route to Bandra West"
          indicatorColor="warning"
        />
        <StatCard
          label="In Maintenance"
          value="1"
          icon={<Wrench className="w-5 h-5 text-text-muted" />}
          comparisonText="Routine 10k km service"
          indicatorColor="primary"
        />
      </div>

      {/* Ambulance Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {ambulances.map(amb => (
          <GlassCard key={amb.id} className="p-5 space-y-4 hover:border-white/[0.16]">
            {/* Top row: Vehicle #, Type, Status */}
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono text-sm font-bold text-text-primary">{amb.vehicleNumber}</span>
                <span className="text-xs text-text-muted block mt-0.5">{amb.type}</span>
              </div>
              <StatusBadge status={amb.status} size="sm" />
            </div>

            {/* Crew & Location details */}
            <div className="p-3.5 rounded-xl bg-white/[0.025] border border-white/[0.05] space-y-2 text-xs">
              <div className="flex items-center justify-between text-text-secondary">
                <span>Driver:</span>
                <span className="font-medium text-text-primary flex items-center gap-1">
                  {amb.driverName} <Phone className="w-3 h-3 text-text-muted" /> ({amb.driverPhone})
                </span>
              </div>
              <div className="flex items-center justify-between text-text-secondary">
                <span>EMS Paramedic:</span>
                <span className="font-semibold text-accent-primary">{amb.paramedicName}</span>
              </div>
              <div className="flex items-center justify-between text-text-secondary pt-1 border-t border-white/[0.04]">
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-status-danger" /> Live GPS:</span>
                <span className="text-text-primary truncate max-w-[200px]">{amb.currentLocation}</span>
              </div>
            </div>

            {/* Fuel & Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-white/[0.06] text-xs">
              <div className="flex items-center gap-2">
                <Fuel className="w-4 h-4 text-text-muted" />
                <span className="font-mono text-text-secondary">Fuel: {amb.fuelLevelPercent}%</span>
              </div>

              <Button
                size="sm"
                variant={amb.status === 'Available' ? 'primary' : 'outline'}
                onClick={() => handleDispatch(amb)}
                className="py-1 text-xs"
              >
                {amb.status === 'Available' ? 'Dispatch on Call' : 'Mark Returned to HQ'}
              </Button>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};
