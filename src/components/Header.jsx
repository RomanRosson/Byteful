import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './Header.css';

function Header({ showAdminButton = false, onAdminClick, showAdminLabel = false }) {
  return (
    <motion.header 
      className="header"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <div className={`header-content ${showAdminLabel ? 'centered' : ''}`}>
        <Link to="/" className="logo">
          <motion.div
            className="logo-container"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <img src="/Byteful-Icon.png" alt="Byteful" className="logo-image" />
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Byteful
            </motion.h1>
            {showAdminLabel && (
              <motion.span
                className="admin-label"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                Admin
              </motion.span>
            )}
          </motion.div>
        </Link>
        {showAdminButton && (
          <motion.button
            className="admin-button"
            onClick={onAdminClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Admin
          </motion.button>
        )}
      </div>
    </motion.header>
  );
}

export default Header;
