import React from 'react';
import PageHeader from '../components/ui/PageHeader';
import SectionCard from '../components/ui/SectionCard';
import StatCard from '../components/ui/StatCard';
import DataTable from '../components/ui/DataTable';
import { FiUsers, FiCoffee, FiTrendingUp, FiShield } from 'react-icons/fi';

export default function Corporate() {
  return (
    <div className="page-grid">
      <PageHeader title="Corporate" subtitle="Employee dashboard, HR dashboard, cafeteria analytics, and wellness insights." />
      <div className="grid-4">
        <StatCard label="Employees" value="248" icon={FiUsers} />
        <StatCard label="Wellness adoption" value="73%" icon={FiTrendingUp} />
        <StatCard label="Cafeteria hits" value="1,820" icon={FiCoffee} />
        <StatCard label="Risk flags" value="12" icon={FiShield} />
      </div>
      <SectionCard title="Employee analytics">
        <DataTable
          searchable
          columns={[
            { key: 'name', label: 'Employee' },
            { key: 'dept', label: 'Department' },
            { key: 'score', label: 'Wellness score' },
            { key: 'meal', label: 'Suggested meal' }
          ]}
          rows={[
            { id: 1, name: 'Priya', dept: 'Engineering', score: 88, meal: 'Grilled paneer bowl' },
            { id: 2, name: 'Rohan', dept: 'Sales', score: 72, meal: 'Idli + sambar' },
            { id: 3, name: 'Nisha', dept: 'HR', score: 94, meal: 'Quinoa salad' }
          ]}
        />
      </SectionCard>
    </div>
  );
}
