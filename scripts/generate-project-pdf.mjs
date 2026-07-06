import { jsPDF } from 'jspdf';
import { writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, '..', 'docs');
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, 'Health-Hub-Project-Documentation.pdf');

const doc = new jsPDF({ unit: 'mm', format: 'a4', compress: true });
const margin = 14;
const pageW = 210 - margin * 2;
const pageBottom = 287;
let y = margin;

const primary = [0, 113, 227];
const muted = [90, 90, 90];

function newPage() {
  doc.addPage();
  y = margin;
}

function ensureSpace(h = 10) {
  if (y + h > pageBottom) newPage();
}

function heading(text, size = 16) {
  ensureSpace(size * 0.6 + 6);
  doc.setTextColor(...primary);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(size);
  doc.text(text, margin, y);
  y += size * 0.55 + 4;
  doc.setTextColor(0, 0, 0);
}

function subheading(text) {
  ensureSpace(12);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(text, margin, y);
  y += 7;
}

function body(text, indent = 0) {
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const lines = doc.splitTextToSize(text, pageW - indent);
  for (const line of lines) {
    ensureSpace(6);
    doc.text(line, margin + indent, y);
    y += 5;
  }
  y += 2;
}

function bullet(text, indent = 4) {
  body(`• ${text}`, indent);
}

function monoBlock(text) {
  doc.setFont('courier', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...muted);
  const lines = text.trim().split('\n');
  for (const line of lines) {
    ensureSpace(5);
    doc.text(line, margin, y);
    y += 4.2;
  }
  doc.setTextColor(0, 0, 0);
  y += 3;
}

function table(headers, rows) {
  const colW = pageW / headers.length;
  ensureSpace(8 + rows.length * 6);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  headers.forEach((h, i) => doc.text(h, margin + i * colW, y));
  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  rows.forEach((row) => {
    ensureSpace(6);
    row.forEach((cell, i) => {
      const cellLines = doc.splitTextToSize(String(cell), colW - 2);
      doc.text(cellLines[0] || '', margin + i * colW, y);
    });
    y += 5.5;
  });
  y += 4;
}

function footer() {
  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i += 1) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...muted);
    doc.text(`Health Hub — Project Documentation`, margin, 292);
    doc.text(`Page ${i} of ${pages}`, 210 - margin - 20, 292);
    doc.setTextColor(0, 0, 0);
  }
}

// --- Title page ---
doc.setFillColor(...primary);
doc.rect(0, 0, 210, 70, 'F');
doc.setTextColor(255, 255, 255);
doc.setFont('helvetica', 'bold');
doc.setFontSize(28);
doc.text('Health Hub', margin, 35);
doc.setFontSize(13);
doc.setFont('helvetica', 'normal');
doc.text('Complete Project Documentation', margin, 48);
doc.text('Tech stack • Architecture • Features • Data flows', margin, 57);
doc.setTextColor(0, 0, 0);
y = 85;

body('Author: Kundan Krishna');
body('Institution: Sathyabama Institute of Science and Technology, Chennai');
body('Live URL: https://kundankrishna.tech/healthhub/');
body('Repository: https://github.com/kundankrishna001/HEALTHCHECK26');
body('Generated for presentations, viva, and technical walkthroughs.');
y += 4;

heading('1. Executive Summary', 14);
body(
  'Health Hub is a full-stack HealthTech web application that helps users track wellness habits, check symptoms, plan meals, scan food, and manage family health profiles from a single dashboard. The frontend is a React single-page application (SPA) served by Nginx. The backend is a Node.js Express REST API with JWT authentication and MySQL persistence. AI-powered guidance uses a resilient fallback knowledge base stored in MySQL rather than a live external LLM, ensuring the app works even when AI services are unavailable.'
);

heading('2. Problem Statement & Purpose', 14);
bullet('People struggle to track nutrition, hydration, symptoms, and health metrics in one place.');
bullet('Health Hub centralizes symptom checking, diet planning, recipes, water tracking, and family profiles.');
bullet('Designed for students, families, and everyday users who want practical wellness tools.');
bullet('Domain: HealthTech & Wellness — personal health management and habit tracking.');

heading('3. Technology Stack', 14);
table(
  ['Layer', 'Technologies'],
  [
    ['Languages', 'JavaScript (ES modules), HTML, CSS, SQL'],
    ['Frontend', 'React 18, React Router 6, Vite 5, Chart.js, react-hook-form, Yup'],
    ['Backend', 'Node.js, Express 4, JWT, bcryptjs, CORS, dotenv'],
    ['Database', 'MySQL 8 — users, user_states (JSON), ai_fallback_knowledge'],
    ['PDF export', 'jsPDF (client-side health data export)'],
    ['Deployment', 'DigitalOcean droplet, Nginx, PM2/systemd, Certbot (HTTPS)'],
    ['Dev tooling', 'npm, concurrently, Python deploy script, Bash/PowerShell scripts']
  ]
);

