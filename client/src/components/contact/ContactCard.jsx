import React from 'react';

const ContactCard = ({ icon: Icon, title, value, href, bgClass = 'bg-brand-purple/5 border-brand-purple/20 text-brand-purple' }) => {
  const Container = href ? 'a' : 'div';
  const extraProps = href ? { href, target: href.startsWith('http') ? '_blank' : '_self', rel: 'noopener noreferrer' } : {};

  return (
    <Container
      {...extraProps}
      className={`p-4 rounded-xl border flex items-start gap-4 transition-all duration-300 ${
        href ? 'hover:scale-[1.02] cursor-pointer' : ''
      } ${bgClass}`}
    >
      <div className="w-10 h-10 rounded-xl bg-black/40 border border-white/5 flex items-center justify-center shrink-0">
        <Icon size={18} />
      </div>
      <div className="space-y-0.5 text-left">
        <span className="text-[10px] text-zinc-500 uppercase tracking-widest block font-bold">
          {title}
        </span>
        <span className="text-sm font-semibold text-white break-all">
          {value}
        </span>
      </div>
    </Container>
  );
};

export default ContactCard;
