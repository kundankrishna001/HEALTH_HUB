import React, { useState } from 'react';
import PageHeader from '../components/ui/PageHeader';
import SectionCard from '../components/ui/SectionCard';
import TextField from '../components/ui/TextField';
import TextareaField from '../components/ui/TextareaField';
import PrimaryButton from '../components/ui/PrimaryButton';
import Badge from '../components/ui/Badge';

export default function DoctorReports() {
  const [summary, setSummary] = useState('');
  const [analysis, setAnalysis] = useState(null);

  const parseReport = () => {
    setAnalysis({
      medicines: ['Metformin 500mg', 'Atorvastatin 10mg'],
      conditions: ['Prediabetes', 'High cholesterol'],
      labs: ['HbA1c 6.1%', 'LDL 144 mg/dL'],
      diet: 'Protein-first breakfast, lower refined carbs, more fiber.'
    });
  };

  return (
    <div className="page-grid">
      <PageHeader title="Doctor Module" subtitle="Upload reports, read PDFs, extract conditions, and prepare a shared diet summary." />
      <SectionCard title="Report upload">
        <div className="grid-2">
          <TextField label="PDF / report file" type="file" />
          <TextareaField label="Extracted notes" value={summary} onChange={(e) => setSummary(e.target.value)} />
        </div>
        <PrimaryButton style={{ marginTop: 14 }} onClick={parseReport}>Parse report</PrimaryButton>
      </SectionCard>
      {analysis ? (
        <div className="grid-2">
          <SectionCard title="Extraction">
            <Badge tone="primary">Medicines: {analysis.medicines.join(', ')}</Badge>
            <p>Conditions: {analysis.conditions.join(', ')}</p>
            <p>Labs: {analysis.labs.join(', ')}</p>
          </SectionCard>
          <SectionCard title="Diet guidance">
            <p>{analysis.diet}</p>
            <PrimaryButton>Export</PrimaryButton>
          </SectionCard>
        </div>
      ) : null}
    </div>
  );
}
