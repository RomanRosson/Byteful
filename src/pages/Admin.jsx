import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import Header from '../components/Header';
import ItemCard from '../components/ItemCard';
import ItemForm from '../components/ItemForm';
import PoweredBy from '../components/PoweredBy';
import { apiService } from '../services/api';
import { authService } from '../utils/auth';
import './Admin.css';

function Admin({ onLogout }) {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [itemTypes, setItemTypes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication on mount and redirect if not authenticated
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }
    loadItems();
    loadItemTypes();
  }, [navigate]);

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
      showMessage('error', 'Error loading items');
      console.error('Error loading items:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadItemTypes = async () => {
    try {
      const types = await apiService.getItemTypes();
      setItemTypes(types);
    } catch (error) {
      console.error('Error loading item types:', error);
    }
  };

  const filterItems = () => {
    let filtered = [...items];

    if (filterType !== 'all') {
      filtered = filtered.filter(item => item.type === filterType);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.content.toLowerCase().includes(query) ||
        (item.description && item.description.toLowerCase().includes(query))
      );
    }

    setFilteredItems(filtered);
  };

  const handleAdd = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleSave = async (formData) => {
    try {
      if (editingItem) {
        await apiService.updateItem(editingItem.id, formData);
        showMessage('success', 'Item updated successfully');
      } else {
        await apiService.createItem(formData);
        showMessage('success', 'Item created successfully');
      }
      setShowForm(false);
      setEditingItem(null);
      loadItems();
      loadItemTypes();
    } catch (error) {
      showMessage('error', 'Error saving item');
      console.error('Error saving item:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      await apiService.deleteItem(id);
      showMessage('success', 'Item deleted successfully');
      loadItems();
      loadItemTypes();
    } catch (error) {
      showMessage('error', 'Error deleting item');
      console.error('Error deleting item:', error);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  const handleLogout = () => {
    authService.logout();
    onLogout();
    navigate('/');
  };

  const handleHardRefresh = () => {
    // Log out admin before hard refresh
    authService.logout();
    onLogout();
    // Force a hard refresh - clears cache and reloads all data
    window.location.reload();
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => {
      setMessage({ type: '', text: '' });
    }, 3000);
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
    <div className="admin">
      <Header showAdminButton={false} showAdminLabel={true} />
      
      <main className="admin-content">
        <div className="admin-header">
          <div className="admin-actions">
            <motion.button
              className="add-button"
              onClick={handleAdd}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              + Add Item
            </motion.button>
            <motion.button
              className="logout-button"
              onClick={handleLogout}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Logout
            </motion.button>
          </div>
        </div>

        {message.text && (
          <motion.div
            className={`message ${message.type}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {message.text}
          </motion.div>
        )}

        <div className="filters-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-buttons">
            <motion.button
              key="all"
              className={`filter-button ${filterType === 'all' ? 'active' : ''}`}
              onClick={() => setFilterType('all')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              All
            </motion.button>
            {itemTypes.map((type) => (
              <motion.button
                key={type}
                className={`filter-button ${filterType === type ? 'active' : ''}`}
                onClick={() => setFilterType(type)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {type}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="items-grid">
          {filteredItems.length === 0 ? (
            <div className="empty-state">
              <p>No items found. Add your first item!</p>
            </div>
          ) : (
            filteredItems.map((item, index) => (
              <ItemCard
                key={item.id}
                item={item}
                index={index}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isAdmin={true}
              />
            ))
          )}
        </div>
      </main>

      {showForm && (
        <ItemForm
          item={editingItem}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
      <PoweredBy />
      
      {/* Hard refresh button - logs out admin before refreshing */}
      <motion.button
        className="hard-refresh-button"
        onClick={handleHardRefresh}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title="Hard refresh (logout & clear cache)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <RefreshCw size={18} strokeWidth={2} />
      </motion.button>
    </div>
  );
}

export default Admin;
