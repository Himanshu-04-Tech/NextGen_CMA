/**
 * NextGen CMA — Study Plan Service
 *
 * Implements plan creation, automated target and revision generation,
 * subject updates, and target status updates.
 */

import { prisma } from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';

// Helper to filter data keys to only those recognized by the currently generated Prisma Client
function getSupportedFields(modelName) {
  try {
    let fields = null;
    if (prisma._dmmf) {
      if (prisma._dmmf.modelMap && prisma._dmmf.modelMap[modelName]) {
        fields = prisma._dmmf.modelMap[modelName].fields;
      } else if (prisma._dmmf.datamodel && Array.isArray(prisma._dmmf.datamodel.models)) {
        const model = prisma._dmmf.datamodel.models.find(m => m.name === modelName);
        if (model) fields = model.fields;
      }
    }
    if (!fields && prisma._runtimeDataModel && prisma._runtimeDataModel.models && prisma._runtimeDataModel.models[modelName]) {
      fields = prisma._runtimeDataModel.models[modelName].fields;
    }

    if (Array.isArray(fields)) {
      return new Set(fields.map(f => f.name));
    }
    if (fields && typeof fields === 'object') {
      return new Set(Object.keys(fields));
    }
  } catch (e) {
    // fallback
  }

  // Known base schemas fallback if DMMF reflection is hidden by Prisma runtime
  if (modelName === 'DailyTarget') {
    return new Set(['id', 'planId', 'date', 'topic', 'studyHours', 'status', 'createdAt', 'updatedAt']);
  }
  if (modelName === 'StudyPlan') {
    return new Set(['id', 'userId', 'cmaLevel', 'examDate', 'dailyStudyHours', 'status', 'createdAt', 'updatedAt']);
  }
  return null;
}

function filterSupportedFields(modelName, data) {
  const supported = getSupportedFields(modelName);
  if (!supported) return data;
  const filtered = {};
  for (const [key, value] of Object.entries(data)) {
    if (supported.has(key)) {
      filtered[key] = value;
    }
  }
  return filtered;
}

