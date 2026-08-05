import React from 'react';
import { Briefcase, GraduationCap, Calendar, Award } from 'lucide-react';
import RatingStars from './RatingStars.jsx';
import { formatAvailabilitySlots } from '../../utils/availability.js';

const MentorProfileCard = ({ mentor }) => {
  const { fullName, profileImage, specialization, experience, qualification, rating, bio, availability, availabilities } = mentor;
  const displayAvailability = availability || formatAvailabilitySlots(availabilities);

  return (
    <div className="bg-brand-dark/40 backdrop-blur-md border border-brand-border rounded-2xl p-6 sm:p-8 space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left">
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-zinc-800 border border-brand-border overflow-hidden flex items-center justify-center text-brand-gold shrink-0 shadow-lg">
          {profileImage ? (
            <img src={profileImage} alt={fullName} className="w-full h-full object-cover" />
          ) : (
            <span className="text-3xl font-bold font-display">{fullName.charAt(0)}</span>
          )}
        </div>
        <div className="space-y-3 flex-1">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-display">{fullName}</h2>
            <p className="text-brand-purple font-semibold text-sm tracking-wide uppercase mt-1">{specialization}</p>
          </div>
          <div className="flex flex-wrap gap-4 justify-center sm:justify-start items-center">
            <RatingStars rating={rating} />
            <div className="hidden sm:block text-zinc-600">|</div>
            <div className="flex items-center gap-1.5 text-xs text-zinc-400">
              <Briefcase size={14} className="text-brand-gold" />
              <span>{experience}+ Years Professional Experience</span>
            </div>
          </div>
        </div>
      </div>

      <hr className="border-brand-border/60" />

      {/* Biography */}
      <div className="space-y-2">
        <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-400">Biography</h4>
        <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-line">{bio}</p>
      </div>

      {/* Qualifications & Availability grid */}
      <div className="grid sm:grid-cols-2 gap-4 pt-2">
        <div className="p-4 rounded-xl bg-white/5 border border-brand-border/60 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-brand-purple/10 text-brand-purple shrink-0 border border-brand-purple/20">
            <GraduationCap size={18} />
          </div>
          <div>
            <h5 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-0.5">Qualifications</h5>
            <p className="text-zinc-200 text-sm font-bold">{qualification}</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white/5 border border-brand-border/60 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-brand-gold/10 text-brand-gold shrink-0 border border-brand-gold/20">
            <Calendar size={18} />
          </div>
          <div>
            <h5 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-0.5">Availability</h5>
            <p className="text-zinc-200 text-sm font-bold">{displayAvailability || 'Not Specified'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorProfileCard;
