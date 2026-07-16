import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [prompt, setPrompt] = useState('');
  const [badResponse, setBadResponse] = useState('');
  const [diagnosis, setDiagnosis] = useState(null);
  const [rewrite, setRewrite] = useState(null);
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState('');

  const analyze = async () => {
    setLoading('analyzing');
    setDiagnosis(null);
    setRewrite(null);
    setComparison(null);
    try {
      const res = await axios.post('http://localhost:8000/analyze', {
        prompt,
        bad_response: badResponse
      });
      setDiagnosis(res.data);
    } catch (err) {
      alert('Error analyzing prompt. Is your backend running?');
    }
    setLoading('');
  };

  const rewritePrompt = async () => {
    setLoading('rewriting');
    try {
      const res = await axios.post('http://localhost:8000/rewrite', {
        prompt,
        diagnosis
      });
      setRewrite(res.data);
    } catch (err) {
      alert('Error rewriting prompt.');
    }
    setLoading('');
  };

  const compare = async () => {
    setLoading('comparing');
    try {
      const res = await axios.post('http://localhost:8000/compare', {
        original_prompt: prompt,
        rewritten_prompt: rewrite.rewritten_prompt
      });
      setComparison(res.data);
    } catch (err) {
      alert('Error comparing prompts.');
    }
    setLoading('');
  };

  const getScoreColor = (score) => {
    if (score >= 8) return '#22c55e';
    if (score >= 5) return '#f59e0b';
    return '#ef4444';
  };

  const getGradeColor = (grade) => {
    if (grade === 'A') return '#22c55e';
    if (grade === 'B') return '#84cc16';
    if (grade === 'C') return '#f59e0b';
    if (grade === 'D') return '#f97316';
    return '#ef4444';
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px', fontFamily: 'sans-serif' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', margin: '0 0 8px' }}>
          Prompt Intelligence Platform
        </h1>
        <p style={{ color: '#6b7280', margin: 0 }}>
          Diagnose, rewrite, and compare your Claude prompts
        </p>
      </div>

      {/* Input Section */}
      <div style={{ background: '#f9fafb', borderRadius: '12px', padding: '24px', marginBottom: '24px', border: '1px solid #e5e7eb' }}>
        <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>
          Your Prompt
        </label>
        <textarea
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="Paste your prompt here..."
          style={{ width: '100%', height: '120px', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px', resize: 'vertical', boxSizing: 'border-box' }}
        />

        <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', marginTop: '16px' }}>
          Bad Response Received (optional)
        </label>
        <textarea
          value={badResponse}
          onChange={e => setBadResponse(e.target.value)}
          placeholder="Paste the bad response Claude gave you (optional)..."
          style={{ width: '100%', height: '80px', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px', resize: 'vertical', boxSizing: 'border-box' }}
        />

        <button
          onClick={analyze}
          disabled={!prompt || loading === 'analyzing'}
          style={{ marginTop: '16px', padding: '12px 28px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}
        >
          {loading === 'analyzing' ? 'Analyzing...' : 'Analyze Prompt'}
        </button>
      </div>

      {/* Diagnosis Section */}
      {diagnosis && (
        <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', marginBottom: '24px', border: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', margin: 0 }}>Diagnosis</h2>
            <span style={{ fontSize: '32px', fontWeight: '800', color: getGradeColor(diagnosis.overall_grade) }}>
              {diagnosis.overall_grade}
            </span>
          </div>

          <p style={{ color: '#6b7280', marginBottom: '20px' }}>{diagnosis.summary}</p>

          {['clarity', 'context', 'examples', 'format', 'role', 'constraints'].map(dim => (
            <div key={dim} style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontWeight: '600', textTransform: 'capitalize' }}>{dim}</span>
                <span style={{ fontWeight: '700', color: getScoreColor(diagnosis[dim].score) }}>
                  {diagnosis[dim].score}/10
                </span>
              </div>
              <div style={{ background: '#f3f4f6', borderRadius: '4px', height: '8px', marginBottom: '4px' }}>
                <div style={{ width: `${diagnosis[dim].score * 10}%`, background: getScoreColor(diagnosis[dim].score), height: '8px', borderRadius: '4px', transition: 'width 0.5s' }}/>
              </div>
              <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>{diagnosis[dim].issue}</p>
            </div>
          ))}

          <button
            onClick={rewritePrompt}
            disabled={loading === 'rewriting'}
            style={{ marginTop: '20px', padding: '12px 28px', background: '#059669', color: 'white', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}
          >
            {loading === 'rewriting' ? 'Rewriting...' : 'Rewrite Prompt'}
          </button>
        </div>
      )}

      {/* Rewrite Section */}
      {rewrite && (
        <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', marginBottom: '24px', border: '1px solid #e5e7eb' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px' }}>Improved Prompt</h2>
          
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '16px', marginBottom: '20px' }}>
            <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.6' }}>{rewrite.rewritten_prompt}</p>
          </div>

          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>Changes Made</h3>
          <ul style={{ paddingLeft: '20px', margin: 0 }}>
            {rewrite.changes.map((change, i) => (
              <li key={i} style={{ fontSize: '14px', color: '#374151', marginBottom: '8px' }}>{change}</li>
            ))}
          </ul>

          <button
            onClick={compare}
            disabled={loading === 'comparing'}
            style={{ marginTop: '20px', padding: '12px 28px', background: '#7c3aed', color: 'white', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}
          >
            {loading === 'comparing' ? 'Comparing...' : 'Compare Live Responses'}
          </button>
        </div>
      )}

      {/* Comparison Section */}
      {comparison && (
        <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', border: '1px solid #e5e7eb' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px' }}>Side by Side Comparison</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#ef4444', marginBottom: '8px' }}>Original Prompt Response</h3>
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '16px', fontSize: '14px', lineHeight: '1.6' }}>
                {comparison.original_response}
              </div>
            </div>
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#059669', marginBottom: '8px' }}>Improved Prompt Response</h3>
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '16px', fontSize: '14px', lineHeight: '1.6' }}>
                {comparison.rewritten_response}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;