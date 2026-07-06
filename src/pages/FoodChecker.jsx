import React, { useState } from 'react';
import { toast } from 'react-toastify';
import TextField from '../components/ui/TextField';
import PrimaryButton from '../components/ui/PrimaryButton';
import Badge from '../components/ui/Badge';
import SectionCard from '../components/ui/SectionCard';
import { useApp } from '../context/AppContext';
import FeatureHubShell from '../layouts/FeatureHubShell';

const asList = (value) => (Array.isArray(value) ? value : []);

export default function FoodChecker() {
  const { checkFood } = useApp();
  const [food, setFood] = useState('');
  const [meds, setMeds] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    if (!food.trim()) {
      toast.error('Enter a food item to check');
      return;
    }

    const medsList = meds
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    setLoading(true);
    try {
      const res = await checkFood(food.trim(), medsList);
      setResult(res);
      if (!res) toast.error('No safety data returned');
    } catch (error) {
      toast.error(error?.message || 'Could not check food');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FeatureHubShell
      mode="food"
      title="Food Checker"
      subtitle="Food safety, quantities, medication interactions, and alternatives."
    >
      <div className="grid-2" style={{ alignItems: 'start' }}>
        <SectionCard title="Check a food item" subtitle="Fast safety verdict">
          <div className="grid-2">
            <TextField label="Food" value={food} onChange={(e) => setFood(e.target.value)} />
            <TextField
              label="Medicines (comma separated)"
              value={meds}
              onChange={(e) => setMeds(e.target.value)}
              placeholder="metformin, statin"
            />
          </div>
          <PrimaryButton
            style={{ marginTop: 14 }}
            onClick={handleCheck}
            disabled={loading}
          >
            {loading ? 'Checking…' : 'Check food'}
          </PrimaryButton>
        </SectionCard>

        {result ? (
          <SectionCard title="Verdict & recommendations">
            <div style={{ display: 'grid', gap: 10 }}>
              <Badge tone={result.safe ? 'success' : 'danger'}>{result.safe ? 'Safe' : 'Use caution'}</Badge>
              <p className="muted">Suggested quantity: {result.quantity || '—'}</p>
              <p>{result.explanation || 'No explanation available.'}</p>
            </div>

            <div style={{ marginTop: 16 }}>
              <div className="divider">Alternatives and benefits</div>
              <p style={{ marginTop: 10 }}>{result.interactions || 'No interaction notes.'}</p>
              <p>Alternatives: {asList(result.alternatives).join(', ') || '—'}</p>
              <p>Benefits: {asList(result.benefits).join(', ') || '—'}</p>
            </div>
          </SectionCard>
        ) : (
          <div className="card card-pad">
            <p className="muted">Enter a food and medicines to get a safety verdict.</p>
          </div>
        )}
      </div>
    </FeatureHubShell>
  );
}
