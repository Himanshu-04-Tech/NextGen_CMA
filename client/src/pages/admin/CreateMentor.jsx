import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout.jsx';
import CreateMentorForm from '../../components/admin/CreateMentorForm.jsx';
import api from '../../services/api.js';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';

const CreateMentor = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    try {
      await api.post('/admin/mentor-management', payload);
      toast.success('Mentor profile registered successfully');
      navigate('/admin/mentors');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to onboard mentor');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-2xl mx-auto text-xs">
        {/* Back Link */}
        <Link to="/admin/mentors" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft size={14} />
          <span>Back to mentor directory</span>
        </Link>

        {/* Form Container */}
        <div className="bg-brand-dark/40 border border-brand-border rounded-2xl p-6 space-y-6">
          <div>
            <h2 className="text-base font-black text-white font-display uppercase tracking-wider">
              Onboard CMA Faculty / Mentor
            </h2>
            <p className="text-[10px] text-zinc-400">
              Create a new user account of role MENTOR and define specialization details.
            </p>
          </div>

          <CreateMentorForm onSubmit={handleSubmit} isSubmitting={submitting} />
        </div>
      </div>
    </AdminLayout>
  );
};

export default CreateMentor;
