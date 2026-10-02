import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { patientService } from '../../services/patientService';
import { Patient } from '../../types/patient';
import { DataTable, Column } from '../../components/ui/DataTable';
import { Avatar } from '../../components/ui/Avatar';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { UserPlus, Eye, Stethoscope, BedDouble, Receipt, Download } from 'lucide-react';

export const PatientListPage: React.FC = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [genderFilter, setGenderFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchPatients = async () => {
    setIsLoading(true);
    try {
      const data = await patientService.getPatients({
        department: departmentFilter,
        gender: genderFilter,
        status: statusFilter,
      });
      setPatients(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [departmentFilter, genderFilter, statusFilter]);

  const handleExportCsv = () => {
    if (patients.length === 0) return;
    const headers = ['MRN', 'Full Name', 'Gender', 'Blood Group', 'Phone', 'Email', 'Department', 'Status', 'Last Visit'];
    const rows = patients.map(p => [
      p.mrn,
      `"${p.fullName.replace(/"/g, '""')}"`,
      p.gender,
      p.bloodGroup,
      `"${p.phone}"`,
      `"${p.email}"`,
      `"${p.department}"`,
      p.status,
      p.lastVisit
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `medicore_patients_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns: Column<Patient>[] = [
    {
      key: 'mrn',
      header: 'MRN / ID',
      sortable: true,
      className: 'w-36 font-mono text-xs text-text-secondary',
      render: (p) => <span className="font-semibold text-text-primary">{p.mrn}</span>,
    },
    {
      key: 'fullName',
      header: 'Patient Name',
      sortable: true,
      render: (p) => (
        <div className="flex items-center gap-3">
          <Avatar name={p.fullName} size="sm" />
          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-text-primary text-sm leading-tight hover:text-accent-primary transition-colors">
              {p.fullName}
            </span>
            <span className="text-[11px] text-text-muted truncate">
              {p.email}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'age',
      header: 'Demographics',
      render: (p) => (
        <span className="text-xs text-text-secondary">
          {p.age} yrs • {p.gender}
        </span>
      ),
    },
    {
      key: 'bloodGroup',
      header: 'Blood',
      className: 'w-20',
      render: (p) => (
        <span className="text-xs font-mono font-bold text-accent-secondary bg-accent-secondary/10 px-2 py-0.5 rounded-full border border-accent-secondary/20">
          {p.bloodGroup}
        </span>
      ),
    },
    {
      key: 'phone',
      header: 'Phone / City',
      render: (p) => (
        <div className="flex flex-col text-xs text-text-secondary">
          <span>{p.phone}</span>
          <span className="text-[11px] text-text-muted">{p.city}, {p.state}</span>
        </div>
      ),
    },
    {
      key: 'department',
      header: 'Department',
      sortable: true,
      render: (p) => <span className="text-xs text-text-secondary">{p.department}</span>,
    },
    {
      key: 'lastVisit',
      header: 'Last Visit',
      sortable: true,
      className: 'w-28 text-xs text-text-muted font-mono',
      render: (p) => <span>{p.lastVisit}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      className: 'w-28 text-center',
      render: (p) => <StatusBadge status={p.status} size="sm" />,
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'w-44 text-right',
      render: (p) => (
        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => navigate(`/patients/${p.id}`)}
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/[0.08] transition-colors"
            title="View Patient 360 Profile"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate(`/opd/consultation/${p.id}`)}
            className="p-1.5 rounded-lg text-accent-primary hover:bg-accent-primary/10 transition-colors"
            title="Start Consultation"
          >
            <Stethoscope className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate('/ipd')}
            className="p-1.5 rounded-lg text-status-warning hover:bg-status-warning/10 transition-colors"
            title="Admit Patient"
          >
            <BedDouble className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate('/billing/invoices')}
            className="p-1.5 rounded-lg text-status-success hover:bg-status-success/10 transition-colors"
            title="Create Bill"
          >
            <Receipt className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight font-sans">
            Patients Registry
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
            Master patient index, electronic health records, and demographics
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            onClick={handleExportCsv}
            leftIcon={<Download className="w-4 h-4" />}
          >
            Export CSV
          </Button>
          <Button
            variant="primary"
            onClick={() => navigate('/patients/new')}
            leftIcon={<UserPlus className="w-4 h-4" />}
          >
            Register Patient
          </Button>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={patients}
        searchPlaceholder="Search by name, MRN, phone, ABHA ID..."
        searchFilter={(patient, q) =>
          Boolean(
            patient.fullName.toLowerCase().includes(q.toLowerCase()) ||
            patient.mrn.toLowerCase().includes(q.toLowerCase()) ||
            patient.phone.includes(q) ||
            (patient.abhaId && patient.abhaId.toLowerCase().includes(q.toLowerCase()))
          )
        }
        onRowClick={(p) => navigate(`/patients/${p.id}`)}
        filterComponent={
          <div className="flex items-center gap-2 flex-wrap">
            <Select
              options={[
                { value: 'All', label: 'All Departments' },
                { value: 'Cardiology', label: 'Cardiology' },
                { value: 'Endocrinology', label: 'Endocrinology' },
                { value: 'General Medicine', label: 'General Medicine' },
                { value: 'Neurology', label: 'Neurology' },
                { value: 'Pediatrics', label: 'Pediatrics' },
              ]}
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="py-1 text-xs min-w-[130px]"
            />
            <Select
              options={[
                { value: 'All', label: 'All Status' },
                { value: 'Active', label: 'Active' },
                { value: 'Inpatient', label: 'Inpatient' },
                { value: 'Discharged', label: 'Discharged' },
              ]}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-1 text-xs min-w-[110px]"
            />
          </div>
        }
        isLoading={isLoading}
      />
    </div>
  );
};
