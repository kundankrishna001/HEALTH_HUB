import React, { useState } from 'react';
import PageHeader from '../components/ui/PageHeader';
import SectionCard from '../components/ui/SectionCard';
import PrimaryButton from '../components/ui/PrimaryButton';
import Badge from '../components/ui/Badge';

const languages = ['English', 'Hindi', 'Tamil', 'Telugu', 'Bengali', 'Gujarati', 'Marathi', 'Punjabi', 'Kannada'];

export default function Language() {
  const [selected, setSelected] = useState('English');
  const [voice, setVoice] = useState('');
  const [listening, setListening] = useState(false);

  const startVoiceInput = () => {
    try {
      const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!Recognition) {
        setVoice((current) => `${current} Voice input is not supported in this browser.`);
        return;
      }
      const recognition = new Recognition();
      recognition.lang = selected === 'Hindi' ? 'hi-IN' : 'en-IN';
      recognition.interimResults = false;
      recognition.onstart = () => setListening(true);
      recognition.onend = () => setListening(false);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setVoice((current) => `${current} ${transcript}`.trim());
      };
      recognition.onerror = () => setListening(false);
      recognition.start();
    } catch {
      setListening(false);
      setVoice((current) => `${current} Voice input could not be started.`.trim());
    }
  };

  return (
    <div className="page-grid">
      <PageHeader title="Language" subtitle="Choose the interface language and capture voice input." />
      <SectionCard title="Select language">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {languages.map((language) => (
            <button
              key={language}
              type="button"
              onClick={() => setSelected(language)}
              style={{ borderRadius: 999, border: '1px solid var(--border)', background: selected === language ? 'var(--primary)' : 'transparent', color: selected === language ? '#fff' : 'var(--text)', padding: '10px 14px' }}
            >
              {language}
            </button>
          ))}
        </div>
      </SectionCard>
      <SectionCard title="Voice input">
        <Badge tone="primary">Current language: {selected}</Badge>
        <textarea value={voice} onChange={(e) => setVoice(e.target.value)} placeholder="Speak or type meal symptoms here" style={{ width: '100%', minHeight: 120, marginTop: 12, borderRadius: 14, border: '1px solid var(--border)', padding: 12, background: 'var(--surface-strong)', color: 'var(--text)' }} />
        <PrimaryButton style={{ marginTop: 12 }} onClick={startVoiceInput}>
          {listening ? 'Listening...' : 'Start voice input'}
        </PrimaryButton>
      </SectionCard>
    </div>
  );
}
