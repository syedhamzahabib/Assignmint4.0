// Rich mock data with detailed task information
export const mockRequesterTasks = [
  {
    id: 'req_1',
    title: 'Solve 10 Calculus Problems',
    dueDate: '2025-05-25',
    status: 'in_progress',
    expertName: 'Sarah Chen',
    expertId: 'exp_001',
    subject: 'Math',
    price: '$20',
    postedDate: '2025-05-20',
    description: 'Need help with derivatives and integrals for my calculus homework. The problems involve advanced techniques including integration by parts, substitution, and partial fractions. Please show all work step by step.',
    requirements: [
      'Show all work step by step',
      'Explain the reasoning behind each step',
      'Provide final answers in simplified form',
      'Include graphs where applicable'
    ],
    attachments: [
      { name: 'calculus_problems.pdf', size: '2.4 MB', type: 'pdf' },
      { name: 'reference_sheet.jpg', size: '856 KB', type: 'image' }
    ],
    aiLevel: 'none',
    estimatedHours: 3,
    urgency: 'medium',
    tags: ['calculus', 'derivatives', 'integrals', 'homework'],
    progress: 65,
    expertRating: 4.8,
    expertCompletedTasks: 127
  },
  {
    id: 'req_2',
    title: 'Fix bugs in Python script',
    dueDate: '2025-05-22',
    status: 'pending_review',
    expertName: 'Alex Kumar',
    expertId: 'exp_002',
    subject: 'Coding',
    price: '$30',
    postedDate: '2025-05-19',
    description: 'Python script has some logic errors that need debugging. The script is supposed to process CSV data but crashes on certain input files. Need someone experienced with pandas and error handling.',
    requirements: [
      'Fix all runtime errors',
      'Add proper error handling',
      'Optimize performance where possible',
      'Add comments explaining fixes',
      'Test with provided sample data'
    ],
    attachments: [
      { name: 'data_processor.py', size: '4.2 KB', type: 'python' },
      { name: 'test_data.csv', size: '1.8 MB', type: 'csv' },
      { name: 'error_log.txt', size: '3.1 KB', type: 'text' }
    ],
    deliverables: [
      { name: 'fixed_data_processor.py', size: '5.1 KB', type: 'python' },
      { name: 'test_results.txt', size: '892 B', type: 'text' },
      { name: 'documentation.md', size: '2.3 KB', type: 'markdown' }
    ],
    aiLevel: 'partial',
    aiPercentage: 30,
    estimatedHours: 2,
    urgency: 'high',
    tags: ['python', 'debugging', 'csv', 'pandas'],
    progress: 100,
    completedDate: '2025-05-21',
    expertRating: 4.9,
    expertCompletedTasks: 89
  },
  {
    id: 'req_3',
    title: 'Write 500-word essay on Civil War',
    dueDate: '2025-05-24',
    status: 'completed',
    expertName: 'Emily Rodriguez',
    expertId: 'exp_003',
    subject: 'Writing',
    price: '$15',
    postedDate: '2025-05-18',
    description: 'Need a well-researched essay about the American Civil War causes. Must include primary sources and follow MLA format. The essay should focus on economic, political, and social factors.',
    requirements: [
      'Minimum 500 words',
      'MLA format with proper citations',
      'At least 3 primary sources',
      'Include bibliography',
      'Original work, no plagiarism',
      'Focus on causes, not just events'
    ],
    attachments: [
      { name: 'essay_guidelines.pdf', size: '245 KB', type: 'pdf' },
      { name: 'required_sources.txt', size: '1.2 KB', type: 'text' }
    ],
    deliverables: [
      { name: 'civil_war_essay.docx', size: '28 KB', type: 'document' },
      { name: 'bibliography.pdf', size: '156 KB', type: 'pdf' },
      { name: 'plagiarism_report.pdf', size: '445 KB', type: 'pdf' }
    ],
    aiLevel: 'none',
    estimatedHours: 4,
    urgency: 'medium',
    tags: ['essay', 'history', 'civil-war', 'mla-format'],
    progress: 100,
    completedDate: '2025-05-23',
    rating: 5,
    feedback: 'Excellent work! Very thorough research and well-structured argument.',
    expertRating: 4.7,
    expertCompletedTasks: 156
  },
  {
    id: 'req_4',
    title: 'Design a logo for student group',
    dueDate: '2025-05-26',
    status: 'awaiting_expert',
    expertName: null,
    expertId: null,
    subject: 'Design',
    price: '$18',
    postedDate: '2025-05-21',
    description: 'Looking for a modern logo design for our computer science club. Should incorporate tech elements and be suitable for both digital and print use. We want something that represents innovation and learning.',
    requirements: [
      'Modern, professional design',
      'Include tech/computer elements',
      'Scalable vector format (SVG/AI)',
      'Multiple color variations',
      'Usage guidelines document',
      'Revisions until satisfied'
    ],
    attachments: [
      { name: 'brand_inspiration.pdf', size: '3.2 MB', type: 'pdf' },
      { name: 'club_info.txt', size: '1.1 KB', type: 'text' },
      { name: 'color_preferences.jpg', size: '892 KB', type: 'image' }
    ],
    aiLevel: 'partial',
    aiPercentage: 20,
    estimatedHours: 5,
    urgency: 'low',
    tags: ['logo', 'design', 'computer-science', 'branding'],
    applicants: 12,
    views: 45
  },
  {
    id: 'req_5',
    title: 'Chemistry Lab Report Analysis',
    dueDate: '2025-05-23',
    status: 'disputed',
    expertName: 'Dr. James Wilson',
    expertId: 'exp_004',
    subject: 'Chemistry',
    price: '$25',
    postedDate: '2025-05-17',
    description: 'Need analysis of organic chemistry lab results and conclusions. The report should include detailed calculations and theoretical explanations of observed reactions.',
    requirements: [
      'Analyze experimental data thoroughly',
      'Calculate theoretical vs actual yields',
      'Explain any discrepancies observed',
      'Suggest improvements for future experiments',
      'Professional lab report format'
    ],
    attachments: [
      { name: 'lab_data.xlsx', size: '892 KB', type: 'excel' },
      { name: 'procedure.pdf', size: '1.4 MB', type: 'pdf' },
      { name: 'raw_observations.txt', size: '2.1 KB', type: 'text' }
    ],
    deliverables: [
      { name: 'lab_analysis.docx', size: '15.3 KB', type: 'document' },
      { name: 'calculations.xlsx', size: '445 KB', type: 'excel' }
    ],
    aiLevel: 'none',
    estimatedHours: 6,
    urgency: 'high',
    tags: ['chemistry', 'lab-report', 'analysis', 'organic'],
    disputeReason: 'Analysis was incomplete and missing several required calculations. Did not address the discrepancies in yield percentages.',
    disputeDate: '2025-05-22',
    expertRating: 3.2,
    expertCompletedTasks: 23
  }
];