heading('4. High-Level System Architecture', 14);
monoBlock(`
┌──────────────┐     HTTPS      ┌─────────────┐     REST/JWT    ┌────────────────┐
│   Browser    │ ─────────────► │    Nginx    │ ──────────────► │  Express API   │
│  React SPA   │ ◄───────────── │  (static +  │ ◄────────────── │  (Node.js)     │
│              │   JSON/HTML    │   /api proxy)│                 │  Port 4000     │
└──────────────┘                └─────────────┘                 └───────┬────────┘
                                                                        │
                                                                        ▼
                                                                ┌───────────────┐
                                                                │    MySQL      │
                                                                │ users         │
                                                                │ user_states   │
                                                                │ ai_fallback   │
                                                                └───────────────┘
`);

heading('5. Frontend Architecture', 14);
bullet('Entry: index.html → main.jsx → App.jsx with React Router (basename /healthhub in production).');
bullet('Context providers: ThemeContext, AuthContext, AppContext wrap the entire app.');
bullet('Public routes: /, /features, /about, /login, /signup, /forgot-password, /reset-password.');
bullet('Protected routes: /app/* wrapped by ProtectedRoute + AppShell (sidebar, topbar, mobile nav).');
bullet('State: AppContext loads user state once via GET /api/state; mutations use PUT /api/state.');
bullet('Services: authService, stateService, httpClient, aiEngine, demoMode, exportPdf.');

heading('6. Backend API Endpoints', 14);
table(
  ['Method', 'Endpoint', 'Auth', 'Purpose'],
  [
    ['GET', '/api/health', 'No', 'API health check'],
    ['POST', '/api/auth/signup', 'No', 'Create account + default state'],
    ['POST', '/api/auth/login', 'No', 'Email/password login → JWT'],
    ['POST', '/api/auth/demo', 'No', 'Demo user session'],
    ['GET', '/api/auth/me', 'Yes', 'Current user profile'],
    ['POST', '/api/auth/logout', 'Yes', 'Logout (stateless)'],
    ['POST', '/api/auth/reset-request', 'No', 'Password reset token'],
    ['POST', '/api/auth/reset-password', 'No', 'Set new password'],
    ['GET', '/api/state', 'Yes', 'Load or create user JSON state'],
    ['PUT', '/api/state', 'Yes', 'Deep-merge and save state'],
    ['POST', '/api/ai-fallback', 'Yes', 'Knowledge-base health responses'],
    ['GET', '/api/admin/diagnostics', 'Admin', 'DB and state diagnostics']
  ]
);

heading('7. Database Schema', 14);
monoBlock(`
users
  id, name, email, password_hash, role, reset_token, reset_token_expires, timestamps

user_states
  user_id (FK), state_json (JSON blob), timestamps

ai_fallback_knowledge
  id, type, input_keyword, output_json, created_at
  Types: symptoms | weeklyPlan | recipe | checkFood | scanFood
`);

body('User state JSON contains: user profile, family[], symptoms[], meals[], water[], metrics[], recipes[], dietPlans[], badges[], settings{}.');

heading('8. Authentication Flow', 14);
monoBlock(`
1. User opens app → AuthContext reads JWT from browser storage
2. If token exists → GET /api/auth/me validates session
3. If no token → user sees public pages (Welcome, Login)
4. Signup/Login → POST /api/auth/* → JWT stored → redirect to /app
5. ProtectedRoute blocks /app/* without valid user
6. httpClient attaches Bearer token; 401 clears token and redirects to login
7. Demo mode: POST /api/auth/demo OR offline localStorage fallback
`);

heading('9. Application Data Flow', 14);
monoBlock(`
User action (e.g. log water)
        │
        ▼
React page component
        │
        ▼
AppContext → stateService.logWater()
        │
        ▼
GET current state → merge change → PUT /api/state
        │
        ▼
MySQL user_states.state_json updated
        │
        ▼
AppContext refreshes local state → UI re-renders
`);

heading('10. AI / Health Guidance Flow', 14);
body('The aiEngine simulates AI failure by design, then queries the fallback API:');
monoBlock(`
Symptom / Recipe / Food request
        │
        ▼
aiEngine.js (client)
        │
        ▼
POST /api/ai-fallback { type, query, profile }
        │
        ▼
MySQL ai_fallback_knowledge lookup by keyword + profile preference
        │
        ▼
JSON response → rendered in UI (guidance, meal plan, recipe, etc.)
        │
        ▼
If API fails (offline demo) → hardcoded client defaults in aiEngine.js
`);

