import { motion } from 'framer-motion';
import './ItemCard.css';

function ItemCard({ item, index, onEdit, onDelete, isAdmin = false }) {
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'link': return '🔗';
      case 'command': return '⚡';
      case 'site': return '🌐';
      default: return '📝';
    }
  };

  return (
    <motion.div
      className="item-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(104, 35, 177, 0.3)' }}
    >
      <div className="item-header">
        <div className="item-type">
          <span className="type-icon">{getTypeIcon(item.type)}</span>
          <span className="type-label">{item.type}</span>
        </div>
        {item.category && (
          <span className="item-category">{item.category}</span>
        )}
      </div>

      <h3 className="item-title">{item.title}</h3>
      
      {item.description && (
        <p className="item-description">{item.description}</p>
      )}

      <div className="item-content">
        {item.type === 'link' ? (
          <a 
            href={item.content} 
            target="_blank" 
            rel="noopener noreferrer"
            className="item-link"
          >
            {item.content}
          </a>
        ) : item.type === 'command' ? (
          <div className="command-wrapper">
            <code className="item-command">{item.content}</code>
            <motion.button
              className="copy-button"
              onClick={() => handleCopy(item.content)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Copy to clipboard"
            >
              📋
            </motion.button>
          </div>
        ) : (
          <p className="item-text">{item.content}</p>
        )}
      </div>

      {item.tags && (
        <div className="item-tags">
          {item.tags.split(',').map((tag, i) => (
            <span key={i} className="tag">{tag.trim()}</span>
          ))}
        </div>
      )}

      {isAdmin && (
        <div className="item-actions">
          <motion.button
            className="edit-button"
            onClick={() => onEdit(item)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Edit
          </motion.button>
          <motion.button
            className="delete-button"
            onClick={() => onDelete(item.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Delete
          </motion.button>
        </div>
      )}
    </motion.div>
  );
}

export default ItemCard;
