import React, { useEffect, useState } from 'react';
import API from '../utils/api';
import { History, Globe, Trash2, LogOut, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ onSelectHistory, refreshTrigger }) => {
  const [history, setHistory] = useState([]);
  const { logout, user } = useAuth();

  const fetchHistory = async () => {
    try {
      const { data } = await API.get('/scrape/history');
      setHistory(data);
    } catch (err) {
      console.error("Failed to load history");
    }
  };

useEffect(() => {
    fetchHistory();
  }, [refreshTrigger]); // Now sidebar refreshes whenever a scrape happens!

  return (
    <aside className="sidebar" style={{ width: '280px', background: 'white', borderRight: '1px solid #e6e9ee', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '24px', borderBottom: '1px solid #e6e9ee' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#7b68ee', fontWeight: '800', fontSize: '1.1rem' }}>
          <Globe size={20} /> METASCRAPER
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        <h3 style={{ fontSize: '0.75rem', fontWeight: '700', color: '#7e828e', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <History size={14} /> Recent Scrapes
        </h3>

        {history.map((item) => (
          <div 
            key={item._id} 
            onClick={() => onSelectHistory(item)}
            className="history-item"
            style={{ padding: '12px', borderRadius: '8px', cursor: 'pointer', marginBottom: '8px', transition: 'all 0.2s', border: '1px solid transparent' }}
          >
            <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#292d34', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {item.title}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#7e828e', marginTop: '2px' }}>
              {new Date(item.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: '16px', borderTop: '1px solid #e6e9ee', background: '#f8f9fb' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#7b68ee', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.8rem' }}>
                {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: '600' }}>{user?.username}</div>
        </div>
        <button onClick={logout} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #e04f5e', color: '#e04f5e', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.8rem', fontWeight: '600' }}>
          <LogOut size={14} /> Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;