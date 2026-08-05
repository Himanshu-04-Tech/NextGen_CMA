import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import ContactCard from './ContactCard.jsx';

const ContactInfo = ({ info }) => {
  if (!info) return null;

  return (
    <div className="space-y-4">
      <ContactCard
        icon={Mail}
        title="Email Advisors"
        value={info.email || 'nextgencma18@gmail.com'}
        href={`mailto:${info.email || 'nextgencma18@gmail.com'}`}
        bgClass="bg-brand-gold/5 hover:bg-brand-gold/10 border-brand-gold/10 hover:border-brand-gold/20 text-brand-gold"
      />
    </div>
  );
};

export default ContactInfo;