// Predefined CMA Subjects and Topics Mapping
const CMA_CURRICULUM = {
  FOUNDATION: {
    'Paper 1: Fundamentals of Business Laws and Business Communication': [
      'Commercial Laws (Contract Act, Sale of Goods Act, Negotiable Instruments Act)',
      'Industrial Laws (Factories Act, Payment of Wages Act, Minimum Wages Act)',
      'Corporate Laws (Companies Act Introduction)',
      'Business Communication Basics',
      'Written Communication (Letters, Memos, Reports)',
      'Oral and Non-verbal Communication'
    ],
    'Paper 2: Fundamentals of Financial and Cost Accounting': [
      'Accounting Principles and Concepts',
      'Preparation of Financial Statements (Sole Proprietorship)',
      'Cost Accounting Concepts and Classifications',
      'Material Costing Methods',
      'Labor Costing and Incentives',
      'Overhead Allocation and Absorption'
    ],
    'Paper 3: Fundamentals of Business Mathematics and Statistics': [
      'Arithmetic (Ratio, Proportion, Simple & Compound Interest)',
      'Algebra (Quadratic Equations, Permutations & Combinations)',
      'Calculus (Differential & Integral basics)',
      'Statistical Representation of Data',
      'Measures of Central Tendency and Dispersion',
      'Probability and Probability Distributions'
    ],
    'Paper 4: Fundamentals of Business Economics and Management': [
      'Basic Economic Concepts (Demand, Supply, Production)',
      'Market Forms and Pricing',
      'Money, Banking, and Inflation',
      'Management Principles and Functions',
      'Decision Making and Planning',
      'Leadership, Motivation, and Control'
    ]
  },
  INTER: {
    'Paper 5: Business Laws and Ethics': [
      'Commercial Laws (Contracts, Sales, Partnership)',
      'Industrial Laws (PF, ESI, Gratuity, Bonus)',
      'Corporate Laws (Companies Act - Incorporation to Board)',
      'Business Ethics and Governance'
    ],
    'Paper 6: Financial Accounting': [
      'Accounting Standards (AS) and Framework',
      'Partnership Accounts (Admission, Retirement, Dissolution)',
      'Branch and Departmental Accounts',
      'Final Accounts of Companies'
    ],
    'Paper 7: Direct and Indirect Taxation': [
      'Direct Tax - Basic Concepts and Exempt Incomes',
      'Direct Tax - Income from Salary & House Property',
      'Direct Tax - Business/Profession & Capital Gains',
      'Indirect Tax - GST Basics and Registration',
      'Indirect Tax - Input Tax Credit & Customs Duty'
    ],
    'Paper 8: Cost Accounting': [
      'Cost Ascertainment (Material, Labor, Overheads)',
      'Cost Book-keeping and Reconciliation',
      'Marginal Costing and CVP Analysis',
      'Standard Costing and Variance Analysis',
      'Budgetary Control and Performance Measurement'
    ],
    'Paper 9: Operations Management and Strategic Management': [
      'Operations Management Basics and Facility Layout',
      'Production Planning, Control, and Maintenance',
      'Strategic Management Introduction and Environment',
      'Strategic Analysis, Formulation, and Choice'
    ],
    'Paper 10: Corporate Accounting and Auditing': [
      'Accounting for Shares, Debentures, and Buyback',
      'Preparation of Corporate Financial Statements',
      'Auditing Concepts and Standards',
      'Vouching, Verification, and Audit Reports'
    ],
    'Paper 11: Financial Management and Business Data Analytics': [
      'Financial Ratio Analysis and Cash Flows',
      'Working Capital Management',
      'Cost of Capital and Capital Budgeting',
      'Business Data Analytics Basics'
    ],
    'Paper 12: Management Accounting': [
      'Activity Based Costing and Life Cycle Costing',
      'Transfer Pricing and Cost Control',
      'Decision Making Tools (Marginal Costing applications)',
      'Performance Evaluation and Balance Scorecard'
    ]
  },
  FINAL: {
    'Paper 13: Corporate Laws and Compliance': [
      'Companies Act (Advanced Provisions & Mergers)',
      'SEBI Regulations and Securities Laws',
      'Corporate Governance and Board Practices',
      'Compliance and Insolvency (IBC)'
    ],
    'Paper 14: Strategic Financial Management': [
      'Investment Decisions and Project Financing',
      'Security Analysis & Portfolio Management',
      'Financial Derivatives and Risk Management',
      'International Financial Management'
    ],
    'Paper 15: Direct Tax Laws and International Taxation': [
      'Assessment of Corporate and Non-corporate Entities',
      'Tax Planning and Assessment Procedures',
      'Non-Resident Taxation and Transfer Pricing',
      'Double Taxation Relief (DTAA)'
    ],
    'Paper 16: Strategic Cost Management - Decision Making': [
      'Strategic Cost Management Concepts & Quality Costing',
      'Quantitative Techniques (Linear Programming, Network)',
      'Strategic Decision Making (Pricing, Profitability)',
      'Cost Control, Reduction, and Value Analysis'
    ],
    'Paper 17: Cost and Management Audit': [
      'Cost Audit Rules and Annexures',
      'Audit Program and Working Papers',
      'Management Audit and Operational Evaluation',
      'Internal Control, Internal Audit, and Corporate Social Responsibility'
    ],
    'Paper 18: Corporate Financial Reporting': [
      'Indian Accounting Standards (Ind AS)',
      'Group Financial Statements (Consolidation)',
      'Valuation of Shares, Goodwill, and Businesses',
      'Recent Trends in Corporate Reporting'
    ],
    'Paper 19: Indirect Tax Laws and Practice': [
      'Advanced GST Provisions and Rules',
      'GST Procedures, Audits, and Appeals',
      'Customs Act, Rules, and Valuation',
      'Foreign Trade Policy'
    ],
    'Paper 20: Strategic Performance Management and Valuation': [
      'Performance Management Tools and CRM',
      'Economic Efficiency Measures and Productivity',
      'Valuation Principles, Models, and Mergers',
      'Valuation of Assets and Liabilities'
    ]
  }
};

export class StudyPlanService {
  /**
   * Helper to parse curriculum for given CMA level
   */
  static getCurriculumByLevel(level) {
    const canonicalLevel = level.toUpperCase();
    return CMA_CURRICULUM[canonicalLevel] || {};
  }

