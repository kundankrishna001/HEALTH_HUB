import React from 'react';
import PageHeader from '../components/ui/PageHeader';
import SectionCard from '../components/ui/SectionCard';
import Badge from '../components/ui/Badge';
import DataTable from '../components/ui/DataTable';

export default function School() {
  return (
    <div className="page-grid">
      <PageHeader title="School" subtitle="Tiffin planner, parent dashboard, and healthy menu suggestions." />
      <div className="grid-2">
        <SectionCard title="Tiffin planner">
          <div style={{ display: 'grid', gap: 10 }}>
            <Badge tone="primary">Mon: Veg wrap + fruit</Badge>
            <Badge tone="success">Tue: Lemon rice + sprouts</Badge>
            <Badge tone="warning">Wed: Paneer sandwich + nuts</Badge>
          </div>
        </SectionCard>
        <SectionCard title="Healthy menu">
          <DataTable
            columns={[
              { key: 'meal', label: 'Meal' },
              { key: 'benefit', label: 'Benefit' }
            ]}
            rows={[
              { id: 1, meal: 'Vegetable upma', benefit: 'Quick energy' },
              { id: 2, meal: 'Mini dosa + sambar', benefit: 'Balanced protein' },
              { id: 3, meal: 'Fruit cup', benefit: 'Vitamin boost' }
            ]}
          />
        </SectionCard>
      </div>
    </div>
  );
}
