import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiService } from '../services/api';
import TypesManager from './TypesManager';
import CustomDropdown from './CustomDropdown';
import './ItemForm.css';

function ItemForm({ item, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    type: '',
    title: '',
    content: '',
    description: ''
  });
  const [itemTypes, setItemTypes] = useState([]);
  const [loadingTypes, setLoadingTypes] = useState(true);
  const [showTypesManager, setShowTypesManager] = useState(false);

  useEffect(() => {
    loadItemTypes();
  }, []);

  // Reload types when form becomes visible (in case types were added while form was open)
  useEffect(() => {
    if (!showTypesManager) {
      loadItemTypes();
    }
  }, [showTypesManager]);

  useEffect(() => {
    if (item) {
      setFormData({
        type: item.type || '',
        title: item.title || '',
        content: item.content || '',
        description: item.description || ''
      });
    } else if (itemTypes.length > 0) {
      // Set default to first available type when creating new item
      setFormData(prev => {
        // Only set default if type is not already set
        if (!prev.type || prev.type.trim() === '') {
          return { ...prev, type: itemTypes[0] };
        }
        return prev;
      });
    }
  }, [item, itemTypes]);

  const loadItemTypes = async () => {
    try {
      setLoadingTypes(true);
      const types = await apiService.getItemTypes();
      console.log('ItemForm - Loaded types:', types, 'Type:', typeof types, 'Is Array:', Array.isArray(types)); // Debug log
      const validTypes = Array.isArray(types) ? types.filter(t => t && typeof t === 'string' && t.trim() !== '') : [];
      console.log('ItemForm - Valid types:', validTypes);
      setItemTypes(validTypes);
      // If no item is being edited and types are loaded, set default type
      if (!item && validTypes.length > 0) {
        setFormData(prev => {
          // Only set default if type is not already set
          if (!prev.type || prev.type.trim() === '') {
            return { ...prev, type: validTypes[0] };
          }
          return prev;
        });
      }
    } catch (error) {
      console.error('Error loading item types:', error);
      setItemTypes([]);
    } finally {
      setLoadingTypes(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submission - formData:', formData); // Debug log
    if (!formData.type || !formData.type.trim()) {
      alert('Type is required. Please select a type from the dropdown.');
      return;
    }
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Title and content are required');
      return;
    }
    onSave(formData);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="form-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onCancel}
      >
        <motion.div
          className="form-container"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <h2>{item ? 'Edit Item' : 'Add New Item'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="type">Type *</label>
              <CustomDropdown
                id="type"
                name="type"
                value={formData.type || ''}
                onChange={handleChange}
                options={itemTypes}
                placeholder="Select a type"
                disabled={loadingTypes || itemTypes.length === 0}
                required={true}
                loading={loadingTypes}
                loadingText="Loading types..."
                emptyText="No types available - Add types using 'Manage Types' below"
              />
              <button
                type="button"
                className="manage-types-button"
                onClick={() => setShowTypesManager(true)}
              >
                Manage Types
              </button>
            </div>

            <div className="form-group">
              <label htmlFor="title">Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Enter title"
              />
            </div>

            <div className="form-group">
              <label htmlFor="content">
                {formData.type?.toLowerCase() === 'link' ? 'URL *' : formData.type?.toLowerCase() === 'command' ? 'Command *' : 'Content *'}
              </label>
              {formData.type?.toLowerCase() === 'command' ? (
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  required
                  placeholder="Enter command"
                  rows="3"
                />
              ) : (
                <input
                  type={formData.type?.toLowerCase() === 'link' ? 'url' : 'text'}
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  required
                  placeholder={formData.type?.toLowerCase() === 'link' ? 'https://example.com' : 'Enter content'}
                />
              )}
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter description (optional)"
                rows="3"
              />
            </div>


            <div className="form-actions">
              <motion.button
                type="button"
                className="cancel-button"
                onClick={onCancel}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                className="save-button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item ? 'Update' : 'Create'}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
      {showTypesManager && (
        <TypesManager
          onClose={async () => {
            setShowTypesManager(false);
            // Reload types when manager closes in case types were added/updated
            await loadItemTypes();
          }}
          onTypesUpdated={async () => {
            await loadItemTypes();
          }}
        />
      )}
    </AnimatePresence>
  );
}

export default ItemForm;
