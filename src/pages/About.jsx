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
        <p style={{ margin: '0 0 12px 0' }}>Built using modern, scalable web technologies:</p>
        <div style={{ display: 'grid', gap: 12 }}>
          <div>
            <strong style={{ display: 'block', color: 'var(--primary)' }}>Frontend:</strong>
            <span className="muted">React 19, TypeScript, Tailwind CSS v4</span>
          </div>
          <div>
            <strong style={{ display: 'block', color: 'var(--primary)' }}>Backend & DB:</strong>
            <span className="muted">Supabase (PostgreSQL)</span>
          </div>
          <div>
            <strong style={{ display: 'block', color: 'var(--primary)' }}>AI Integration:</strong>
            <span className="muted">Google Gemini API</span>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Domain">
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          HealthTech & Wellness. The platform focuses on personal health management, specifically targeting individuals who need structured tracking for their nutrition, fitness, and overall well-being.
        </p>
      </SectionCard>

      <SectionCard title="Real-World Practical Use">
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          In the real world, people often struggle to find structured resources and track their health metrics effectively. Health Hub solves this by giving them personalized diet plans, conducting symptom checks using AI, generating healthy recipes, and curating daily health goals.
        </p>
      </SectionCard>

      <div className="grid-2" style={{ alignItems: 'start' }}>
        <SectionCard title="Contact Us">
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7 }} className="muted">
            For inquiries or partnerships, please reach out via our official communication channels.
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
