/**
 * NextGen CMA — Services List Grid
 */

import ServiceCard from './ServiceCard.jsx';

const ServiceGrid = ({ services }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
      {services.map((service) => (
        <div key={service.id} className="h-full">
          <ServiceCard service={service} />
        </div>
      ))}
    </div>
  );
};

export default ServiceGrid;
