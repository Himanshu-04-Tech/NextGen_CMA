import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout.jsx';
import CreateMentorForm from '../../components/admin/CreateMentorForm.jsx';
import api from '../../services/api.js';
import toast from 'react-hot-toast';
import { ArrowLeft, UserPlus, Sliders } from 'lucide-react';

const EditMentor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [mentorData, setMentorData] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Student assignments state
  const [students, setStudents] = useState([]);
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load mentor profile details
        const mentorRes = await api.get(`/mentors/${id}`);
        setMentorData(mentorRes.data.data);

        // Load students list to enable assignments
        const studentsRes = await api.get('/admin/students', { params: { limit: 100 } });
        setStudents(studentsRes.data.data.students || []);
      } catch (err) {
        toast.error('Failed to load mentor parameters');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    try {
      await api.put(`/admin/mentor-management/${id}`, payload);
      toast.success('Mentor profile updated successfully');
      navigate('/admin/mentors');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAssignStudents = async (e) => {
    e.preventDefault();
    if (selectedStudentIds.length === 0) {
      return toast.error('Please check at least one student to assign');
    }

    setAssigning(true);
    try {
      await api.post(`/admin/mentor-management/${id}/assign`, {
        studentIds: selectedStudentIds,
      });
      toast.success('Students assigned successfully');
    } catch (err) {
      toast.error('Failed to assign students');
    } finally {
      setAssigning(false);
    }
  };

  const handleCheckboxChange = (studentId) => {
    if (selectedStudentIds.includes(studentId)) {
      setSelectedStudentIds(selectedStudentIds.filter((sid) => sid !== studentId));
    } else {
      setSelectedStudentIds([...selectedStudentIds, studentId]);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="h-40 flex items-center justify-center text-zinc-400 text-xs">
          Loading mentor profile metadata...
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-4xl mx-auto text-xs">
        {/* Back Link */}
        <Link to="/admin/mentors" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft size={14} />
          <span>Back to mentor directory</span>
        </Link>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Profile Edit Column */}
          <div className="md:col-span-2 bg-brand-dark/40 border border-brand-border rounded-2xl p-6 space-y-6">
            <div>
              <h2 className="text-base font-black text-white font-display uppercase tracking-wider flex items-center gap-2">
                <Sliders size={18} className="text-brand-purple" />
                Edit Profile: {mentorData?.fullName}
              </h2>
              <p className="text-[10px] text-zinc-400">
                Update account emails, phone parameters, and qualifications.
              </p>
            </div>

            <CreateMentorForm onSubmit={handleSubmit} initialData={mentorData} isSubmitting={submitting} />
          </div>

          {/* Student Assignments Column */}
          <div className="bg-brand-dark/40 border border-brand-border rounded-2xl p-6 space-y-4 h-fit">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                <UserPlus size={15} className="text-brand-gold" />
                Assign Students
              </h3>
              <p className="text-[9px] text-zinc-500">
                Link students to this mentor profile.
              </p>
            </div>

            <form onSubmit={handleAssignStudents} className="space-y-4">
              <div className="max-h-60 overflow-y-auto space-y-2 border border-brand-border/40 rounded-xl p-2.5 bg-black/20 divide-y divide-brand-border/20">
                {students.length === 0 ? (
                  <p className="text-zinc-600 text-[10px]">No students found to assign</p>
                ) : (
                  students.map((student) => (
                    <label key={student.id} className="flex items-center gap-2.5 py-1.5 cursor-pointer hover:text-white transition-colors">
                      <input
                        type="checkbox"
                        checked={selectedStudentIds.includes(student.id)}
                        onChange={() => handleCheckboxChange(student.id)}
                        className="rounded bg-black border-brand-border text-brand-purple focus:ring-0 cursor-pointer"
                      />
                      <div>
                        <p className="font-bold text-zinc-300">{student.name}</p>
                        <span className="text-[8px] text-zinc-500 uppercase">{student.cmaLevel}</span>
                      </div>
                    </label>
                  ))
                )}
              </div>

              <button
                type="submit"
                disabled={assigning}
                className="w-full py-2.5 bg-gradient-to-r from-brand-gold-dark to-brand-gold text-black font-black uppercase font-display rounded-xl tracking-wider text-center shadow-gold-glow transition-all"
              >
                {assigning ? 'Assigning...' : 'Assign Selected'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default EditMentor;
