import React, { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
import { toast } from 'react-toastify';
import PageHeader from '../components/ui/PageHeader';
import SectionCard from '../components/ui/SectionCard';
import DataTable from '../components/ui/DataTable';
import TextField from '../components/ui/TextField';
import PrimaryButton from '../components/ui/PrimaryButton';
import Badge from '../components/ui/Badge';
import ProgressRing from '../components/ui/ProgressRing';
import { useApp } from '../context/AppContext';
import { getActiveProfileLabel } from '../utils/profileScope';
import { getGoalProgress, getGoals, getProfileMetrics } from '../utils/goals';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend);

const metricTypes = [
  { key: 'weight', label: 'Weight (kg)' },
  { key: 'steps', label: 'Steps' },
  { key: 'sleep', label: 'Sleep (hours)' },
  { key: 'sugar', label: 'Blood sugar' },
  { key: 'bp', label: 'Blood pressure' },
  { key: 'cholesterol', label: 'Cholesterol' }
];

export default function HealthMetrics() {
  const { state, addMetric, setGoals } = useApp();
  const [form, setForm] = useState({ type: 'weight', value: '' });
  const goals = getGoals(state);
  const progress = getGoalProgress(state);
  const profileMetrics = getProfileMetrics(state);

  const chartData = useMemo(() => {
    const latest = metricTypes.map(({ key }) => {
      const entry = profileMetrics.find((item) => item.type === key);
      return Number(entry?.value) || 0;
    });

    return {
      labels: metricTypes.map((item) => item.label),
      datasets: [{
        label: 'Latest values',
        data: latest,
        backgroundColor: ['#2563eb', '#0f766e', '#14b8a6', '#d97706', '#7c3aed', '#db2777']
      }]
    };
  }, [profileMetrics]);

  const trendData = useMemo(() => {
    const weightEntries = profileMetrics
      .filter((item) => item.type === 'weight')
      .slice(0, 7)
      .reverse();

    return {
      labels: weightEntries.map((item) => dayjs(item.createdAt).format('MMM D')),
      datasets: [{
        label: 'Weight trend',
        data: weightEntries.map((item) => Number(item.value)),
        borderColor: 'var(--primary)',
        tension: 0.35
      }]
    };
  }, [profileMetrics]);

  const rows = useMemo(
    () => profileMetrics.slice(0, 12).map((item) => ({
      id: item.id,
      metric: metricTypes.find((type) => type.key === item.type)?.label || item.type,
      value: item.value,
      time: dayjs(item.createdAt).format('MMM D, h:mm A')
    })),
    [profileMetrics]
  );

  const handleLog = async () => {
    const value = Number(form.value);
    if (!Number.isFinite(value) || value <= 0) {
      toast.error('Enter a valid value');
      return;
    }
    await addMetric({ type: form.type, value, unit: form.type === 'sleep' ? 'hr' : form.type === 'steps' ? 'steps' : 'unit' });
    setForm({ ...form, value: '' });
    toast.success('Metric logged');
  };

  return (
    <div className="page-grid">
      <PageHeader
        title="Health Metrics"
        subtitle="Track weight, steps, sleep, and vitals with goals for the active profile."
        actions={[<Badge key="profile" tone="primary">{getActiveProfileLabel(state)}</Badge>]}
      />

      <SectionCard title="Daily goals" subtitle="Set targets and track progress alongside nutrition">
        <div className="grid-3">
          <div className="card card-pad" style={{ display: 'grid', gap: 10, justifyItems: 'center' }}>
            <ProgressRing value={progress.weight.progress} label={`${progress.weight.current ?? '--'} / ${progress.weight.target} kg`} size={110} />
            <strong>Weight goal</strong>
            <TextField
              label="Target (kg)"
              type="number"
              value={goals.weightTarget}
              onChange={(e) => setGoals({ weightTarget: Number(e.target.value) })}
            />
          </div>
          <div className="card card-pad" style={{ display: 'grid', gap: 10, justifyItems: 'center' }}>
            <ProgressRing value={progress.steps.progress} label={`${progress.steps.current} / ${progress.steps.target}`} size={110} />
            <strong>Steps goal</strong>
            <TextField
              label="Target steps"
              type="number"
              value={goals.stepsTarget}
              onChange={(e) => setGoals({ stepsTarget: Number(e.target.value) })}
            />
          </div>
          <div className="card card-pad" style={{ display: 'grid', gap: 10, justifyItems: 'center' }}>
            <ProgressRing value={progress.sleep.progress} label={`${progress.sleep.current} / ${progress.sleep.target} hr`} size={110} />
            <strong>Sleep goal</strong>
            <TextField
              label="Target hours"
              type="number"
              value={goals.sleepTarget}
              onChange={(e) => setGoals({ sleepTarget: Number(e.target.value) })}
            />
          </div>
        </div>
      </SectionCard>

      <div className="grid-2">
        <SectionCard title="Log a metric">
          <div className="grid-2">
            <label style={{ display: 'grid', gap: 6 }}>
              <span style={{ fontWeight: 700, fontSize: 14 }}>Metric type</span>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                {metricTypes.map((item) => (
                  <option key={item.key} value={item.key}>{item.label}</option>
                ))}
              </select>
            </label>
            <TextField label="Value" type="number" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} />
          </div>
          <PrimaryButton style={{ marginTop: 14 }} onClick={handleLog}>Save metric</PrimaryButton>
        </SectionCard>

        <SectionCard title="Latest snapshot">
          <Bar data={chartData} options={{ maintainAspectRatio: true }} />
        </SectionCard>
      </div>

      <div className="grid-2">
        <SectionCard title="Weight trend">
          {trendData.labels.length ? <Line data={trendData} /> : <p className="muted">Log weight entries to see your trend.</p>}
        </SectionCard>
        <SectionCard title="Metric log">
          <DataTable
            columns={[
              { key: 'metric', label: 'Metric' },
              { key: 'value', label: 'Value' },
              { key: 'time', label: 'Time' }
            ]}
            rows={rows}
          />
        </SectionCard>
      </div>
    </div>
  );
}
