import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './ItemForm.css';

function ItemForm({ item, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    type: 'link',
    title: '',
    content: '',
    description: '',
    category: '',
    tags: ''
  });

  useEffect(() => {
    if (item) {
      setFormData({
        type: item.type || 'link',
        title: item.title || '',
        content: item.content || '',
        description: item.description || '',
        category: item.category || '',
        tags: item.tags || ''
      });
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
              >
                <option value="link">Link</option>
                <option value="command">Command</option>
                <option value="site">Site</option>
              </select>
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
                {formData.type === 'link' ? 'URL *' : formData.type === 'command' ? 'Command *' : 'Content *'}
              </label>
              {formData.type === 'command' ? (
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
                  type={formData.type === 'link' ? 'url' : 'text'}
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  required
                  placeholder={formData.type === 'link' ? 'https://example.com' : 'Enter content'}
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

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <input
                type="text"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Enter category (optional)"
              />
            </div>

            <div className="form-group">
              <label htmlFor="tags">Tags (comma-separated)</label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="tag1, tag2, tag3"
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
    </AnimatePresence>
  );
}

export default ItemForm;
