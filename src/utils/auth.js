// Authentication utility functions

const AUTH_KEY = 'byteful_admin_auth';

export const authService = {
  isAuthenticated() {
    const auth = localStorage.getItem(AUTH_KEY);
    if (!auth) return false;
    
    try {
      const { timestamp } = JSON.parse(auth);
      // Session expires after 24 hours
      const now = Date.now();
      const expiresAt = timestamp + (24 * 60 * 60 * 1000);
      
      if (now > expiresAt) {
        this.logout();
        return false;
      }
      
      return true;
    } catch {
      return false;
    }
  },

  login() {
    const auth = {
      authenticated: true,
      timestamp: Date.now()
    };
    localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
  },

  logout() {
    localStorage.removeItem(AUTH_KEY);
  }
};
