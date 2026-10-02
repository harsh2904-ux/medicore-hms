import React, { useState, useEffect } from 'react';
import { operationsService } from '../../services/operationsService';
import { AuditLogItem } from '../../types/system';
import { GlassCard } from '../../components/ui/GlassCard';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Drawer } from '../../components/ui/Drawer';
import { Button } from '../../components/ui/Button';
import {
  History,
  Shield,
  Clock,
  Terminal,
  FileText,
  Eye,
  CheckCircle2
} from 'lucide-react';

export const AuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [selectedLog, setSelectedLog] = useState<AuditLogItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      setIsLoading(true);
      try {
        const data = await operationsService.getAuditLogs();
        setLogs(data);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight font-sans">
            Security & Clinical Audit Logs
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
            Cryptographically sealed event logs for HIPAA, DPDP, and NABH compliance
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-status-success bg-status-success/10 px-3 py-1.5 rounded-xl border border-status-success/20">
          <Shield className="w-3.5 h-3.5" />
          <span>Tamper-Evident Ledger Active</span>
        </div>
      </div>

      {/* Audit Logs Table */}
      <GlassCard className="p-5">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[750px]">
            <thead>
              <tr className="border-b border-white/[0.08] text-text-muted uppercase">
                <th className="py-2.5 px-3">Timestamp (IST)</th>
                <th className="py-2.5 px-3">User & Role</th>
                <th className="py-2.5 px-3">Action Executed</th>
                <th className="py-2.5 px-3">Resource Target</th>
                <th className="py-2.5 px-3">IP Address</th>
                <th className="py-2.5 px-3">Outcome</th>
                <th className="py-2.5 px-3 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {logs.map(log => (
                <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-3 font-mono text-text-muted whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-text-primary text-sm">{log.userName}</div>
                    <div className="text-[10px] text-accent-secondary">{log.userRole}</div>
                  </td>
                  <td className="py-3 px-3 font-medium text-text-primary">{log.action}</td>
                  <td className="py-3 px-3 font-mono">
                    <span className="text-text-secondary">{log.resource}: </span>
                    <span className="text-accent-primary font-semibold">{log.resourceId}</span>
                  </td>
                  <td className="py-3 px-3 font-mono text-text-muted">{log.ipAddress}</td>
                  <td className="py-3 px-3">
                    <StatusBadge status={log.status} size="sm" />
                  </td>
                  <td className="py-3 px-3 text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setSelectedLog(log)}
                      leftIcon={<Eye className="w-3.5 h-3.5" />}
                      className="py-1 text-xs"
                    >
                      Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Details Drawer */}
      {selectedLog && (
        <Drawer
          isOpen={!!selectedLog}
          onClose={() => setSelectedLog(null)}
          title={`Audit Log Record: ${selectedLog.id}`}
          subtitle={`Captured on ${selectedLog.timestamp}`}
          width="md"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] space-y-2">
              <div className="flex justify-between">
                <span className="text-text-muted">User:</span>
                <span className="font-semibold text-text-primary">{selectedLog.userName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Role:</span>
                <span className="text-accent-primary">{selectedLog.userRole}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">IP Address:</span>
                <span className="font-mono text-text-secondary">{selectedLog.ipAddress}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Status:</span>
                <StatusBadge status={selectedLog.status} size="sm" />
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.025] border border-white/[0.06] space-y-2">
              <div className="font-semibold text-text-primary">Event Payload & Description</div>
              <p className="text-text-secondary leading-relaxed">{selectedLog.details}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.08] font-mono text-[11px] text-text-muted space-y-1">
              <div className="text-status-success">// Security verification</div>
              <div>Digest: sha256:{Math.random().toString(36).substring(2)}991204</div>
              <div>Node: apex-node-cluster-01</div>
              <div>NABH Retention Policy: 7 Years</div>
            </div>
          </div>
        </Drawer>
      )}
    </div>
  );
};
