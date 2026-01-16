import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import ItemCard from '../components/ItemCard';
import ItemForm from '../components/ItemForm';
import { apiService } from '../services/api';
import { authService } from '../utils/auth';
import './Admin.css';

function Admin({ onLogout }) {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
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
      showMessage('error', 'Error loading items');
      console.error('Error loading items:', error);
    } finally {
      setLoading(false);
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
      <Header showAdminButton={false} />
      
      <main className="admin-content">
        <div className="admin-header">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            Admin Portal
          </motion.h1>
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
    </div>
  );
}

export default Admin;
