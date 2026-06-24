import React, { useState } from 'react';
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
  const [result, setResult] = useState(null);

  const handleScan = async () => {
    const res = await scanFoodFromText(`${text} ${barcode}`);
    setResult(res);
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
            <input type="file" accept="image/*" capture="environment" />
          </label>
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
          <PrimaryButton onClick={handleScan}>Scan</PrimaryButton>
        </div>
      </SectionCard>
      {result ? (
        <div className="grid-2">
          <SectionCard title="Detected meal">
            <Badge tone="primary">{result.item}</Badge>
            <p className="muted">Calories: {result.calories}</p>
            <p>{result.nutrition}</p>
          </SectionCard>
          <SectionCard title="Health fit">
            <p>{result.diseaseSafe}</p>
            <p>{result.healthier}</p>
          </SectionCard>
        </div>
      ) : null}
    </div>
  );
}
