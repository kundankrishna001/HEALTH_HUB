import React from 'react';
import PageHeader from '../components/ui/PageHeader';
import SectionCard from '../components/ui/SectionCard';
import PrimaryButton from '../components/ui/PrimaryButton';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import dayjs from 'dayjs';

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { state, setSettings, exportPdf } = useApp();

  const handleExportData = () => {
    const lines = [
      'Health Data Export',
      `Generated on: ${dayjs().format('YYYY-MM-DD HH:mm:ss')}`,
      '',
      '--- Profile ---',
      `Name: ${state?.user?.name || 'N/A'}`,
      `Email: ${state?.user?.email || 'N/A'}`,
      `BMI: ${state?.user?.bmi || 'N/A'}`,
      '',
      '--- Recent Meals ---'
    ];

    if (state?.meals?.length) {
      state.meals.slice(0, 10).forEach(m => {
        lines.push(`- ${m.name || m.breakfast || m.lunch || m.dinner} (${m.calories} cal) on ${dayjs(m.createdAt).format('MMM D')}`);
      });
    } else {
      lines.push('No meals logged.');
    }

    lines.push('');
    lines.push('--- Recent Symptoms ---');
    if (state?.symptoms?.length) {
      state.symptoms.slice(0, 10).forEach(s => {
        lines.push(`- ${s.result?.condition || 'Unknown'} (Severity: ${s.result?.severity || 'Low'}) on ${dayjs(s.createdAt).format('MMM D')}`);
        lines.push(`  Notes: ${s.input}`);
      });
    } else {
      lines.push('No symptoms logged.');
    }

    exportPdf('My_Health_Data_Export', lines);
  };

  return (
    <div className="page-grid">
      <PageHeader title="Settings" subtitle="Dark mode, notifications, reminders, and daily goals." />
      
      <div className="grid-2" style={{ alignItems: 'start' }}>
        <SectionCard title="Preferences">
          <div style={{ display: 'grid', gap: 12 }}>
            <label><input type="checkbox" checked={theme === 'dark'} onChange={toggleTheme} /> Dark mode</label>
            <label><input type="checkbox" checked={state?.settings?.notifications ?? true} onChange={(e) => setSettings({ notifications: e.target.checked })} /> Notifications</label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 'bold' }}>Office reminder</span>
              <input
                type="time"
                value={state?.settings?.officeReminder ?? '13:00'}
                onChange={(e) => setSettings({ officeReminder: e.target.value })}
                style={{ width: '100%' }}
              />
            </label>
            <PrimaryButton style={{ marginTop: 12 }} onClick={() => setSettings({ dailyWaterGoal: 3000 })}>Set water goal to 3L</PrimaryButton>
          </div>
        </SectionCard>

        <SectionCard title="Data & Privacy" subtitle="Manage your health data">
          <div style={{ display: 'grid', gap: 12 }}>
            <p className="muted" style={{ margin: 0, fontSize: 14 }}>
              Download a complete summary of your profile, logged meals, and tracked symptoms to share with your doctor.
            </p>
            <PrimaryButton onClick={handleExportData}>
              Export Data (PDF)
            </PrimaryButton>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