export const mockExpertTasks = [
  {
    id: 'exp_1',
    title: 'Translate English to Spanish document',
    dueDate: '2025-05-27',
    status: 'working',
    requesterName: 'John Smith',
    requesterId: 'req_001',
    subject: 'Language',
    price: '$22',
    acceptedDate: '2025-05-20',
    description: 'Technical document translation from English to Spanish. Document contains software development terminology and requires accurate technical translation while maintaining readability.',
    requirements: [
      'Professional Spanish translation',
      'Maintain technical accuracy',
      'Keep original formatting',
      'Proofread for grammar and flow',
      'Provide glossary of technical terms'
    ],
    attachments: [
      { name: 'technical_doc.docx', size: '2.8 MB', type: 'document' },
      { name: 'glossary.pdf', size: '445 KB', type: 'pdf' },
      { name: 'style_guide.txt', size: '1.2 KB', type: 'text' }
    ],
    estimatedHours: 4,
    progress: 65,
    urgency: 'medium',
    tags: ['translation', 'spanish', 'technical', 'software'],
    requesterRating: 4.6,
    deadline: '2025-05-27 15:00'
  },
  {
    id: 'exp_2',
    title: 'Build basic website in HTML/CSS',
    dueDate: '2025-05-28',
    status: 'delivered',
    requesterName: 'Maria Garcia',
    requesterId: 'req_002',
    subject: 'Coding',
    price: '$40',
    acceptedDate: '2025-05-19',
    description: 'Create a responsive portfolio website using HTML, CSS, and JavaScript. Should be mobile-friendly and include contact form functionality with modern design.',
    requirements: [
      'Responsive design for all devices',
      'Cross-browser compatibility',
      'Contact form with validation',
      'Clean, modern UI design',
      'Fast loading times',
      'SEO-friendly structure'
    ],
    attachments: [
      { name: 'design_mockup.figma', size: '5.2 MB', type: 'design' },
      { name: 'content.txt', size: '2.1 KB', type: 'text' },
      { name: 'images.zip', size: '8.7 MB', type: 'archive' }
    ],
    deliverables: [
      { name: 'portfolio_website.zip', size: '12.4 MB', type: 'archive' },
      { name: 'documentation.pdf', size: '890 KB', type: 'pdf' },
      { name: 'deployment_guide.md', size: '2.3 KB', type: 'markdown' }
    ],
    estimatedHours: 8,
    progress: 100,
    urgency: 'medium',
    tags: ['html', 'css', 'javascript', 'responsive', 'portfolio'],
    deliveredDate: '2025-05-27',
    deliveryMessage: 'Website completed with all requirements. Includes bonus mobile animations and contact form backend integration.',
    requesterRating: 4.8
  },
  {
    id: 'exp_3',
    title: 'Advanced Physics Problem Set',
    dueDate: '2025-05-23',
    status: 'payment_received',
    requesterName: 'David Park',
    requesterId: 'req_003',
    subject: 'Physics',
    price: '$35',
    acceptedDate: '2025-05-18',
    description: 'Quantum mechanics and electromagnetic field problems from graduate-level physics course. Requires detailed mathematical derivations and physical interpretations.',
    requirements: [
      'Complete mathematical solutions',
      'Step-by-step derivations',
      'Physical interpretations of results',
      'Verify units and dimensional analysis',
      'Include relevant diagrams'
    ],
    attachments: [
      { name: 'physics_problems.pdf', size: '3.1 MB', type: 'pdf' },
      { name: 'formula_sheet.pdf', size: '1.8 MB', type: 'pdf' },
      { name: 'constants.txt', size: '445 B', type: 'text' }
    ],
    deliverables: [
      { name: 'solutions.pdf', size: '4.2 MB', type: 'pdf' },
      { name: 'explanations.docx', size: '1.9 MB', type: 'document' },
      { name: 'diagrams.png', size: '892 KB', type: 'image' }
    ],
    estimatedHours: 6,
    progress: 100,
    urgency: 'high',
    tags: ['physics', 'quantum-mechanics', 'electromagnetic', 'graduate'],
    completedDate: '2025-05-22',
    paymentDate: '2025-05-23',
    rating: 5,
    feedback: 'Outstanding work! Clear explanations and perfect mathematical rigor.',
    requesterRating: 4.9
  },
  {
    id: 'exp_4',
    title: 'Market Research for Tech Startup',
    dueDate: '2025-05-29',
    status: 'working',
    requesterName: 'Lisa Thompson',
    requesterId: 'req_004',
    subject: 'Business',
    price: '$50',
    acceptedDate: '2025-05-21',
    description: 'Conduct comprehensive market research for tech startup business plan. Include competitor analysis, target market identification, and growth projections.',
    requirements: [
      'Market size analysis',
      'Competitor research and positioning',
      'Target demographic study',
      'Financial projections and models',
      'Executive summary presentation'
    ],
    attachments: [
      { name: 'business_idea.pdf', size: '1.5 MB', type: 'pdf' },
      { name: 'initial_research.xlsx', size: '987 KB', type: 'excel' },
      { name: 'questions.txt', size: '2.1 KB', type: 'text' }
    ],
    estimatedHours: 12,
    progress: 40,
    urgency: 'medium',
    tags: ['business-plan', 'market-research', 'startup', 'analysis'],
    milestone: 'Completed competitor analysis, working on market sizing',
    requesterRating: 4.7
  },
  {
    id: 'exp_5',
    title: 'Psychology Research Paper',
    dueDate: '2025-05-24',
    status: 'revision_requested',
    requesterName: 'Michael Brown',
    requesterId: 'req_005',
    subject: 'Psychology',
    price: '$28',
    acceptedDate: '2025-05-17',
    description: 'Research paper on cognitive behavioral therapy effectiveness. Must include recent studies and statistical analysis of treatment outcomes.',
    requirements: [
      'Literature review (2020-2025)',
      'Statistical analysis of studies',
      'APA format throughout',
      'Minimum 2500 words',
      'Peer-reviewed sources only'
    ],
    attachments: [
      { name: 'paper_guidelines.pdf', size: '234 KB', type: 'pdf' },
      { name: 'source_list.docx', size: '67 KB', type: 'document' },
      { name: 'template.docx', size: '45 KB', type: 'document' }
    ],
    deliverables: [
      { name: 'cbt_research_paper_v1.docx', size: '156 KB', type: 'document' },
      { name: 'bibliography.pdf', size: '89 KB', type: 'pdf' }
    ],
    estimatedHours: 10,
    progress: 85,
    urgency: 'high',
    tags: ['psychology', 'research-paper', 'cbt', 'apa-format'],
    revisionNotes: 'Please add more recent studies from 2024-2025 and strengthen the statistical analysis section. Also need clearer transitions between sections.',
    revisionDate: '2025-05-23',
    requesterRating: 4.5
  }
];

// Helper functions
export const getTasksByStatus = (tasks, status) => {
  return tasks.filter(task => task.status === status);
};

export const getTasksByUrgency = (tasks, urgency) => {
  return tasks.filter(task => task.urgency === urgency);
};

export const searchTasks = (tasks, query) => {
  const lowercaseQuery = query.toLowerCase();
  return tasks.filter(task => 
    task.title.toLowerCase().includes(lowercaseQuery) ||
    task.subject.toLowerCase().includes(lowercaseQuery) ||
    task.description.toLowerCase().includes(lowercaseQuery) ||
    (task.expertName && task.expertName.toLowerCase().includes(lowercaseQuery)) ||
    (task.requesterName && task.requesterName.toLowerCase().includes(lowercaseQuery))
  );
};