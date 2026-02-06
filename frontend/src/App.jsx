import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; // Added Routing
import { useAuth } from './context/AuthContext'; // Added Auth Hook
import './App.css';
import * as XLSX from 'xlsx';
import { Document, Packer, Paragraph, TextRun, ExternalHyperlink } from 'docx';
import { saveAs } from 'file-saver';

// Import Pages (We will create these in the next step)
import Login from './pages/Login';
import Register from './pages/Register';
import API from './utils/api';
import Sidebar from './components/Sidebar'; // ADD THIS
import ResultCard from './components/ResultCard'; 


function App() {
  const { token, loading: authLoading } = useAuth(); // Rename auth loading
  const [inputText, setInputText] = useState('');
  const [results, setResults] = useState([]);
  const [isScraping, setIsScraping] = useState(false); // Changed name to isScraping
  const [error, setError] = useState('');
    const [refreshHistory, setRefreshHistory] = useState(0); 


  const handleGenerate = async () => {
    if (!inputText.trim()) {
      alert('Please paste some URLs.');
      return;
    }

    setIsScraping(true);
    setResults([]);
    setError('');
    
    const urls = inputText.split(/[\n, ]+/).filter(url => url.length > 0);

    try {
      // FIX: Using our API utility to send the Token automatically
      const { data } = await API.post('/scrape', { urls });
      setResults(data);
            setRefreshHistory(prev => prev + 1); 

    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setIsScraping(false);
    }
  };

  const getSuccessfulResults = () => results.filter(r => r.status === 'success');

  // --- Download Handlers ---
  // --- Download Handlers (Updated for MERN Objects) ---
  const downloadTxt = () => {
    const data = getSuccessfulResults().map(item => 
      `URL: ${item.url}\nTITLE: ${item.title}\nDESC: ${item.description}`
    ).join('\n\n---\n\n');
    const blob = new Blob([data], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, 'meta_results.txt');
  };

  const downloadXlsx = () => {
    const data = getSuccessfulResults().map(item => ({ 
      URL: item.url,
      Title: item.title, 
      Description: item.description,
      SEO_Score: item.seoScore + '%'
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Meta Results");
    XLSX.writeFile(wb, "meta_results.xlsx");
  };

  const downloadDocx = async () => {
    const paragraphs = getSuccessfulResults().flatMap(item => [
      new Paragraph({
        children: [
          new ExternalHyperlink({
            children: [new TextRun({ text: item.url, color: "0000FF", underline: true })],
            link: item.url,
          }),
        ],
      }),
      new Paragraph({
        children: [new TextRun({ text: `Title: ${item.title}`, bold: true, size: 24 })],
      }),
      new Paragraph({
        children: [new TextRun({ text: item.description, size: 22 })],
      }),
      new Paragraph({ text: "" })
    ]);

    const doc = new Document({ sections: [{ children: paragraphs }] });
    const blob = await Packer.toBlob(doc);
    saveAs(blob, 'meta_results.docx');
  };

    // Use the renamed authLoading here
  if (authLoading) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading Workspace...</div>;

  return (
    <Routes>
      {/* Auth Pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Main App Workspace (Protected) */}
      <Route path="/" element={
        token ? (
          <div className="app-layout">
            {/* 1. Side Navigation */}
            <Sidebar 
  onSelectHistory={(item) => setResults([item])} 
  refreshTrigger={refreshHistory} 
/>

            {/* 2. Main Content Container */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
              
              <nav className="navbar">
                <div className="nav-brand">
                  <div className="logo-icon">M</div>
                  <span>MetaScraper<span className="pro-badge">PRO</span></span>
                </div>
              </nav>

              <main className="main-content" style={{ flex: 1, overflowY: 'auto', padding: '40px 20px' }}>
                <div className="card input-card">
                  <div className="card-header">
                    <h2>Bulk URL Processor</h2>
                    <p className="subtitle">Paste your links below to extract Titles & Descriptions automatically.</p>
                  </div>
                  
                  <textarea 
                    className="input-area"
                    rows="8" 
                    placeholder="Paste URLs here (https://example.com)&#10;One per line..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                  ></textarea>
                  
                  <div className="action-bar">
                    <button className="btn btn-primary" onClick={handleGenerate} disabled={isScraping}>
                      {isScraping ? <span className="loader-text">Processing...</span> : 'Generate Meta Data'}
                    </button>
                  </div>

                  {error && <div className="error-banner">{error}</div>}
                </div>

                {/* Results Section */}
                {(results.length > 0 || isScraping) && (
                  <div className="results-wrapper">
                    <div className="results-header">
                      <h3>Results ({results.length})</h3>
                      {getSuccessfulResults().length > 0 && (
                        <div className="download-actions">
                          <button className="btn btn-outline" onClick={downloadTxt}>TXT</button>
                          <button className="btn btn-outline" onClick={downloadDocx}>DOCX</button>
                          <button className="btn btn-outline" onClick={downloadXlsx}>EXCEL</button>
                        </div>
                      )}
                    </div>

                    {isScraping && <div className="loading-spinner"></div>}

                                      <div className="results-list">
                    {results.map((item, index) => (
                      <ResultCard key={item._id || index} item={item} />
                    ))}
                  </div>
                  </div>
                )}
              </main>
            </div>
          </div>
        ) : (
          <Navigate to="/login" />
        )
      } />
    </Routes>
  );
}

export default App;