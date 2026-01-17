import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiService } from '../services/api';
import './TypesManager.css';

function TypesManager({ onClose, onTypesUpdated }) {
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [newTypeName, setNewTypeName] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadTypes();
  }, []);

  const loadTypes = async () => {
    try {
      setLoading(true);
      const data = await apiService.getAllTypes();
      setTypes(data);
    } catch (error) {
      setError('Failed to load types');
      console.error('Error loading types:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newTypeName.trim()) {
      setError('Type name is required');
      return;
    }

    try {
      setError('');
      await apiService.createType(newTypeName);
      setNewTypeName('');
      setMessage('Type added successfully');
      setTimeout(() => setMessage(''), 3000);
      await loadTypes();
      if (onTypesUpdated) onTypesUpdated();
    } catch (error) {
      console.error('Error creating type:', error);
      setError(error.message || 'Failed to add type. Make sure the server is running.');
    }
  };

  const handleEdit = (type) => {
    setEditingId(type.id);
    setEditValue(type.name);
    setError('');
  };

  const handleSaveEdit = async (id) => {
    if (!editValue.trim()) {
      setError('Type name is required');
      return;
    }

    try {
      setError('');
      await apiService.updateType(id, editValue);
      setEditingId(null);
      setEditValue('');
      setMessage('Type updated successfully');
      setTimeout(() => setMessage(''), 3000);
      await loadTypes();
      if (onTypesUpdated) onTypesUpdated();
    } catch (error) {
      setError(error.message || 'Failed to update type');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditValue('');
    setError('');
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete the type "${name}"?`)) {
      return;
    }

    try {
      setError('');
      await apiService.deleteType(id);
      setMessage('Type deleted successfully');
      setTimeout(() => setMessage(''), 3000);
      await loadTypes();
      if (onTypesUpdated) onTypesUpdated();
    } catch (error) {
      setError(error.message || 'Failed to delete type');
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="types-manager-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="types-manager-container"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="types-manager-header">
            <h2>Manage Types</h2>
            <button className="close-button" onClick={onClose}>×</button>
          </div>

          {message && (
            <motion.div
              className="message success"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {message}
            </motion.div>
          )}

          {error && (
            <motion.div
              className="message error"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleAdd} className="add-type-form">
            <input
              type="text"
              value={newTypeName}
              onChange={(e) => setNewTypeName(e.target.value)}
              placeholder="Enter new type name"
              className="type-input"
            />
            <motion.button
              type="submit"
              className="add-type-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Add Type
            </motion.button>
          </form>

          <div className="types-list">
            {loading ? (
              <div className="loading">Loading types...</div>
            ) : types.length === 0 ? (
              <div className="empty-state">No types found. Add your first type above.</div>
            ) : (
              types.map((type) => (
                <div key={type.id} className="type-item">
                  {editingId === type.id ? (
                    <div className="type-edit-form">
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="type-input"
                        autoFocus
                      />
                      <div className="type-edit-actions">
                        <motion.button
                          onClick={() => handleSaveEdit(type.id)}
                          className="save-button"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Save
                        </motion.button>
                        <motion.button
                          onClick={handleCancelEdit}
                          className="cancel-button"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Cancel
                        </motion.button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="type-info">
                        <span className="type-name">{type.name}</span>
                        <span className="type-count">({type.item_count || 0} items)</span>
                      </div>
                      <div className="type-actions">
                        <motion.button
                          onClick={() => handleEdit(type)}
                          className="edit-button"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Edit
                        </motion.button>
                        <motion.button
                          onClick={() => handleDelete(type.id, type.name)}
                          className="delete-button"
                          disabled={type.item_count > 0}
                          whileHover={{ scale: type.item_count === 0 ? 1.05 : 1 }}
                          whileTap={{ scale: type.item_count === 0 ? 0.95 : 1 }}
                        >
                          Delete
                        </motion.button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default TypesManager;
