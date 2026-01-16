import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import ItemCard from '../components/ItemCard';
import { apiService } from '../services/api';
import './Home.css';

function Home() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadItems();
  }, []);

  useEffect(() => {
    filterItems();
  }, [searchQuery, filterType, items]);

  const loadItems = async () => {
    try {
      setLoading(true);
      const data = await apiService.getAllItems();
      setItems(data);
      setFilteredItems(data);
    } catch (error) {
      console.error('Error loading items:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterItems = () => {
    let filtered = [...items];

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(item => item.type === filterType);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.content.toLowerCase().includes(query) ||
        (item.description && item.description.toLowerCase().includes(query)) ||
        (item.category && item.category.toLowerCase().includes(query)) ||
        (item.tags && item.tags.toLowerCase().includes(query))
      );
    }

    setFilteredItems(filtered);
  };

  const handleAdminClick = () => {
    navigate('/login');
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
    <div className="home">
      <Header showAdminButton={true} onAdminClick={handleAdminClick} />
      
      <main className="main-content">
        <motion.div
          className="hero-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1>Welcome to Byteful</h1>
          <p>Your personal knowledge base for links, commands, and technical resources</p>
        </motion.div>

        <div className="filters-section">
          <motion.div
            className="search-box"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </motion.div>

          <div className="filter-buttons">
            {['all', 'link', 'command', 'site'].map((type) => (
              <motion.button
                key={type}
                className={`filter-button ${filterType === type ? 'active' : ''}`}
                onClick={() => setFilterType(type)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="items-grid">
          {filteredItems.length === 0 ? (
            <motion.div
              className="empty-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p>No items found. {items.length === 0 && 'Add your first item in the admin panel!'}</p>
            </motion.div>
          ) : (
            filteredItems.map((item, index) => (
              <ItemCard key={item.id} item={item} index={index} />
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default Home;