  /**
   * Create a new Study Plan structure (Without auto-generating all topics/dates)
   */
  static async createPlan(userId, planData) {
    const {
      cmaLevel,
      subjects,
      examAttempt,
      examDate,
      dailyStudyHours,
      startDate,
      availableDays,
      preferredStartTime,
      preferredEndTime
    } = planData;

    const parsedExamDate = new Date(examDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalDays = Math.ceil((parsedExamDate - today) / (1000 * 60 * 60 * 24));
    if (totalDays <= 0) {
      throw ApiError.badRequest('Exam date must be in the future.');
    }

    const curriculum = this.getCurriculumByLevel(cmaLevel);

    // Build initial subject records
    const subjectsToCreate = subjects.map((subjName, idx) => ({
      subjectName: subjName,
      totalTopics: (curriculum[subjName] || []).length,
      completedTopics: 0,
      displayOrder: idx
    }));

    if (subjectsToCreate.length === 0) {
      throw ApiError.badRequest('Selected subjects are not valid or empty.');
    }

    // Pause previous active plans
    await prisma.studyPlan.updateMany({
      where: { userId, status: 'ACTIVE' },
      data: { status: 'PAUSED' }
    });

    const parsedStartDate = startDate ? new Date(startDate) : today;
    const formattedAvailableDays = Array.isArray(availableDays) ? JSON.stringify(availableDays) : (availableDays || null);

    const rawPlanData = {
      userId,
      cmaLevel,
      examDate: parsedExamDate,
      dailyStudyHours: parseFloat(dailyStudyHours || 4),
      startDate: parsedStartDate,
      availableDays: formattedAvailableDays,
      preferredStartTime: preferredStartTime || null,
      preferredEndTime: preferredEndTime || null,
      status: 'ACTIVE'
    };

    const planDataToCreate = filterSupportedFields('StudyPlan', rawPlanData);

    // Create Study Plan record without auto-generating hundreds of daily targets
    const createdPlan = await prisma.studyPlan.create({
      data: {
        ...planDataToCreate,
        subjects: {
          create: subjectsToCreate
        }
      },
      include: {
        subjects: true
      }
    });

    // Update Student Target Attempt directly in User profile
    await prisma.user.update({
      where: { id: userId },
      data: { cmaLevel, targetAttempt: examAttempt }
    });

    return createdPlan;
  }

  /**
   * Generate topics for a single specific subject
   */
  static async generateSubjectTopics(planId, subjectId, userId, options = {}, role = 'STUDENT') {
    const plan = await prisma.studyPlan.findUnique({
      where: { id: planId },
      include: { subjects: true }
    });

    if (!plan) throw ApiError.notFound('Study plan not found.');
    if (role === 'STUDENT' && plan.userId !== userId) throw ApiError.forbidden('Forbidden.');

    const subject = await prisma.studyPlanSubject.findUnique({
      where: { id: subjectId }
    });
    if (!subject || subject.planId !== planId) throw ApiError.notFound('Subject not found in this plan.');

    const curriculum = this.getCurriculumByLevel(plan.cmaLevel);
    const defaultTopics = curriculum[subject.subjectName] || [
      'General Introduction to Subject',
      'Core Concepts Overview',
      'Advanced Practice & Revision'
    ];

    const mode = options.mode || 'APPEND'; // 'APPEND' or 'REPLACE'

    if (mode === 'REPLACE') {
      await prisma.dailyTarget.deleteMany({
        where: {
          planId,
          OR: [
            { topic: { startsWith: `${subject.subjectName}:` } },
            { topic: { contains: subject.subjectName } }
          ]
        }
      });
    }

    const existingTargets = await prisma.dailyTarget.findMany({
      where: { planId },
      select: { topic: true }
    });
    const existingTopicNames = new Set(existingTargets.map(t => t.topic));

    const newTargetsData = [];
    defaultTopics.forEach((topName) => {
      const fullTopicName = `${subject.subjectName}: ${topName}`;
      if (mode === 'REPLACE' || !existingTopicNames.has(fullTopicName)) {
        newTargetsData.push(
          filterSupportedFields('DailyTarget', {
            planId,
            subjectName: subject.subjectName,
            topic: fullTopicName,
            description: `Core module for ${subject.subjectName}`,
            priority: 'MEDIUM',
            date: new Date('1970-01-01T00:00:00.000Z'),
            startTime: null,
            endTime: null,
            isManual: false,
            studyHours: Math.min(2.0, plan.dailyStudyHours || 2.0),
            status: 'PENDING'
          })
        );
      }
    });

    // If mode is APPEND and all standard syllabus topics already exist, generate an additional practice topic
    if (mode === 'APPEND' && newTargetsData.length === 0) {
      const subjTopicCount = existingTargets.filter(t => t.topic.startsWith(`${subject.subjectName}:`)).length;
      const extraTopicName = `${subject.subjectName}: Practice & Revision Module ${subjTopicCount + 1}`;
      newTargetsData.push(
        filterSupportedFields('DailyTarget', {
          planId,
          subjectName: subject.subjectName,
          topic: extraTopicName,
          description: `Supplementary practice module for ${subject.subjectName}`,
          priority: 'MEDIUM',
          date: new Date('1970-01-01T00:00:00.000Z'),
          startTime: null,
          endTime: null,
          isManual: false,
          studyHours: Math.min(2.0, plan.dailyStudyHours || 2.0),
          status: 'PENDING'
        })
      );
    }

    if (newTargetsData.length > 0) {
      try {
        await prisma.dailyTarget.createMany({
          data: newTargetsData
        });
      } catch (err) {
        // Fallback for drivers/runtimes that reject createMany with unknown fields
        for (const item of newTargetsData) {
          await prisma.dailyTarget.create({
            data: item
          });
        }
      }
    }

    const totalCount = await prisma.dailyTarget.count({
      where: {
        planId,
        OR: [
          { topic: { startsWith: `${subject.subjectName}:` } },
          { topic: { contains: subject.subjectName } }
        ]
      }
    });

    const updatedSubject = await prisma.studyPlanSubject.update({
      where: { id: subjectId },
      data: { totalTopics: totalCount }
    });

    return { subject: updatedSubject, generatedCount: newTargetsData.length };
  }

  /**
   * Generate topics for all subjects in the plan
   */
  static async generateAllSubjectsTopics(planId, userId, options = {}, role = 'STUDENT') {
    const plan = await prisma.studyPlan.findUnique({
      where: { id: planId },
      include: { subjects: true }
    });

    if (!plan) throw ApiError.notFound('Study plan not found.');
    if (role === 'STUDENT' && plan.userId !== userId) throw ApiError.forbidden('Forbidden.');

    let totalGenerated = 0;
    for (const subj of plan.subjects) {
      const res = await this.generateSubjectTopics(planId, subj.id, userId, options, role);
      totalGenerated += res.generatedCount;
    }

    return { success: true, totalGenerated };
  }

  /**
   * Retrieve active study plans with complete subjects and computed overview stats
   */
  static async getActivePlan(userId) {
    const plan = await prisma.studyPlan.findFirst({
      where: { userId, status: 'ACTIVE' },
      include: {
        subjects: {
          orderBy: { displayOrder: 'asc' }
        },
        dailyTargets: {
          orderBy: { date: 'asc' }
        }
      }
    });

    if (!plan) return null;

    // Compute progress stats
    const totalDailyTargets = plan.dailyTargets.length;
    const completedDailyTargets = plan.dailyTargets.filter((t) => t.status === 'COMPLETED').length;

    const totalTopics = totalDailyTargets > 0
      ? totalDailyTargets
      : plan.subjects.reduce((sum, s) => sum + (s.totalTopics || 0), 0);
    const completedTopics = totalDailyTargets > 0
      ? completedDailyTargets
      : plan.subjects.reduce((sum, s) => sum + (s.completedTopics || 0), 0);

    const overallProgress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

    const completedSubjects = plan.subjects.filter(s => (s.totalTopics || 0) > 0 && (s.completedTopics || 0) >= (s.totalTopics || 0)).length;
    const totalSubjects = plan.subjects.length;
    const pendingSubjects = Math.max(0, totalSubjects - completedSubjects);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const remainingDays = Math.max(0, Math.ceil((new Date(plan.examDate) - today) / (1000 * 60 * 60 * 24)));

    const stats = {
      overallProgress,
      progressPercentage: overallProgress,
      totalDailyTargets,
      completedDailyTargets,
      totalTopics,
      completedTopics,
      totalSubjects,
      completedSubjects,
      pendingSubjects,
      remainingDays
    };

    return {
      ...plan,
      stats
    };
  }


  /**
   * Get plan details including all sub-tables and stats
   */
  static async getPlanDetails(planId, requestorId, role) {
    const plan = await prisma.studyPlan.findUnique({
      where: { id: planId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        subjects: {
          orderBy: { displayOrder: 'asc' }
        },
        dailyTargets: {
          orderBy: { date: 'asc' }
        },
        weeklyTargets: {
          orderBy: { weekStart: 'asc' }
        },
        revisionCalendar: {
          orderBy: { date: 'asc' }
        }
      }
    });

    if (!plan) {
      throw ApiError.notFound('Study plan not found.');
    }

    // Authorization: Students can only view their own plans
    if (role === 'STUDENT' && plan.userId !== requestorId) {
      throw ApiError.forbidden('Forbidden: You can only view your own study plans.');
    }

    // Compute progress stats
    const totalDailyTargets = plan.dailyTargets.length;
    const completedDailyTargets = plan.dailyTargets.filter((t) => t.status === 'COMPLETED').length;

    const totalTopics = totalDailyTargets > 0
      ? totalDailyTargets
      : plan.subjects.reduce((sum, s) => sum + (s.totalTopics || 0), 0);
    const completedTopics = totalDailyTargets > 0
      ? completedDailyTargets
      : plan.subjects.reduce((sum, s) => sum + (s.completedTopics || 0), 0);

    const overallProgress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

    const completedSubjects = plan.subjects.filter(s => (s.totalTopics || 0) > 0 && (s.completedTopics || 0) >= (s.totalTopics || 0)).length;
    const totalSubjects = plan.subjects.length;
    const pendingSubjects = Math.max(0, totalSubjects - completedSubjects);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const remainingDays = Math.max(0, Math.ceil((new Date(plan.examDate) - today) / (1000 * 60 * 60 * 24)));

    // Next upcoming revision
    const upcomingRevision = plan.revisionCalendar.find((rc) => new Date(rc.date) >= today) || null;

    // Today's targets
    const todaysTargets = plan.dailyTargets.filter((dt) => {
      const dtDate = new Date(dt.date);
      dtDate.setHours(0, 0, 0, 0);
      return dtDate.getTime() === today.getTime();
    });

    const stats = {
      overallProgress,
      progressPercentage: overallProgress,
      totalDailyTargets,
      completedDailyTargets,
      totalTopics,
      completedTopics,
      totalSubjects,
      completedSubjects,
      pendingSubjects,
      remainingDays,
      upcomingRevision,
      todaysTargets,
      estimatedCompletionDate: plan.examDate
    };

    return { plan, stats };
  }

  /**
   * Edit basic parameters of the plan
   */
  static async updatePlan(planId, userId, updateData, role) {
    const plan = await prisma.studyPlan.findUnique({
      where: { id: planId }
    });

    if (!plan) {
      throw ApiError.notFound('Study plan not found.');
    }

    if (role === 'STUDENT' && plan.userId !== userId) {
      throw ApiError.forbidden('Forbidden: You cannot modify another student\'s study plan.');
    }

    const { examDate, dailyStudyHours, status } = updateData;

    const dataToUpdate = {};
    if (examDate) dataToUpdate.examDate = new Date(examDate);
    if (dailyStudyHours) dataToUpdate.dailyStudyHours = parseFloat(dailyStudyHours);
    if (status) dataToUpdate.status = status;

    const updatedPlan = await prisma.studyPlan.update({
      where: { id: planId },
      data: dataToUpdate
    });

    return updatedPlan;
  }

  /**
   * Delete a plan
   */
  static async deletePlan(planId, userId, role) {
    const plan = await prisma.studyPlan.findUnique({
      where: { id: planId }
    });

    if (!plan) {
      throw ApiError.notFound('Study plan not found.');
    }

    if (role === 'STUDENT' && plan.userId !== userId) {
      throw ApiError.forbidden('Forbidden: You cannot delete another student\'s study plan.');
    }

    await prisma.studyPlan.delete({
      where: { id: planId }
    });

    return { success: true };
  }

  // ── Subjects CRUD Operations ──

  static async addSubject(planId, userId, subjectData, role) {
    let plan = null;
    if (planId && planId !== 'active') {
      plan = await prisma.studyPlan.findUnique({
        where: { id: planId }
      });
    }

    if (!plan) {
      plan = await prisma.studyPlan.findFirst({
        where: { userId, status: 'ACTIVE' }
      });
    }

    if (!plan) {
      // Auto create an active plan for the student if none exists
      const defaultExamDate = new Date();
      defaultExamDate.setMonth(defaultExamDate.getMonth() + 6);

      plan = await prisma.studyPlan.create({
        data: {
          userId,
          cmaLevel: subjectData.cmaLevel || 'INTER',
          examDate: defaultExamDate,
          dailyStudyHours: 4,
          status: 'ACTIVE'
        }
      });
    }

    if (role === 'STUDENT' && plan.userId !== userId) {
      throw ApiError.forbidden('Forbidden: You cannot edit this study plan.');
    }

    const subject = await prisma.studyPlanSubject.create({
      data: {
        planId: plan.id,
        subjectName: subjectData.subjectName,
        totalTopics: parseInt(subjectData.totalTopics || 0),
        completedTopics: parseInt(subjectData.completedTopics || 0),
        displayOrder: parseInt(subjectData.displayOrder || 0)
      }
    });

    return subject;
  }

  static async updateSubject(subjectId, userId, updateData, role) {
    const subject = await prisma.studyPlanSubject.findUnique({
      where: { id: subjectId },
      include: { plan: true }
    });

    if (!subject) {
      throw ApiError.notFound('Subject not found.');
    }

    if (role === 'STUDENT' && subject.plan.userId !== userId) {
      throw ApiError.forbidden('Forbidden: You cannot modify this subject.');
    }

    const dataToUpdate = {};
    if (updateData.subjectName) dataToUpdate.subjectName = updateData.subjectName;
    if (updateData.totalTopics !== undefined) dataToUpdate.totalTopics = parseInt(updateData.totalTopics);
    if (updateData.completedTopics !== undefined) dataToUpdate.completedTopics = parseInt(updateData.completedTopics);
    if (updateData.displayOrder !== undefined) dataToUpdate.displayOrder = parseInt(updateData.displayOrder);

    const updated = await prisma.studyPlanSubject.update({
      where: { id: subjectId },
      data: dataToUpdate
    });

    return updated;
  }

  static async deleteSubject(subjectId, userId, role) {
    const subject = await prisma.studyPlanSubject.findUnique({
      where: { id: subjectId },
      include: { plan: true }
    });

    if (!subject) {
      throw ApiError.notFound('Subject not found.');
    }

    if (role === 'STUDENT' && subject.plan.userId !== userId) {
      throw ApiError.forbidden('Forbidden: You cannot modify this subject.');
    }

    await prisma.studyPlanSubject.delete({
      where: { id: subjectId }
    });

    return { success: true };
  }

  // ── Daily Targets ──

  static async getDailyTargets(planId, userId, role) {
    const plan = await prisma.studyPlan.findUnique({
      where: { id: planId }
    });

    if (!plan) {
      throw ApiError.notFound('Study plan not found.');
    }

    if (role === 'STUDENT' && plan.userId !== userId) {
      throw ApiError.forbidden('Forbidden: Access denied.');
    }

    return await prisma.dailyTarget.findMany({
      where: { planId },
      orderBy: { date: 'asc' }
    });
  }

  static async createDailyTarget(userId, targetData, role = 'STUDENT') {
    const plan = await prisma.studyPlan.findUnique({
      where: { id: targetData.planId },
      include: { subjects: true }
    });

    if (!plan) throw ApiError.notFound('Study plan not found.');
    if (role === 'STUDENT' && plan.userId !== userId) {
      throw ApiError.forbidden('Forbidden: You cannot modify targets for this plan.');
    }

    const hasDate = Boolean(targetData.date && String(targetData.date).trim());
    const hasTime = Boolean(targetData.startTime && String(targetData.startTime).trim());
    const isManual = targetData.isManual !== undefined ? Boolean(targetData.isManual) : (hasDate || hasTime);

    const subjectName = targetData.subjectName || (targetData.topic.includes(':') ? targetData.topic.split(':')[0].trim() : null);

    const rawTargetData = {
      planId: targetData.planId,
      subjectName: subjectName || null,
      date: hasDate ? new Date(targetData.date) : new Date('1970-01-01T00:00:00.000Z'),
      topic: targetData.topic,
      description: targetData.description || null,
      priority: targetData.priority || 'MEDIUM',
      startTime: targetData.startTime || null,
      endTime: targetData.endTime || null,
      isManual,
      studyHours: parseFloat(targetData.studyHours || 2.0),
      status: targetData.status || 'PENDING'
    };

    const createdTarget = await prisma.dailyTarget.create({
      data: filterSupportedFields('DailyTarget', rawTargetData)
    });

    if (subjectName) {
      const matchingSubj = plan.subjects.find(s => s.subjectName.toLowerCase().includes(subjectName.toLowerCase()));
      if (matchingSubj) {
        await prisma.studyPlanSubject.update({
          where: { id: matchingSubj.id },
          data: { totalTopics: { increment: 1 } }
        });
      }
    }

    return createdTarget;
  }

  static async updateDailyTarget(targetId, userId, updateData, role = 'STUDENT') {
    const target = await prisma.dailyTarget.findUnique({
      where: { id: targetId },
      include: { plan: { include: { subjects: true } } }
    });

    if (!target) {
      throw ApiError.notFound('Daily target not found.');
    }

    if (role === 'STUDENT' && target.plan.userId !== userId) {
      throw ApiError.forbidden('Forbidden: You cannot modify this target.');
    }

    const dataToUpdate = {};
    if (updateData.status) dataToUpdate.status = updateData.status;
    if (updateData.topic) dataToUpdate.topic = updateData.topic;
    if (updateData.description !== undefined) dataToUpdate.description = updateData.description;
    if (updateData.priority) dataToUpdate.priority = updateData.priority;
    if (updateData.studyHours !== undefined) dataToUpdate.studyHours = parseFloat(updateData.studyHours);

    if (updateData.date !== undefined) {
      dataToUpdate.date = updateData.date ? new Date(updateData.date) : new Date('1970-01-01T00:00:00.000Z');
      dataToUpdate.isManual = true;
    }
    if (updateData.startTime !== undefined) {
      dataToUpdate.startTime = updateData.startTime || null;
      dataToUpdate.isManual = true;
    }
    if (updateData.endTime !== undefined) {
      dataToUpdate.endTime = updateData.endTime || null;
    }

    const filteredDataToUpdate = filterSupportedFields('DailyTarget', dataToUpdate);

    const updatedTarget = await prisma.dailyTarget.update({
      where: { id: targetId },
      data: filteredDataToUpdate
    });

    // Post-update: Increment / decrement subject completed topics
    if (updateData.status === 'COMPLETED' && target.status !== 'COMPLETED') {
      const parts = target.topic.split(':');
      if (parts.length > 1) {
        const subjectName = parts[0].trim();
        const subjectRecord = target.plan.subjects.find(s => s.subjectName.toLowerCase().includes(subjectName.toLowerCase()));

        if (subjectRecord && subjectRecord.completedTopics < subjectRecord.totalTopics) {
          await prisma.studyPlanSubject.update({
            where: { id: subjectRecord.id },
            data: { completedTopics: { increment: 1 } }
          });
        }
      }
    } else if (updateData.status && updateData.status !== 'COMPLETED' && target.status === 'COMPLETED') {
      const parts = target.topic.split(':');
      if (parts.length > 1) {
        const subjectName = parts[0].trim();
        const subjectRecord = target.plan.subjects.find(s => s.subjectName.toLowerCase().includes(subjectName.toLowerCase()));

        if (subjectRecord && subjectRecord.completedTopics > 0) {
          await prisma.studyPlanSubject.update({
            where: { id: subjectRecord.id },
            data: { completedTopics: { decrement: 1 } }
          });
        }
      }
    }

    return updatedTarget;
  }

  static async deleteDailyTarget(targetId, userId, role = 'STUDENT') {
    const target = await prisma.dailyTarget.findUnique({
      where: { id: targetId },
      include: { plan: { include: { subjects: true } } }
    });

    if (!target) throw ApiError.notFound('Daily target not found.');
    if (role === 'STUDENT' && target.plan.userId !== userId) {
      throw ApiError.forbidden('Forbidden.');
    }

    await prisma.dailyTarget.delete({
      where: { id: targetId }
    });

    if (target.subjectName || target.topic.includes(':')) {
      const subjName = target.subjectName || target.topic.split(':')[0].trim();
      const matchingSubj = target.plan.subjects.find(s => s.subjectName.toLowerCase().includes(subjName.toLowerCase()));
      if (matchingSubj && matchingSubj.totalTopics > 0) {
        const decCompleted = target.status === 'COMPLETED' && matchingSubj.completedTopics > 0 ? 1 : 0;
        await prisma.studyPlanSubject.update({
          where: { id: matchingSubj.id },
          data: {
            totalTopics: Math.max(0, matchingSubj.totalTopics - 1),
            completedTopics: Math.max(0, matchingSubj.completedTopics - decCompleted)
          }
        });
      }
    }

    return { success: true };
  }

  static async suggestSchedule(planId, userId, role = 'STUDENT', options = {}) {
    const plan = await prisma.studyPlan.findUnique({
      where: { id: planId },
      include: { dailyTargets: true }
    });

    if (!plan) throw ApiError.notFound('Study plan not found.');
    if (role === 'STUDENT' && plan.userId !== userId) throw ApiError.forbidden('Forbidden.');

    // Filters targets needing suggested scheduling (preserves manual ones)
    const targetsToSchedule = plan.dailyTargets.filter((t) => {
      if (options.onlyUnscheduled !== false) {
        return !t.date || (!t.isManual && t.status !== 'COMPLETED');
      }
      return !t.isManual && t.status !== 'COMPLETED';
    });

    if (targetsToSchedule.length === 0) {
      return { suggestions: [], message: 'All topics are already scheduled or completed.' };
    }

    const startDate = plan.startDate ? new Date(plan.startDate) : new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let currDate = new Date(Math.max(startDate.getTime(), today.getTime()));

    let availableDaysArr = [1, 2, 3, 4, 5, 6, 0];
    if (plan.availableDays) {
      try {
        const parsed = JSON.parse(plan.availableDays);
        if (Array.isArray(parsed) && parsed.length > 0) {
          availableDaysArr = parsed.map(Number);
        }
      } catch (e) {
        // default
      }
    }

    const prefStart = plan.preferredStartTime || '19:00';
    const prefEnd = plan.preferredEndTime || '21:00';

    const suggestions = [];
    let dayCount = 0;

    for (const target of targetsToSchedule) {
      while (dayCount < 365) {
        const dayOfWeek = currDate.getDay();
        if (availableDaysArr.includes(dayOfWeek)) {
          break;
        }
        currDate.setDate(currDate.getDate() + 1);
        dayCount++;
      }

      const isoDate = currDate.toISOString().split('T')[0];
      suggestions.push({
        targetId: target.id,
        topic: target.topic,
        subjectName: target.subjectName,
        currentDate: target.date ? new Date(target.date).toISOString().split('T')[0] : null,
        suggestedDate: isoDate,
        suggestedStartTime: prefStart,
        suggestedEndTime: prefEnd,
        studyHours: target.studyHours || 2.0
      });

      currDate.setDate(currDate.getDate() + 1);
      dayCount++;
    }

    return { suggestions };
  }

  static async applySuggestedSchedule(planId, userId, suggestions = [], role = 'STUDENT') {
    const plan = await prisma.studyPlan.findUnique({
      where: { id: planId }
    });

    if (!plan) throw ApiError.notFound('Study plan not found.');
    if (role === 'STUDENT' && plan.userId !== userId) throw ApiError.forbidden('Forbidden.');

    for (const item of suggestions) {
      if (!item.targetId || !item.suggestedDate) continue;
      await prisma.dailyTarget.update({
        where: { id: item.targetId },
        data: {
          date: new Date(item.suggestedDate),
          startTime: item.suggestedStartTime || null,
          endTime: item.suggestedEndTime || null,
          isManual: false
        }
      });
    }

    return { success: true, count: suggestions.length };
  }

  // ── Weekly Targets ──

  static async getWeeklyTargets(planId, userId, role) {
    const plan = await prisma.studyPlan.findUnique({
      where: { id: planId }
    });

    if (!plan) {
      throw ApiError.notFound('Study plan not found.');
    }

    if (role === 'STUDENT' && plan.userId !== userId) {
      throw ApiError.forbidden('Forbidden: Access denied.');
    }

    return await prisma.weeklyTarget.findMany({
      where: { planId },
      orderBy: { weekStart: 'asc' }
    });
  }

  static async createWeeklyTarget(userId, targetData, role) {
    const plan = await prisma.studyPlan.findUnique({
      where: { id: targetData.planId }
    });

    if (!plan) {
      throw ApiError.notFound('Study plan not found.');
    }

    if (role === 'STUDENT' && plan.userId !== userId) {
      throw ApiError.forbidden('Forbidden: You cannot modify targets for this plan.');
    }

    return await prisma.weeklyTarget.create({
      data: {
        planId: targetData.planId,
        weekStart: new Date(targetData.weekStart),
        goalDescription: targetData.goalDescription,
        status: 'PENDING'
      }
    });
  }

  static async updateWeeklyTarget(targetId, userId, updateData, role) {
    const target = await prisma.weeklyTarget.findUnique({
      where: { id: targetId },
      include: { plan: true }
    });

    if (!target) {
      throw ApiError.notFound('Weekly target not found.');
    }

    if (role === 'STUDENT' && target.plan.userId !== userId) {
      throw ApiError.forbidden('Forbidden: You cannot modify this target.');
    }

    const dataToUpdate = {};
    if (updateData.status) dataToUpdate.status = updateData.status;
    if (updateData.goalDescription) dataToUpdate.goalDescription = updateData.goalDescription;

    return await prisma.weeklyTarget.update({
      where: { id: targetId },
      data: dataToUpdate
    });
  }

  // ── Revision Calendar ──

  static async getRevisionCalendar(planId, userId, role) {
    const plan = await prisma.studyPlan.findUnique({
      where: { id: planId }
    });

    if (!plan) {
      throw ApiError.notFound('Study plan not found.');
    }

    if (role === 'STUDENT' && plan.userId !== userId) {
      throw ApiError.forbidden('Forbidden: Access denied.');
    }

    return await prisma.revisionCalendar.findMany({
      where: { planId },
      orderBy: { date: 'asc' }
    });
  }
}
