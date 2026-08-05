import { Check } from 'lucide-react';

const LEVEL_SUBJECTS = {
  FOUNDATION: [
    'Paper 1: Fundamentals of Business Laws and Business Communication',
    'Paper 2: Fundamentals of Financial and Cost Accounting',
    'Paper 3: Fundamentals of Business Mathematics and Statistics',
    'Paper 4: Fundamentals of Business Economics and Management'
  ],
  INTER: [
    'Paper 5: Business Laws and Ethics',
    'Paper 6: Financial Accounting',
    'Paper 7: Direct and Indirect Taxation',
    'Paper 8: Cost Accounting',
    'Paper 9: Operations Management and Strategic Management',
    'Paper 10: Corporate Accounting and Auditing',
    'Paper 11: Financial Management and Business Data Analytics',
    'Paper 12: Management Accounting'
  ],
  FINAL: [
    'Paper 13: Corporate Laws and Compliance',
    'Paper 14: Strategic Financial Management',
    'Paper 15: Direct Tax Laws and International Taxation',
    'Paper 16: Strategic Cost Management - Decision Making',
    'Paper 17: Cost and Management Audit',
    'Paper 18: Corporate Financial Reporting',
    'Paper 19: Indirect Tax Laws and Practice',
    'Paper 20: Strategic Performance Management and Valuation'
  ]
};

const SubjectSelector = ({ level, selectedSubjects, onChange }) => {
  const subjects = LEVEL_SUBJECTS[level] || [];

  const handleToggle = (subjectName) => {
    if (selectedSubjects.includes(subjectName)) {
      onChange(selectedSubjects.filter((s) => s !== subjectName));
    } else {
      onChange([...selectedSubjects, subjectName]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">
          Available Subjects ({subjects.length})
        </span>
        <button
          type="button"
          onClick={() => onChange(subjects)}
          className="text-xs text-brand-gold hover:underline font-medium"
        >
          Select All
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {subjects.map((subjectName) => {
          const isSelected = selectedSubjects.includes(subjectName);
          return (
            <button
              key={subjectName}
              type="button"
              onClick={() => handleToggle(subjectName)}
              className={`p-4 rounded-xl text-left border text-sm transition-all duration-200 flex items-start gap-3 group relative overflow-hidden ${
                isSelected
                  ? 'border-brand-gold bg-brand-gold/5 text-white shadow-gold-glow'
                  : 'border-brand-border bg-black/20 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
              }`}
            >
              <div
                className={`w-5 h-5 rounded border mt-0.5 flex items-center justify-center transition-all ${
                  isSelected
                    ? 'border-brand-gold bg-brand-gold text-black'
                    : 'border-zinc-700 bg-transparent group-hover:border-zinc-500'
                }`}
              >
                {isSelected && <Check size={12} strokeWidth={3} />}
              </div>

              <span className="font-medium pr-4 leading-relaxed">{subjectName}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SubjectSelector;
export { LEVEL_SUBJECTS };
