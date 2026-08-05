import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Briefcase, Award } from 'lucide-react';
import RatingStars from './RatingStars.jsx';
import { formatAvailabilitySlots } from '../../utils/availability.js';

const MentorCard = ({ mentor }) => {
  const { id, fullName, profileImage, specialization, experience, qualification, rating, availability, availabilities } = mentor;
  const displayAvailability = availability || formatAvailabilitySlots(availabilities);

  return (
    <div className="bg-brand-dark/40 backdrop-blur-md border border-brand-border rounded-2xl p-6 hover:border-brand-purple/40 hover:shadow-purple-glow/10 transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Mentor profile row */}
        <div className="flex gap-4 items-start mb-4">
          <div className="w-16 h-16 rounded-xl bg-zinc-800 border border-brand-border overflow-hidden flex items-center justify-center text-brand-gold shrink-0">
            {profileImage ? (
              <img src={profileImage} alt={fullName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-xl font-bold font-display">{fullName.charAt(0)}</span>
            )}
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white tracking-tight leading-snug">{fullName}</h3>
            <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-purple/20 text-brand-purple border border-brand-purple/20 uppercase tracking-wide">
              {specialization}
            </span>
          </div>
        </div>

        {/* Info stats */}
        <div className="grid grid-cols-2 gap-3 mb-4 text-xs text-zinc-400">
          <div className="flex items-center gap-1.5">
            <Briefcase size={14} className="text-brand-gold" />
            <span>{experience}+ Years Exp.</span>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <Award size={14} className="text-brand-gold" />
            <span className="truncate" title={qualification}>{qualification}</span>
          </div>
        </div>

        {/* Rating stars */}
        <div className="mb-4">
          <RatingStars rating={rating} />
        </div>

        {/* General availability schedule */}
        {displayAvailability && (
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-brand-border/40 text-xs text-zinc-300 mb-6">
            <Calendar size={14} className="text-brand-purple flex-shrink-0" />
            <span className="truncate" title={displayAvailability}>{displayAvailability}</span>
          </div>
        )}
      </div>

      {/* Booking CTA row */}
      <div className="flex gap-3 pt-2">
        <Link
          to={`/mentorship/mentor/${id}`}
          className="flex-1 text-center py-2 px-4 rounded-xl text-xs font-semibold border border-brand-border text-zinc-300 hover:text-white hover:bg-white/5 transition-all"
        >
          View Profile
        </Link>
        <Link
          to={`/mentorship/book/${id}`}
          className="flex-1 text-center py-2 px-4 rounded-xl text-xs font-semibold bg-gradient-to-r from-brand-gold-dark to-brand-gold text-black shadow-gold-glow hover:scale-[1.02] transition-transform font-bold"
        >
          Book Slot
        </Link>
      </div>
    </div>
  );
};

export default MentorCard;
