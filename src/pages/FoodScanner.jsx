import React, { useState } from 'react';
import { toast } from 'react-toastify';
import PageHeader from '../components/ui/PageHeader';
import SectionCard from '../components/ui/SectionCard';
import TextField from '../components/ui/TextField';
import PrimaryButton from '../components/ui/PrimaryButton';
import Badge from '../components/ui/Badge';
import { useApp } from '../context/AppContext';

export default function FoodScanner() {
  const { scanFoodFromText } = useApp();
  const [text, setText] = useState('');
  const [barcode, setBarcode] = useState('');
  const [imageHint, setImageHint] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      setImageHint('');
      return;
    }
    setImageHint(file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '));
  };

  const handleScan = async () => {
    const query = [text.trim(), barcode.trim(), imageHint.trim()].filter(Boolean).join(' ');
    if (!query) {
      toast.error('Describe the meal, enter a barcode, or upload an image');
      return;
    }

    setLoading(true);
    try {
      const res = await scanFoodFromText(query);
      setResult(res);
      if (!res) toast.error('No scan result returned');
      else toast.success('Food scanned');
    } catch (error) {
      toast.error(error?.message || 'Could not scan food');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-grid">
      <PageHeader title="Food Scanner" subtitle="Capture image, barcode, or text and infer meal nutrition quickly." />
      <SectionCard title="Scanner input" subtitle="Use camera, file upload, or typed input">
        <div className="grid-2">
          <TextField label="Describe the meal" value={text} onChange={(e) => setText(e.target.value)} />
          <TextField label="Barcode" value={barcode} onChange={(e) => setBarcode(e.target.value)} />
          <label style={{ display: 'grid', gap: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 600 }}>Upload image</span>
            <input type="file" accept="image/*" capture="environment" onChange={handleImageChange} />
            {imageHint ? <span className="muted" style={{ fontSize: 13 }}>Using image hint: {imageHint}</span> : null}
          </label>
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
          <PrimaryButton onClick={handleScan} disabled={loading}>{loading ? 'Scanning…' : 'Scan'}</PrimaryButton>
        </div>
      </SectionCard>
      {result ? (
        <div className="grid-2">
          <SectionCard title="Detected meal">
            <Badge tone="primary">{result.item}</Badge>
            <p className="muted">Calories: {result.calories ?? '—'}</p>
            <p>{result.nutrition || 'No nutrition details available.'}</p>
          </SectionCard>
          <SectionCard title="Health fit">
            <p>{result.diseaseSafe || 'No disease-safety notes.'}</p>
            <p>{result.healthier || 'No healthier alternatives listed.'}</p>
          </SectionCard>
        </div>
      ) : null}
    </div>
  );
}
