import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './Header.css';

function Header({ showAdminButton = false, onAdminClick }) {
  return (
    <motion.header 
      className="header"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="header-content">
        <Link to="/" className="logo">
          <motion.h1
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            Byteful
          </motion.h1>
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
