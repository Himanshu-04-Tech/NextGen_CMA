import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout.jsx';
import SearchBar from '../../components/admin/SearchBar.jsx';
import FilterBar from '../../components/admin/FilterBar.jsx';
import StudentTable from '../../components/admin/StudentTable.jsx';
import Pagination from '../../components/admin/Pagination.jsx';
import LoadingSkeleton from '../../components/admin/LoadingSkeleton.jsx';
import EmptyState from '../../components/admin/EmptyState.jsx';
import ConfirmationModal from '../../components/admin/ConfirmationModal.jsx';
import api from '../../services/api.js';
import toast from 'react-hot-toast';
import { Users } from 'lucide-react';

const Students = () => {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [cmaLevel, setCmaLevel] = useState('');
  const [page, setPage] = useState(1);

  // Status toggle modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [selectedAction, setSelectedAction] = useState('');

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 10,
        search: search.trim() || undefined,
        status: status || undefined,
        cmaLevel: cmaLevel || undefined,
      };
      const res = await api.get('/admin/students', { params });
      setStudents(res.data.data.students);
      setPagination(res.data.data.pagination);
    } catch (err) {
      toast.error('Failed to load students list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [page, search, status, cmaLevel]);

  const handleToggleStatusClick = (studentId, action) => {
    setSelectedStudentId(studentId);
    setSelectedAction(action);
    setModalOpen(true);
  };

  const handleConfirmToggle = async () => {
    setModalOpen(false);
    try {
      await api.patch(`/admin/students/${selectedStudentId}/status`, {
        action: selectedAction,
      });
      toast.success(`Student successfully ${selectedAction === 'ACTIVATE' ? 'activated' : 'deactivated'}`);
      fetchStudents();
    } catch (err) {
      toast.error('Failed to update student state');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Title */}
        <div>
          <h1 className="text-xl font-black text-white font-display uppercase tracking-wider">
            Student User Directory
          </h1>
          <p className="text-xs text-zinc-400">
            Monitor strategy configurations, profiles, and active statuses.
          </p>
        </div>

        {/* Filters and search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-brand-dark/20 border border-brand-border/40 p-4 rounded-2xl">
          <SearchBar value={search} onChange={setSearch} placeholder="Search student by name or email..." />
          <div className="flex flex-wrap items-center gap-4">
            <FilterBar
              label="CMA Level"
              selectedValue={cmaLevel}
              onChange={setCmaLevel}
              options={[
                { label: 'All Levels', value: '' },
                { label: 'Foundation', value: 'FOUNDATION' },
                { label: 'Inter', value: 'INTER' },
                { label: 'Final', value: 'FINAL' },
              ]}
            />
            <FilterBar
              label="Account State"
              selectedValue={status}
              onChange={setStatus}
              options={[
                { label: 'All', value: '' },
                { label: 'Active Only', value: 'ACTIVE' },
                { label: 'Deactivated', value: 'DEACTIVATED' },
              ]}
            />
          </div>
        </div>

        {/* Table list */}
        {loading ? (
          <LoadingSkeleton type="table" count={6} />
        ) : students.length === 0 ? (
          <EmptyState title="No students found" icon={Users} />
        ) : (
          <div className="space-y-4">
            <StudentTable students={students} onToggleStatus={handleToggleStatusClick} />
            <Pagination page={pagination.page} pages={pagination.pages} onPageChange={setPage} />
          </div>
        )}

        {/* Modal warning */}
        <ConfirmationModal
          isOpen={modalOpen}
          title={selectedAction === 'DEACTIVATE' ? 'Deactivate Student Account?' : 'Activate Student Account?'}
          message={
            selectedAction === 'DEACTIVATE'
              ? 'Are you sure you want to temporarily suspend this student? They will not be able to log in or configure targets.'
              : 'Are you sure you want to restore access to this student account?'
          }
          confirmText={selectedAction === 'DEACTIVATE' ? 'Deactivate' : 'Activate'}
          onConfirm={handleConfirmToggle}
          onCancel={() => setModalOpen(false)}
        />
      </div>
    </AdminLayout>
  );
};

export default Students;
