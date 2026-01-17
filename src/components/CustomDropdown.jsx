import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './CustomDropdown.css';

function CustomDropdown({ 
  id, 
  name, 
  value, 
  onChange, 
  options = [], 
  placeholder = 'Select an option',
  disabled = false,
  required = false,
  loading = false,
  loadingText = 'Loading...',
  emptyText = 'No options available'
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen]);

  // Close dropdown on Escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleSelect = (optionValue) => {
    if (disabled || loading) return;
    
    // Ensure we have a valid value
    if (!optionValue && optionValue !== '') {
      console.warn('CustomDropdown: Invalid option value selected');
      return;
    }
    
    // Create a synthetic event to match native select behavior
    const syntheticEvent = {
      target: {
        name: name,
        value: optionValue
      }
    };
    
    console.log('CustomDropdown: Selecting value', optionValue, 'for field', name); // Debug log
    onChange(syntheticEvent);
    setIsOpen(false);
  };

  const selectedOption = options.find(opt => opt === value || (typeof opt === 'object' && opt.value === value));
  const displayValue = typeof selectedOption === 'object' ? selectedOption.label : selectedOption || '';

  if (loading) {
    return (
      <div className="custom-dropdown" ref={dropdownRef}>
        <div className="custom-dropdown-trigger disabled">
          <span className="custom-dropdown-value">{loadingText}</span>
          <svg className="custom-dropdown-arrow" width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    );
  }

  if (options.length === 0) {
    return (
      <div className="custom-dropdown" ref={dropdownRef}>
        <div className="custom-dropdown-trigger disabled">
          <span className="custom-dropdown-value">{emptyText}</span>
          <svg className="custom-dropdown-arrow" width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="custom-dropdown" ref={dropdownRef}>
      <button
        type="button"
        className={`custom-dropdown-trigger ${isOpen ? 'open' : ''} ${disabled ? 'disabled' : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        id={id}
      >
        <span className="custom-dropdown-value">
          {displayValue || <span className="custom-dropdown-placeholder">{placeholder}</span>}
        </span>
        <motion.svg 
          className="custom-dropdown-arrow" 
          width="12" 
          height="12" 
          viewBox="0 0 12 12" 
          fill="none"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </motion.svg>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="custom-dropdown-menu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            role="listbox"
          >
            {options.map((option, index) => {
              const optionValue = typeof option === 'object' ? option.value : option;
              const optionLabel = typeof option === 'object' ? option.label : option;
              const isSelected = value === optionValue;
              
              return (
                <motion.button
                  key={index}
                  type="button"
                  className={`custom-dropdown-option ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleSelect(optionValue)}
                  role="option"
                  aria-selected={isSelected}
                  whileHover={{ backgroundColor: 'rgba(104, 35, 177, 0.1)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  {optionLabel}
                  {isSelected && (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M13.3333 4L6 11.3333L2.66667 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Hidden input for form submission */}
      <input
        type="hidden"
        name={name}
        value={value || ''}
        required={required}
      />
    </div>
  );
}

export default CustomDropdown;
