import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api.js';
import MentorProfileCard from '../../components/mentorship/MentorProfileCard.jsx';
import LoadingSkeleton from '../../components/mentorship/LoadingSkeleton.jsx';
import RatingStars from '../../components/mentorship/RatingStars.jsx';
import { Calendar, User, ArrowLeft, MessageSquare } from 'lucide-react';

const MentorProfile = () => {
  const { id } = useParams();
  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMentorProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/mentors/${id}`);
        setMentor(res.data.data);
      } catch (err) {
        console.error(err);
        setError('Failed to retrieve mentor details. The profile may not exist.');
      } finally {
        setLoading(false);
      }
    };

    fetchMentorProfile();
  }, [id]);

  if (loading) {
    return <LoadingSkeleton type="detail" count={1} />;
  }

  if (error || !mentor) {
    return (
      <div className="space-y-4">
        <Link to="/mentorship/mentors" className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft size={14} />
          <span>Back to Browse Mentors</span>
        </Link>
        <div className="p-8 text-center text-red-400 bg-red-500/10 border border-red-500/20 rounded-2xl">
          {error || 'Mentor not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back navigation */}
      <div className="flex justify-between items-center">
        <Link
          to="/mentorship/mentors"
          className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Browse Mentors</span>
        </Link>

        <Link
          to={`/mentorship/book/${mentor.id}`}
          className="py-2.5 px-6 rounded-xl text-xs font-semibold bg-gradient-to-r from-brand-gold-dark via-brand-gold to-brand-gold-dark text-black font-black font-display shadow-gold-glow hover:scale-[1.02] active:scale-100 transition-all"
        >
          Schedule Session
        </Link>
      </div>

      {/* Main Profile Info Card */}
      <MentorProfileCard mentor={mentor} />

      {/* Student Feedback Reviews section */}
      <div className="bg-brand-dark/40 border border-brand-border rounded-2xl p-6 sm:p-8 space-y-6">
        <div>
          <h3 className="text-lg font-bold text-white font-display tracking-wide">
            Student Reviews & Feedback
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Verified performance review feedback from evaluated CMA students.
          </p>
        </div>

        {mentor.reviews && mentor.reviews.length === 0 ? (
          <div className="p-6 text-center text-xs text-zinc-500 bg-white/5 border border-brand-border/40 rounded-xl border-dashed">
            No evaluations published for this mentor yet.
          </div>
        ) : (
          <div className="space-y-4">
            {mentor.reviews?.map((review) => {
              const reviewDate = new Date(review.reviewDate).toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              });
              return (
                <div
                  key={review.id}
                  className="bg-white/5 border border-brand-border/60 p-4 rounded-xl space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-zinc-800 border border-brand-border flex items-center justify-center text-[10px] font-bold text-brand-purple">
                        <User size={14} />
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-white">Student Review</h5>
                        <span className="text-[10px] text-zinc-500">{reviewDate}</span>
                      </div>
                    </div>
                    {/* Score badge */}
                    <div className="text-xs font-bold bg-brand-gold/10 border border-brand-gold/20 text-brand-gold px-2.5 py-0.5 rounded-lg">
                      Score: {review.overallScore}/100
                    </div>
                  </div>
                  <div className="space-y-2 text-xs">
                    <p className="text-zinc-300">
                      <strong className="text-brand-gold">Strengths:</strong> {review.strengths}
                    </p>
                    <p className="text-zinc-300 font-medium">
                      <strong className="text-brand-purple">Recommended Action:</strong> {review.actionItems}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorProfile;
