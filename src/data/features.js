import {
  FiActivity,
  FiArchive,
  FiBarChart2,
  FiBookOpen,
  FiCalendar,
  FiCheckCircle,
  FiDroplet,
  FiFileText,
  FiHelpCircle,
  FiHome,
  FiLayers,
  FiSettings,
  FiSmile,
  FiType,
  FiUsers,
  FiVideo
} from 'react-icons/fi';

export const projectFeatures = [
  { title: 'Dashboard', description: 'Wellness score, today’s plan, and recent activity in one view.', icon: FiHome },
  { title: 'Profile', description: 'Health info, preferences, and automatic BMI calculation.', icon: FiUsers },
  { title: 'Symptom Checker', description: 'Describe symptoms in plain language and get food guidance.', icon: FiActivity },
  { title: 'Diet Plan', description: 'Generate balanced 7-day meal plans with shopping lists.', icon: FiCalendar },
  { title: 'Recipes', description: 'Create, save, favorite, and share healthy recipes.', icon: FiBookOpen },
  { title: 'Food Scanner', description: 'Scan or describe food to estimate nutrition and fit.', icon: FiVideo },
  { title: 'Food Checker', description: 'Check safety, portions, med interactions, and alternatives.', icon: FiCheckCircle },
  { title: 'Nutrition', description: 'Log meals, track calories, and export nutrition reports.', icon: FiBarChart2 },
  { title: 'Water Tracker', description: 'Log daily hydration with goals and quick-add amounts.', icon: FiDroplet },
  { title: 'Health Metrics', description: 'Track weight, steps, sleep, vitals, and personal goals.', icon: FiArchive },
  { title: 'Family', description: 'Manage family profiles, switching, and shared shopping.', icon: FiUsers },
  { title: 'Achievements', description: 'Earn points, streaks, and badges for healthy habits.', icon: FiSmile },
  { title: 'Doctor Reports', description: 'Upload reports and review extracted health summaries.', icon: FiFileText },
  { title: 'Corporate', description: 'Employee wellness dashboards and cafeteria insights.', icon: FiLayers },
  { title: 'School', description: 'Tiffin planner, parent view, and healthy menu ideas.', icon: FiBookOpen },
  { title: 'Settings', description: 'Dark mode, notifications, reminders, and PDF export.', icon: FiSettings },
  { title: 'Language', description: 'Choose from 9 Indian languages and use voice input.', icon: FiType },
  { title: 'Help & Privacy', description: 'FAQs, guidance, and how your data is handled.', icon: FiHelpCircle }
];
