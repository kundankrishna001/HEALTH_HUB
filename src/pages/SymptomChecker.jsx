import React, { useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import { FiActivity } from 'react-icons/fi';
import TextareaField from '../components/ui/TextareaField';
import PrimaryButton from '../components/ui/PrimaryButton';
import Badge from '../components/ui/Badge';
import SectionCard from '../components/ui/SectionCard';
import DataTable from '../components/ui/DataTable';
import PageHeader from '../components/ui/PageHeader';
import { useApp } from '../context/AppContext';
import ShoppingListExport from '../components/ui/ShoppingListExport';

const fmtList = (arr, max = 4) => {
  const list = (arr || []).filter(Boolean);
  if (!list.length) return '—';
  const shown = list.slice(0, max).join(', ');
  return list.length > max ? `${shown} +${list.length - max}` : shown;
};

export default function SymptomChecker() {
  const { detectSymptoms, logSymptom, generateWeeklyPlan, saveDietPlan } = useApp();
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [dietPlan, setDietPlan] = useState([]);
  const [loading, setLoading] = useState(false);
  const [planLoading, setPlanLoading] = useState(false);

  const handleDetect = async () => {
    if (!input.trim()) {
      toast.error('Please describe your symptoms first');
      return;
    }
    setLoading(true);
    try {
      const next = await detectSymptoms(input);
      setResult(next);
      await logSymptom({ input, result: next });
      toast.success('Symptoms analyzed');
      setDietPlan([]);
    } catch (error) {
      toast.error(error?.message || 'Could not analyze symptoms');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateDiet = async () => {
    setPlanLoading(true);
    try {
      const plan = await generateWeeklyPlan(result?.condition || input);
      setDietPlan(Array.isArray(plan) ? plan : []);
      toast.success('Symptom-specific diet plan generated');
    } catch (error) {
      toast.error(error?.message || 'Could not generate diet plan');
    } finally {
      setPlanLoading(false);
    }
  };

  const handleSaveDiet = async () => {
    if (!dietPlan.length) return;
    await saveDietPlan({
      title: `${result?.condition || 'Symptom'} plan`,
      source: result?.condition || input,
      days: dietPlan
    });
    toast.success('Diet plan saved to your library');
  };

  const dietRows = useMemo(() => dietPlan.map((item, index) => ({ id: index, ...item })), [dietPlan]);

  const guidance = result
    ? [
        { label: 'Eat', value: fmtList(result.foods) },
        { label: 'Avoid', value: fmtList(result.avoid) },
        { label: 'Hydration', value: result.hydration || 'Stay well hydrated' },
        { label: 'Remedies', value: fmtList(result.remedies) },
        { label: 'Meal timing', value: result.mealTiming || 'Regular balanced meals' },
        { label: 'See a doctor', value: result.doctor || 'If symptoms worsen' }
      ]
    : [];

  return (
    <div className="page-grid">
      <PageHeader
        title="Symptom Checker"
        subtitle="Describe symptoms and get quick food guidance."
        actions={[<Badge key="hub" tone="primary">Medical</Badge>]}
      />

      {/* Feature box first, right at the top */}
      <SectionCard
        title="Describe symptoms"
        subtitle="Natural language works well — e.g. 'headache and fatigue since morning'"
        action={
          <PrimaryButton onClick={handleDetect} disabled={loading}>
            {loading ? 'Analyzing…' : 'Analyze'}
          </PrimaryButton>
        }
      >
        <TextareaField
          value={input}
          onChange={(e) => setInput(e.target.value)}
          label="Symptoms"
          placeholder="Type your symptoms here…"
        />
      </SectionCard>

      {result ? (
        <SectionCard
          title="Medical interpretation"
          action={
            <PrimaryButton variant="ghost" onClick={handleGenerateDiet} disabled={planLoading}>
              {planLoading ? 'Generating…' : 'Diet plan'}
            </PrimaryButton>
          }
        >
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
            <Badge tone="primary">{result.condition || 'General guidance'}</Badge>
            <Badge tone={result.severity === 'Medium' ? 'warning' : 'success'}>Severity: {result.severity || 'Low'}</Badge>
            <Badge tone="success">Duration: {result.duration || '—'}</Badge>
            <Badge tone="primary">BMI: {result.bmiStatus || '—'}</Badge>
          </div>

          <div className="grid-3">
            {guidance.map((item) => (
              <div key={item.label} className="info-cell">
                <span className="info-cell-label">{item.label}</span>
                <span className="info-cell-value">{item.value}</span>
              </div>
            ))}
          </div>
        </SectionCard>
      ) : (
        <div className="card card-pad" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <FiActivity style={{ color: 'var(--primary)', flexShrink: 0 }} />
          <p className="muted" style={{ margin: 0 }}>Run an analysis to see concise medical guidance and safety signals.</p>
        </div>
      )}

      {dietPlan.length > 0 && (
        <SectionCard
          title="Recommended diet plan"
          subtitle={`For: ${result?.condition || 'your symptoms'}`}
          action={<PrimaryButton variant="ghost" onClick={handleSaveDiet}>Save plan</PrimaryButton>}
        >
          <DataTable
            searchable
            placeholder="Search meals..."
            columns={[
              { key: 'day', label: 'Day' },
              { key: 'breakfast', label: 'Breakfast' },
              { key: 'lunch', label: 'Lunch' },
              { key: 'dinner', label: 'Dinner' },
              { key: 'calories', label: 'Calories' }
            ]}
            rows={dietRows}
          />
          <div style={{ marginTop: 16 }}>
            <ShoppingListExport
              planDays={dietPlan}
              planTitle={`${result?.condition || 'Symptom'} shopping list`}
            />
          </div>
        </SectionCard>
      )}
    </div>
  );
}

