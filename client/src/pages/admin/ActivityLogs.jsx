import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout.jsx';
import SearchBar from '../../components/admin/SearchBar.jsx';
import ActivityTable from '../../components/admin/ActivityTable.jsx';
import Pagination from '../../components/admin/Pagination.jsx';
import LoadingSkeleton from '../../components/admin/LoadingSkeleton.jsx';
import EmptyState from '../../components/admin/EmptyState.jsx';
import api from '../../services/api.js';
import toast from 'react-hot-toast';
import { ShieldAlert } from 'lucide-react';

const ActivityLogs = () => {
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 15,
        search: search.trim() || undefined,
      };
      const res = await api.get('/admin/activity-logs', { params });
      setLogs(res.data.data.logs);
      setPagination(res.data.data.pagination);
    } catch (err) {
      toast.error('Failed to load system activity logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page, search]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Title */}
        <div>
          <h1 className="text-xl font-black text-white font-display uppercase tracking-wider">
            Administrative Audit Trail
          </h1>
          <p className="text-xs text-zinc-400">
            Chronological records of database changes, student status updates, and login sessions.
          </p>
        </div>

        {/* Filter / Search */}
        <div className="flex bg-brand-dark/20 border border-brand-border/40 p-4 rounded-2xl">
          <SearchBar value={search} onChange={setSearch} placeholder="Search logs by action, table, or details..." />
        </div>

        {/* List table */}
        {loading ? (
          <LoadingSkeleton type="logs" count={8} />
        ) : logs.length === 0 ? (
          <EmptyState title="No activity logs match search criteria" icon={ShieldAlert} />
        ) : (
          <div className="space-y-4">
            <ActivityTable logs={logs} />
            <Pagination page={pagination.page} pages={pagination.pages} onPageChange={setPage} />
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ActivityLogs;
