import React, { useState, useEffect } from 'react';
import { clinicalService } from '../../services/clinicalService';
import { initialPatients } from '../../services/mockData';
import { NursingTask } from '../../types/clinical';
import { GlassCard } from '../../components/ui/GlassCard';
import { StatCard } from '../../components/ui/StatCard';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { useNotification } from '../../context/NotificationContext';
import {
  HeartPulse,
  Activity,
  Pill,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus
} from 'lucide-react';

export const NursingPage: React.FC = () => {
  const { showToast } = useNotification();
  const [tasks, setTasks] = useState<NursingTask[]>([]);
  const [isVitalsModalOpen, setIsVitalsModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(initialPatients[0].fullName);
  const [temp, setTemp] = useState('98.6');
  const [bp, setBp] = useState('120/80');
  const [pulse, setPulse] = useState('74');
  const [spo2, setSpo2] = useState('99');
  const [isLoading, setIsLoading] = useState(true);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const data = await clinicalService.getNursingTasks();
      setTasks(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCompleteTask = async (taskId: string) => {
    try {
      await clinicalService.completeNursingTask(taskId, 'Sister Pratima Patil');
      showToast('Nursing task recorded as completed', 'success');
      fetchTasks();
    } catch {
      showToast('Failed to complete task', 'error');
    }
  };

  const handleSaveVitals = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(`Vitals logged for ${selectedPatient}: BP ${bp}, Pulse ${pulse}, SpO2 ${spo2}%`, 'success', 'Vitals Charted');
    setIsVitalsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight font-sans">
            Central Nursing Station
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
            Inpatient vitals charting, medication round schedule, and bedside alerts
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setIsVitalsModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Chart Vitals
        </Button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          label="Assigned Inpatients"
          value="18"
          icon={<HeartPulse className="w-5 h-5 text-accent-primary" />}
          comparisonText="Ward 2A & 2B"
          indicatorColor="primary"
        />
        <StatCard
          label="Vitals Due"
          value="4"
          icon={<Activity className="w-5 h-5 text-status-warning" />}
          comparisonText="Hourly / 4-hourly"
          indicatorColor="warning"
        />
        <StatCard
          label="Medications Due"
          value="9"
          icon={<Pill className="w-5 h-5 text-accent-secondary" />}
          comparisonText="12:00 PM round"
          indicatorColor="secondary"
        />
        <StatCard
          label="Completed Rounds"
          value="34"
          icon={<CheckCircle2 className="w-5 h-5 text-status-success" />}
          comparisonText="Today's shift"
          indicatorColor="success"
        />
      </div>

      {/* Nursing Task Worklist */}
      <GlassCard className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-text-primary">Shift Task Schedule & Medication Rounds</h2>
            <p className="text-xs text-text-muted">Real-time nurse execution queue with priority tags</p>
          </div>
          <span className="text-xs font-mono text-text-muted">{tasks.length} Tasks Scheduled</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/[0.08] text-text-muted uppercase">
                <th className="py-2.5 px-3">Due Time</th>
                <th className="py-2.5 px-3">Patient & Bed</th>
                <th className="py-2.5 px-3">Task Type</th>
                <th className="py-2.5 px-3">Priority</th>
                <th className="py-2.5 px-3">Clinical Instructions</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {tasks.map(task => (
                <tr key={task.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-accent-primary whitespace-nowrap">
                    {task.dueTime}
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-text-primary">{task.patientName}</div>
                    <div className="text-[10px] text-accent-secondary font-mono">{task.roomBed}</div>
                  </td>
                  <td className="py-3 px-3 font-medium text-text-secondary">{task.taskType}</td>
                  <td className="py-3 px-3">
                    <Badge variant={task.priority === 'High' ? 'danger' : 'neutral'} size="sm">
                      {task.priority}
                    </Badge>
                  </td>
                  <td className="py-3 px-3 text-text-secondary max-w-sm">{task.instructions}</td>
                  <td className="py-3 px-3">
                    <StatusBadge status={task.status} size="sm" />
                  </td>
                  <td className="py-3 px-3 text-right">
                    {task.status !== 'Completed' ? (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleCompleteTask(task.id)}
                        leftIcon={<CheckCircle2 className="w-3.5 h-3.5 text-status-success" />}
                        className="py-1 text-xs"
                      >
                        Mark Done
                      </Button>
                    ) : (
                      <span className="text-[11px] text-text-muted font-mono">
                        Done at {task.completedAt}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Chart Vitals Modal */}
      <Modal
        isOpen={isVitalsModalOpen}
        onClose={() => setIsVitalsModalOpen(false)}
        title="Log Patient Bedside Vitals"
        subtitle="Record observational physiological data into EHR"
        maxWidth="md"
      >
        <form onSubmit={handleSaveVitals} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-text-secondary block mb-1">Select Patient</label>
            <select
              value={selectedPatient}
              onChange={e => setSelectedPatient(e.target.value)}
              className="w-full bg-[#0F131A] text-text-primary text-sm rounded-xl border border-white/[0.1] p-2.5"
            >
              {initialPatients.map(p => (
                <option key={p.id} value={p.fullName}>{p.fullName} ({p.mrn})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input label="Blood Pressure" value={bp} onChange={e => setBp(e.target.value)} helperText="mmHg" />
            <Input label="Pulse" value={pulse} onChange={e => setPulse(e.target.value)} helperText="bpm" />
            <Input label="Temperature" value={temp} onChange={e => setTemp(e.target.value)} helperText="°F" />
            <Input label="SpO2" value={spo2} onChange={e => setSpo2(e.target.value)} helperText="%" />
          </div>

          <div className="pt-3 border-t border-white/[0.08] flex items-center justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsVitalsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" leftIcon={<CheckCircle2 className="w-4 h-4" />}>
              Save Vitals
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