heading('11. Feature Modules (18 modules)', 14);
const features = [
  ['Dashboard', 'Wellness score, hydration, nutrition tiles, charts, quick actions'],
  ['Profile', 'Name, age, height, weight, conditions, goals, auto BMI'],
  ['Symptom Checker', 'Natural-language symptoms → food guidance + diet plan'],
  ['Diet Plan', '7-day meal generator, save/load plans, shopping list'],
  ['Recipes', 'Generate, save, favorite, print, share recipes'],
  ['Food Scanner', 'Text/barcode/image-hint food analysis'],
  ['Food Checker', 'Safety, quantity, medication interactions'],
  ['Nutrition', 'Meal logging, calorie charts, weekly plans, PDF export'],
  ['Water Tracker', 'Daily hydration with quick-add (200–750 ml)'],
  ['Health Metrics', 'Weight, steps, sleep, vitals, personal goals'],
  ['Family', 'Multiple profiles, active switcher, per-member stats'],
  ['Achievements', 'Points, streaks, badges (client-computed)'],
  ['Doctor Reports', 'Report upload UI with sample parsing (demo)'],
  ['Corporate', 'Employee wellness dashboard (static demo)'],
  ['School', 'Tiffin planner and menu suggestions (static demo)'],
  ['Settings', 'Dark mode, notifications, reminders, PDF data export'],
  ['Language', '9 Indian languages + browser voice input'],
  ['Help & Privacy', 'FAQ and data-handling information']
];
features.forEach(([name, desc]) => bullet(`${name}: ${desc}`));

heading('12. User Journey Flow', 14);
monoBlock(`
Landing (/) → Features (/features) or Sign in (/login)
        │
        ├─ Try Demo → /app Dashboard (instant access)
        ├─ Sign up → /app/profile → complete profile → /app
        └─ Sign in → /app Dashboard
                │
                ├─ Log water / meals / metrics
                ├─ Run symptom or food checks
                ├─ Generate diet plans & recipes
                └─ Export PDF from Settings
`);

heading('13. Deployment Architecture', 14);
bullet('Build: npm run build → static files in dist/');
bullet('Server path: /opt/health-hub (API), /var/www/.../healthhub (static)');
bullet('Nginx: serves SPA at /healthhub/ and proxies /healthhub/api/ to Express');
bullet('Process manager: health-hub-api systemd service on port 4000');
bullet('SSL: Certbot Let\'s Encrypt for kundankrishna.tech');
bullet('Deploy script: deploy/remote_deploy.py (build + rsync + restart)');

heading('14. Security Measures', 14);
bullet('Passwords hashed with bcrypt (12 rounds).');
bullet('JWT tokens (7-day expiry) for authenticated API calls.');
bullet('Protected routes require valid Bearer token.');
bullet('Reset tokens expire after 1 hour; generic messages prevent email enumeration.');
bullet('Secrets in server.env — not committed to Git.');
bullet('HTTPS enforced in production via Certbot.');

heading('15. Demo Mode', 14);
bullet('Server demo: POST /api/auth/demo creates/uses demo@example.com with full API access.');
bullet('Offline demo: localStorage token demo-local-session with pre-seeded state.');
bullet('Offline demo skips API calls; AI uses inline hardcoded fallbacks.');

heading('16. Interface Languages Supported', 14);
body('English, Hindi, Tamil, Telugu, Bengali, Gujarati, Marathi, Punjabi, Kannada — selectable on Language page with Web Speech API voice input.');

heading('17. Known Limitations', 14);
bullet('Password reset generates a token but does not send email in production yet.');
bullet('Doctor/Corporate/School modules use demo/static data.');
bullet('AI responses come from MySQL fallback, not a live LLM.');
bullet('Language selection does not fully translate the entire UI.');

heading('18. How to Run Locally', 14);
bullet('npm install');
bullet('Copy .env.example and server/.env.example; set MySQL + JWT_SECRET.');
bullet('npm run dev:all — frontend http://localhost:5173, API http://localhost:4000');
bullet('npm run build — production static build');

heading('19. Presentation Talking Points', 14);
bullet('Explain the three-tier architecture: React → Express → MySQL.');
bullet('Show live demo: login → dashboard → symptom check → save diet plan.');
bullet('Highlight JWT auth and JSON state blob design for flexible health data.');
bullet('Describe fallback AI pattern for reliability without external API dependency.');
bullet('Mention deployment on DigitalOcean with path-based hosting (/healthhub).');

footer();
const pdfBytes = doc.output('arraybuffer');
writeFileSync(outPath, Buffer.from(pdfBytes));
console.log(`PDF written to: ${outPath}`);
