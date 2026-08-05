/**
 * NextGen CMA — Landing Blog / Knowledge Center Preview Section
 *
 * Displays featured articles content for SEO keywords and academic help.
 */

import Card from '../ui/Card.jsx';

const BlogPreview = ({ data }) => {
  const defaultBlogs = [
    {
      title: 'How to Clear CMA Inter on Your First Attempt',
      desc: 'Expert strategy tips covering subject priorities, group selections, and notes creation schedules.',
    },
    {
      title: 'Cracking FMDA: Ultimate Revision Checklist',
      desc: 'Simplify Financial Management & Decision Analysis with our step-by-step syllabus formulas mapping.',
    },
    {
      title: 'Accountability vs. Self-Study: The CMA Success Factor',
      desc: 'Analyze statistics showing how daily check-in habits double pass rates compared to unmonitored prep.',
    },
  ];

  const blogList = data?.body ? JSON.parse(data.body) : defaultBlogs;
  const sectionTitle = data?.title || 'Knowledge Center';
  const sectionSub = data?.subtitle || 'Acquire advice, subject reviews, and study guides curated by seasoned cost accountants.';

  return (
    <section id="blog" className="py-12 md:py-16 relative bg-black/40 border-y border-brand-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-10">
        {/* Header */}
        <div className="max-w-3xl mx-auto space-y-4">
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-white">
            {sectionTitle}
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            {sectionSub}
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {blogList.slice(0, 3).map((post, idx) => (
            <Card
              key={idx}
              padding="default"
              className="flex flex-col h-full border border-brand-border/40 overflow-hidden rounded-2xl"
            >
              <div className="space-y-3">
                <h3 className="text-base font-bold font-display text-white">
                  {post.title}
                </h3>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  {post.desc}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;
