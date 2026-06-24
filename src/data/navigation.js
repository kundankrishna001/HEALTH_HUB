import {
  FiActivity,
  FiArchive,
  FiBarChart2,
  FiBookOpen,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiDroplet,
  FiDatabase,
  FiFileText,
  FiHelpCircle,
  FiHome,
  FiLayers,
  FiMessageSquare,
  FiMoon,
  FiSettings,
  FiSmile,
  FiUsers,
  FiVideo,
  FiWifi,
  FiShield,
  FiSun,
  FiType
} from 'react-icons/fi';

export const navigation = [
  { label: 'Dashboard', to: '/app', icon: FiHome },
  { label: 'Profile', to: '/app/profile', icon: FiUsers },
  { label: 'Symptoms', to: '/app/symptoms', icon: FiActivity },
  { label: 'Diet Plan', to: '/app/diet-plan', icon: FiCalendar },
  { label: 'Recipes', to: '/app/recipes', icon: FiBookOpen },
  { label: 'Food Scanner', to: '/app/food-scanner', icon: FiVideo },
  { label: 'Food Checker', to: '/app/food-checker', icon: FiCheckCircle },
  { label: 'Nutrition', to: '/app/nutrition', icon: FiBarChart2 },
  { label: 'Water', to: '/app/water', icon: FiDroplet },
  { label: 'Metrics', to: '/app/metrics', icon: FiArchive },
  { label: 'Family', to: '/app/family', icon: FiUsers },
  { label: 'Achievements', to: '/app/achievements', icon: FiSmile },
  { label: 'Doctor', to: '/app/doctor', icon: FiFileText },
  { label: 'Corporate', to: '/app/corporate', icon: FiLayers },
  { label: 'School', to: '/app/school', icon: FiBookOpen },
  { label: 'Settings', to: '/app/settings', icon: FiSettings },
  { label: 'Language', to: '/app/language', icon: FiType },
  { label: 'Help', to: '/app/help', icon: FiHelpCircle },
  { label: 'Privacy', to: '/app/privacy', icon: FiShield }
];

export const authNavigation = [
  { label: 'Login', to: '/login' },
  { label: 'Sign Up', to: '/signup' }
];
