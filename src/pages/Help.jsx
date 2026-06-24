import React from 'react';
import PageHeader from '../components/ui/PageHeader';
import SectionCard from '../components/ui/SectionCard';

export default function Help() {
  return (
    <div className="page-grid">
      <PageHeader title="Help" subtitle="Quick answers and guidance for the workspace." />
      <SectionCard title="Common tasks">
        <ul>
          <li>Use the dashboard for daily overview.</li>
          <li>Update your profile first for accurate recommendations.</li>
          <li>Open Symptoms, Diet Plan, and Nutrition for the main health loops.</li>
          <li>Use Settings to switch dark mode and reminders.</li>
        </ul>
      </SectionCard>
    </div>
  );
}
