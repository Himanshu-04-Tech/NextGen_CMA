import React, { useState, useEffect } from 'react';
import api from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import PerformanceCard from '../../components/mentorship/PerformanceCard.jsx';
import LoadingSkeleton from '../../components/mentorship/LoadingSkeleton.jsx';
import EmptyState from '../../components/mentorship/EmptyState.jsx';
import { Award, GraduationCap } from 'lucide-react';

const PerformanceReviews = () => {
  const { user } = useAuth();
  const role = user?.role;

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get('/performance-reviews');
        setReviews(res.data.data);
      } catch (err) {
        console.error(err);
        setError('Could not retrieve performance evaluations list.');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-black text-white font-display tracking-tight flex items-center gap-2">
          <Award className="text-brand-gold" />
          Performance Reviews
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          {role === 'STUDENT'
            ? 'Review your CMA study progress marks, strengths checklist, and customized study strategy recommendations.'
            : 'Access the archives of student evaluations you have previously compiled and published.'}
        </p>
      </div>

      {/* Reviews list */}
      {loading ? (
        <div className="space-y-6">
          <LoadingSkeleton type="detail" count={2} />
        </div>
      ) : error ? (
        <div className="p-8 text-center text-red-400 bg-red-500/10 border border-red-500/20 rounded-2xl">
          {error}
        </div>
      ) : reviews.length === 0 ? (
        <EmptyState
          title="No evaluations found"
          message={
            role === 'STUDENT'
              ? 'Your mentor has not posted any performance reviews for you yet.'
              : 'You have not written any evaluations. Visit the Mentor Dashboard to get started!'
          }
          icon={GraduationCap}
        />
      ) : (
        <div className="space-y-6 animate-fadeIn">
          {reviews.map((review) => (
            <PerformanceCard key={review.id} review={review} role={role} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PerformanceReviews;
