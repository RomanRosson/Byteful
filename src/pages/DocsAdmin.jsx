import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import PoweredBy from '../components/PoweredBy';
import { authService } from '../utils/auth';
import { apiService } from '../services/api';
import './DocsAdmin.css';

function DocsAdmin({ onLogout }) {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login?redirect=/docs-admin');
      return;
    }
    loadDocs();
  }, [navigate]);

  const loadDocs = async () => {
    try {
      setLoading(true);
      // TODO: Add docs API call to apiService
      const response = await fetch('http://localhost:3001/api/docs');
      const data = await response.json();
      setDocs(data);
    } catch (error) {
      console.error('Error loading docs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    if (onLogout) onLogout();
    navigate('/docs');
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();
    const isDocx = fileName.endsWith('.docx');
    const isMarkdown = fileName.endsWith('.md') || fileName.endsWith('.markdown');
    const isImage = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(fileName);

    if (!isDocx && !isMarkdown && !isImage) {
      alert('Please upload a DOCX file, Markdown file, or image.');
      return;
    }

    // TODO: Implement file upload to server
    console.log('File selected:', file.name, file.type);
    alert(`File "${file.name}" selected. Upload functionality will be implemented.`);
    
    e.target.value = '';
  };

  const filterDocs = () => {
    // TODO: Implement filtering logic
    return docs;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <motion.div
          className="loading-spinner"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  return (
    <div className="docs-admin">
      <Header showAdminButton={false} showAdminLabel={true} />
      
      <main className="docs-admin-content">
        <div className="docs-admin-header">
          <h1>Docs Administration</h1>
          <motion.button
            className="logout-button"
            onClick={handleLogout}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Logout
          </motion.button>
        </div>

        <div className="search-box">
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="docs-tabs">
          <motion.button
            className={`docs-tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            All
          </motion.button>
          <motion.button
            className={`docs-tab ${activeTab === 'markdown' ? 'active' : ''}`}
            onClick={() => setActiveTab('markdown')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Markdown
          </motion.button>
          <motion.button
            className={`docs-tab ${activeTab === 'docx' ? 'active' : ''}`}
            onClick={() => setActiveTab('docx')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            DOCX Files
          </motion.button>
          <motion.button
            className={`docs-tab ${activeTab === 'images' ? 'active' : ''}`}
            onClick={() => setActiveTab('images')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Images
          </motion.button>
        </div>

        <div className="docs-actions">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".docx,.md,.markdown,.jpg,.jpeg,.png,.gif,.webp,.svg"
            style={{ display: 'none' }}
          />
          <motion.button
            className="upload-button"
            onClick={handleUploadClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            + Upload Document
          </motion.button>
          <motion.button
            className="create-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            + Create New
          </motion.button>
        </div>

        <div className="docs-list">
          {docs.length === 0 ? (
            <div className="empty-state">
              <p>No documents yet. Upload or create your first document!</p>
            </div>
          ) : (
            docs.map((doc) => (
              <div key={doc.id} className="doc-item">
                <h3>{doc.title}</h3>
                <p>Type: {doc.file_type}</p>
                <p>Created: {new Date(doc.created_at).toLocaleDateString()}</p>
              </div>
            ))
          )}
        </div>
      </main>
      <PoweredBy />
    </div>
  );
}

export default DocsAdmin;
