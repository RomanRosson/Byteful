import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import PoweredBy from '../components/PoweredBy';
import { authService } from '../utils/auth';
import './Docs.css';

function Docs() {
  const [activeTab, setActiveTab] = useState('all');
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Check admin status on mount
  useEffect(() => {
    setIsAdmin(authService.isAuthenticated());
  }, []);

  const handleAdminClick = () => {
    if (isAdmin) {
      navigate('/docs-admin');
    } else {
      navigate('/login?redirect=/docs-admin');
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
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
    
    // Reset input
    e.target.value = '';
  };

  return (
    <div className="docs">
      <Header showAdminButton={true} onAdminClick={handleAdminClick} />
      
      <main className="docs-content">
        <motion.div
          className="docs-hero"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <h1>Byteful DOCS</h1>
          <p>Store and manage your documents, markdown guides, and images.</p>
        </motion.div>

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

        {isAdmin && (
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
        )}

        <div className="docs-grid">
          <motion.div
            className="empty-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p>No documents yet. Upload or create your first document!</p>
          </motion.div>
        </div>
      </main>
      <PoweredBy />
    </div>
  );
}

export default Docs;
