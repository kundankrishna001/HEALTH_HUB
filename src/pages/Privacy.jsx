import React from 'react';
import PageHeader from '../components/ui/PageHeader';
import SectionCard from '../components/ui/SectionCard';

export default function Privacy() {
  return (
    <div className="page-grid">
      <PageHeader title="Privacy" subtitle="A friendly summary of the data handling model." />
      <SectionCard title="Data handling">
        <p>
          Account data and app state are stored in MySQL through the backend API. Browser storage is only used for the login token and interface preferences.
        </p>
        <p>
          This setup keeps the application production-friendly while keeping the data model centralized and easy to extend.
        </p>
      </SectionCard>
    </div>
  );
}
