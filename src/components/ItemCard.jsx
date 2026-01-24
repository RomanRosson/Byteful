import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link, Zap, Globe, Download, Wrench, FileText } from 'lucide-react';
import './ItemCard.css';

function ItemCard({ item, index, onEdit, onDelete, isAdmin = false }) {
  const [isTooltipHovered, setIsTooltipHovered] = useState(false);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const handleOpenLink = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const isUrl = (str) => {
    if (!str) return false;
    try {
      const url = new URL(str);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      // Check if it starts with http:// or https://
      return /^https?:\/\//i.test(str.trim());
    }
  };

  const isLink = isUrl(item.content);

  const getTypeIcon = (type) => {
    const typeLower = type?.toLowerCase();
    const iconProps = {
      className: "type-icon",
      size: 16,
      strokeWidth: 1.5
    };

    switch (typeLower) {
      case 'link':
        return <Link {...iconProps} />;
      case 'command':
        return <Zap {...iconProps} />;
      case 'site':
        return <Globe {...iconProps} />;
      case 'software':
        return <Download {...iconProps} />;
      case 'tool':
        return <Wrench {...iconProps} />;
      default:
        return <FileText {...iconProps} />;
    }
  };

  return (
    <>
      <motion.div
        className={`item-card ${isTooltipHovered ? 'tooltip-active' : ''}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        whileHover={{ y: -2 }}
      >
        {/* Type label */}
        <div className="item-type">
          {getTypeIcon(item.type)}
          <span className="type-label">{item.type}</span>
        </div>

        <span className="item-separator">|</span>

        {/* Title */}
        <div className="item-title-wrapper">
          <h3 className="item-title">{item.title}</h3>
        </div>

        {/* Description */}
        {item.description && (
          <>
            <span className="item-separator">|</span>
            <div 
              className="item-description-container"
              onMouseEnter={() => setIsTooltipHovered(true)}
              onMouseLeave={() => setIsTooltipHovered(false)}
            >
              <div className="item-description">
                {item.description}
              </div>
              <div className="description-tooltip">
                {item.description}
              </div>
            </div>
          </>
        )}

        {/* Content - only show for non-URLs or commands that aren't URLs */}
        {!isLink && item.type?.toLowerCase() !== 'command' && (
          <>
            <span className="item-separator">|</span>
            <div className="item-content">
              <p className="item-text">{item.content}</p>
            </div>
          </>
        )}

        {/* Command content - show copy button even if it's a URL */}
        {item.type?.toLowerCase() === 'command' && !isLink && (
          <>
            <span className="item-separator">|</span>
            <div className="item-content">
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
            </div>
          </>
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

        {/* Link and launch button for URLs - far right */}
        {isLink && (
          <>
            {item.description && <span className="item-separator">|</span>}
            <div className="link-section">
              <a 
                href={item.content} 
                target="_blank" 
                rel="noopener noreferrer"
                className="item-link"
              >
                {item.content}
              </a>
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
          </>
        )}
      </motion.div>
    </>
  );
}

export default ItemCard;
