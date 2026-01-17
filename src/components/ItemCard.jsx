import { motion } from 'framer-motion';
import './ItemCard.css';

function ItemCard({ item, index, onEdit, onDelete, isAdmin = false }) {

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const handleOpenLink = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const isLink = item.type?.toLowerCase() === 'link';

  return (
    <>
      <motion.div
        className="item-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        whileHover={{ y: -2 }}
      >
        {/* Type label */}
        <div className="item-type">
          {isLink ? (
            <svg className="type-icon link-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6.87988 9.12012C7.44171 9.68195 8.20435 9.99999 9.00012 9.99999C9.79589 9.99999 10.5585 9.68195 11.1204 9.12012L13.1204 7.12012C14.2115 6.02905 14.2115 4.37099 13.1204 3.27992C12.0293 2.18885 10.3712 2.18885 9.28012 3.27992L8.00012 4.55992" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9.12012 6.87988C8.55829 6.31805 7.79565 6 7.00012 6C6.20435 6 5.44171 6.31805 4.87988 6.87988L2.87988 8.87988C1.78881 9.97095 1.78881 11.629 2.87988 12.7201C3.97095 13.8111 5.62901 13.8111 6.72012 12.7201L8.00012 11.4401" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            <span className="type-icon">{item.type === 'command' ? '⚡' : item.type === 'site' ? '🌐' : '📝'}</span>
          )}
          <span className="type-label">{item.type}</span>
        </div>

        <span className="item-separator">|</span>

        {/* Title with info icon */}
        <div className="item-title-wrapper">
          <h3 className="item-title">{item.title}</h3>
          {item.description && (
            <div className="info-icon-container">
              <motion.button
                className="info-icon-button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M8 6V8M8 10H8.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </motion.button>
              <div className="description-tooltip">
                {item.description}
              </div>
            </div>
          )}
        </div>

        <span className="item-separator">|</span>

        {/* Content */}
        {!isLink && (
          <div className="item-content">
            {item.type?.toLowerCase() === 'command' ? (
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
        )}

        {/* Admin actions */}
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

        {/* Link and launch button for links - far right */}
        {isLink && (
          <div className="link-section">
            <a 
              href={item.content} 
              target="_blank" 
              rel="noopener noreferrer"
              className="item-link"
            >
              {item.content}
            </a>
            <span className="item-separator">|</span>
            <motion.button
              className="open-link-button"
              onClick={() => handleOpenLink(item.content)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Open in new tab"
            >
              <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 3H3C2.44772 3 2 3.44772 2 4V13C2 13.5523 2.44772 14 3 14H12C12.5523 14 13 13.5523 13 13V10M10 2H14M14 2V6M14 2L7 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.button>
          </div>
        )}
      </motion.div>
    </>
  );
}

export default ItemCard;
