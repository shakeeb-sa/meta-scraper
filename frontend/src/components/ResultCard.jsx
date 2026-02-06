import React from 'react';
import { ExternalLink, Copy, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';

const ResultCard = ({ item }) => {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  // Determine color based on SEO Score
  const getScoreColor = (score) => {
    if (score >= 80) return '#2ec96c'; // Green
    if (score >= 50) return '#f59e0b'; // Orange
    return '#e04f5e'; // Red
  };

  if (item.status === 'error') {
    return (
      <div className="result-card error" style={{ borderLeft: '4px solid #e04f5e', background: 'white', padding: '20px', borderRadius: '12px', marginBottom: '15px', display: 'flex', gap: '15px', alignItems: 'center' }}>
        <AlertCircle color="#e04f5e" />
        <div>
          <span style={{ fontSize: '0.8rem', color: '#e04f5e', fontWeight: 'bold' }}>FAILED</span>
          <p style={{ fontSize: '0.9rem', color: '#7e828e' }}>{item.url}</p>
          <p style={{ fontSize: '0.85rem', color: '#292d34' }}>Reason: {item.reason}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card" style={{ padding: '0', overflow: 'hidden', marginBottom: '20px', border: '1px solid #e6e9ee' }}>
      <div style={{ display: 'flex', flexDirection: window.innerWidth < 600 ? 'column' : 'row' }}>
        
        {/* 1. Visual Preview (OG Image) */}
        <div style={{ width: window.innerWidth < 600 ? '100%' : '240px', background: '#f8f9fb', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid #e6e9ee' }}>
          {item.ogImage ? (
            <img src={item.ogImage} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ padding: '20px', textAlign: 'center', color: '#bdc3c7' }}>
              <Globe size={40} />
              <p style={{ fontSize: '0.7rem', marginTop: '10px' }}>No Preview Image</p>
            </div>
          )}
          
          {/* SEO Score Badge */}
          <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(255,255,255,0.9)', padding: '4px 8px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '5px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
            <ShieldCheck size={14} color={getScoreColor(item.seoScore)} />
            <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#292d34' }}>{item.seoScore}%</span>
          </div>
        </div>

        {/* 2. Content Section */}
        <div style={{ flex: 1, padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
            <a href={item.url} target="_blank" rel="noreferrer" style={{ fontSize: '0.75rem', color: '#7b68ee', fontWeight: '700', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
              {new URL(item.url).hostname} <ExternalLink size={12} />
            </a>
          </div>

          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '8px', color: '#292d34' }}>{item.title}</h3>
          <p style={{ fontSize: '0.9rem', color: '#7e828e', lineHeight: '1.5', marginBottom: '15px' }}>{item.description}</p>

          <div style={{ display: 'flex', gap: '10px' }}>
             <button onClick={() => copyToClipboard(item.title)} style={{ padding: '6px 12px', fontSize: '0.7rem', borderRadius: '6px', background: '#f0ebff', color: '#7b68ee', border: 'none', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
               <Copy size={12} /> Copy Title
             </button>
             <button onClick={() => copyToClipboard(item.description)} style={{ padding: '6px 12px', fontSize: '0.7rem', borderRadius: '6px', background: '#f0ebff', color: '#7b68ee', border: 'none', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
               <Copy size={12} /> Copy Desc
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;