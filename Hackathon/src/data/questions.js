// 10 questions across 4 dimensions — weights must sum to 100
export const DIMENSIONS = {
  technical: { label: 'Technical Skills', color: '#3b82f6', icon: '💻' },
  resume: { label: 'Resume', color: '#8b5cf6', icon: '📄' },
  communication: { label: 'Communication', color: '#10b981', icon: '🗣️' },
  portfolio: { label: 'Portfolio', color: '#f59e0b', icon: '🗂️' },
};

export const ROLES = [
  { value: 'software_engineer', label: 'Software Engineer' },
  { value: 'data_science', label: 'Data Science / ML' },
  { value: 'product_manager', label: 'Product Manager' },
  { value: 'frontend_developer', label: 'Frontend Developer' },
  { value: 'backend_developer', label: 'Backend Developer' },
  { value: 'devops', label: 'DevOps / Cloud' },
  { value: 'fullstack', label: 'Full Stack Developer' },
  { value: 'mobile', label: 'Mobile Developer' },
];

// Questions per role variant — shared base + role-specific technical Q
export const getQuestions = (role) => {
  const technicalQ = {
    software_engineer: 'How comfortable are you with data structures and algorithms (linked lists, trees, dynamic programming)?',
    data_science: 'How comfortable are you with machine learning concepts like model evaluation, overfitting, and feature engineering?',
    product_manager: 'How comfortable are you with product metrics, A/B testing, and user story writing?',
    frontend_developer: 'How comfortable are you with JavaScript frameworks (React/Vue), CSS, and performance optimization?',
    backend_developer: 'How comfortable are you with REST APIs, databases (SQL/NoSQL), and system design?',
    devops: 'How comfortable are you with CI/CD pipelines, containerization (Docker/K8s), and cloud platforms?',
    fullstack: 'How comfortable are you with end-to-end development including APIs, databases, and frontend frameworks?',
    mobile: 'How comfortable are you with mobile frameworks (React Native/Flutter/Swift/Kotlin) and app architecture?',
  };

  return [
    // --- TECHNICAL (3 questions) ---
    {
      id: 1,
      dimension: 'technical',
      question: technicalQ[role] || technicalQ['software_engineer'],
      type: 'scale',
      scaleLabels: ['Not comfortable', 'Expert'],
    },
    {
      id: 2,
      dimension: 'technical',
      question: 'How many LeetCode/coding problems (or equivalent) have you solved in the past month?',
      type: 'choice',
      options: ['0', '1–10', '11–30', '30+'],
    },
    {
      id: 3,
      dimension: 'technical',
      question: 'Have you completed any system design exercises or mock technical interviews recently?',
      type: 'choice',
      options: ['Never', 'Tried once or twice', 'A few sessions', 'Regularly practicing'],
    },

    // --- RESUME (2 questions) ---
    {
      id: 4,
      dimension: 'resume',
      question: 'How well does your resume reflect your most recent projects and skills?',
      type: 'scale',
      scaleLabels: ['Outdated', 'Fully up-to-date'],
    },
    {
      id: 5,
      dimension: 'resume',
      question: 'Have you tailored your resume for the specific role you are targeting?',
      type: 'choice',
      options: ['No, it\'s generic', 'Slightly tailored', 'Tailored for this role', 'Multiple versions ready'],
    },

    // --- COMMUNICATION (3 questions) ---
    {
      id: 6,
      dimension: 'communication',
      question: 'How confident are you explaining your past projects clearly in an interview setting?',
      type: 'scale',
      scaleLabels: ['Very nervous', 'Very confident'],
    },
    {
      id: 7,
      dimension: 'communication',
      question: 'Have you done mock interviews or practiced answering behavioral questions (STAR method)?',
      type: 'choice',
      options: ['No practice', 'Once or twice', 'Several times', 'Regular practice'],
    },
    {
      id: 8,
      dimension: 'communication',
      question: 'How do you handle unexpected questions in an interview?',
      type: 'choice',
      options: ['I freeze up', 'I get flustered but manage', 'I pause, think, and answer', 'I stay calm and structured'],
    },

    // --- PORTFOLIO (2 questions) ---
    {
      id: 9,
      dimension: 'portfolio',
      question: 'How many substantial projects (deployed or on GitHub) do you have to show employers?',
      type: 'choice',
      options: ['0', '1–2', '3–5', '5+'],
    },
    {
      id: 10,
      dimension: 'portfolio',
      question: 'Does your LinkedIn profile, GitHub, or personal website accurately represent your skills and experience?',
      type: 'scale',
      scaleLabels: ['Empty / outdated', 'Strong & active'],
    },
  ];
};
