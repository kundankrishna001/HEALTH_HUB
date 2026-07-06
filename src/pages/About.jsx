import React from 'react';
import PageHeader from '../components/ui/PageHeader';
import SectionCard from '../components/ui/SectionCard';

export default function About() {
  return (
    <div className="page-grid" style={{ maxWidth: 900, margin: '0 auto' }}>
      <PageHeader 
        title="About the Project" 
        subtitle="Empowering individuals to take control of their health" 
      />
      
      <SectionCard title="Usage & Purpose">
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Health Hub is a centralized health and wellness platform designed to help users track and improve their daily lifestyle. It bridges the gap between complex medical data and everyday habits by providing a single platform for symptom checking, diet planning, water tracking, and AI-driven health guidance.
        </p>
      </SectionCard>

      <SectionCard title="Tech Stack & Languages">
        <p style={{ margin: '0 0 12px 0' }}>Built with a full-stack JavaScript architecture:</p>
        <div style={{ display: 'grid', gap: 12 }}>
          <div>
            <strong style={{ display: 'block', color: 'var(--primary)' }}>Frontend:</strong>
            <span className="muted">React 18, JavaScript (JSX), Vite, React Router, Chart.js, CSS</span>
          </div>
          <div>
            <strong style={{ display: 'block', color: 'var(--primary)' }}>Backend &amp; database:</strong>
            <span className="muted">Node.js, Express, MySQL, JWT authentication, bcrypt</span>
          </div>
          <div>
            <strong style={{ display: 'block', color: 'var(--primary)' }}>Health guidance:</strong>
            <span className="muted">Rule-based AI engine with MySQL fallback knowledge base (symptoms, recipes, food checks, diet plans)</span>
          </div>
          <div>
            <strong style={{ display: 'block', color: 'var(--primary)' }}>Deployment:</strong>
            <span className="muted">DigitalOcean, Nginx, PM2, Certbot (HTTPS) — live at kundankrishna.tech/healthhub</span>
          </div>
          <div>
            <strong style={{ display: 'block', color: 'var(--primary)' }}>Interface languages:</strong>
            <span className="muted">English, Hindi, Tamil, Telugu, Bengali, Gujarati, Marathi, Punjabi, Kannada</span>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Key Features">
        <p style={{ margin: '0 0 12px 0', lineHeight: 1.7 }} className="muted">
          Health Hub brings everyday wellness tools into one dashboard:
        </p>
        <div style={{ display: 'grid', gap: 8 }}>
          {[
            'Symptom checker with diet plan generation',
            'Food scanner and food safety checker',
            'Water tracker, nutrition logging, and health metrics',
            'Weekly diet plans, recipes, and family profiles',
            'Achievements, settings, and PDF data export'
          ].map((item) => (
            <div key={item} style={{ fontSize: 14, lineHeight: 1.6 }}>• {item}</div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Domain">
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          HealthTech & Wellness. The platform focuses on personal health management, specifically targeting individuals who need structured tracking for their nutrition, fitness, and overall well-being.
        </p>
      </SectionCard>

      <SectionCard title="Real-World Practical Use">
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          In the real world, people often struggle to find structured resources and track their health metrics effectively. Health Hub solves this by giving them personalized diet plans, symptom checks, healthy recipes, water and meal tracking, and daily health goals — all in one place.
        </p>
      </SectionCard>

      <div className="grid-2" style={{ alignItems: 'start' }}>
        <SectionCard title="Contact &amp; Live App">
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7 }} className="muted">
            For inquiries or partnerships, reach out via GitHub or LinkedIn. The live app is hosted at{' '}
            <a href="https://kundankrishna.tech/healthhub/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }}>
              kundankrishna.tech/healthhub
            </a>.
          </p>
        </SectionCard>

        <SectionCard title="GitHub Repository">
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7 }} className="muted">
            Source code and updates are available on GitHub.
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 12 }}>
            <a href="https://github.com/kundankrishna001/HEALTHCHECK26" target="_blank" rel="noopener noreferrer" className="tag">GitHub</a>
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Meet the Developer" subtitle="Built with passion for HealthTech and accessible design">
        <div style={{ display: 'grid', gap: 10 }}>
          <div style={{ fontSize: 18, fontWeight: 900 }}>Kundan Krishna</div>
          <div className="muted" style={{ fontWeight: 800 }}>Computer Science &amp; Engineering Student</div>

          <p className="muted" style={{ margin: 0, lineHeight: 1.8 }}>
            Kundan Krishna is a Computer Science &amp; Engineering student passionate about software development, artificial intelligence, full-stack web development, and building impactful technology solutions. Health Hub was developed as a modern HealthTech platform that combines daily habit tracking with AI-driven health guidance to create a smarter path to a healthier lifestyle.
          </p>

          <div className="grid-2" style={{ gap: 12, marginTop: 8 }}>
            <div className="card card-pad" style={{ background: 'color-mix(in srgb, var(--surface-strong) 86%, transparent)' }}>
              <div className="muted" style={{ fontSize: 12, fontWeight: 900, letterSpacing: '0.14em' }}>UNIVERSITY</div>
              <div style={{ fontWeight: 900, marginTop: 6 }}>Sathyabama Institute of Science and Technology, Chennai</div>
            </div>
            <div className="card card-pad" style={{ background: 'color-mix(in srgb, var(--surface-strong) 86%, transparent)' }}>
              <div className="muted" style={{ fontSize: 12, fontWeight: 900, letterSpacing: '0.14em' }}>FOCUS</div>
              <div style={{ fontWeight: 900, marginTop: 6 }}>AI • Full-stack • HealthTech</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 10 }}>
            <a href="https://github.com/kundankrishna001" target="_blank" rel="noopener noreferrer" className="tag">GitHub</a>
            <a href="https://www.linkedin.com/in/kundan-krishna-1810b811a" target="_blank" rel="noopener noreferrer" className="tag">LinkedIn</a>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
