// API service layer to handle HTTP requests to the backend
// This abstracts the API calls and can be easily swapped for a cloud solution later

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const apiService = {
  // Items
  async getAllItems() {
    try {
      const response = await fetch(`${API_BASE_URL}/items`);
      if (!response.ok) throw new Error('Failed to fetch items');
      return await response.json();
    } catch (error) {
      console.error('Error fetching items:', error);
      throw error;
    }
  },

  async getItemById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/items/${id}`);
      if (!response.ok) throw new Error('Failed to fetch item');
      return await response.json();
    } catch (error) {
      console.error('Error fetching item:', error);
      throw error;
    }
  },

  async createItem(item) {
    try {
      const response = await fetch(`${API_BASE_URL}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
      });
      if (!response.ok) throw new Error('Failed to create item');
      return await response.json();
    } catch (error) {
      console.error('Error creating item:', error);
      throw error;
    }
  },

  async updateItem(id, item) {
    try {
      const response = await fetch(`${API_BASE_URL}/items/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
      });
      if (!response.ok) throw new Error('Failed to update item');
      return await response.json();
    } catch (error) {
      console.error('Error updating item:', error);
      throw error;
    }
  },

  async deleteItem(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/items/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete item');
      return await response.json();
    } catch (error) {
      console.error('Error deleting item:', error);
      throw error;
    }
  },

  // Authentication
  async authenticateAdmin(username, pin) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, pin }),
      });
      const data = await response.json();
      return data.authenticated === true;
    } catch (error) {
      console.error('Error authenticating:', error);
      throw error;
    }
  },

  // Search
  async searchItems(query) {
    try {
      if (!query || query.trim() === '') {
        return this.getAllItems();
      }
      const response = await fetch(`${API_BASE_URL}/items/search/${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Failed to search items');
      return await response.json();
    } catch (error) {
      console.error('Error searching items:', error);
      throw error;
    }
  },

  async getItemsByType(type) {
    try {
      const response = await fetch(`${API_BASE_URL}/items/type/${type}`);
      if (!response.ok) throw new Error('Failed to fetch items by type');
      return await response.json();
    } catch (error) {
      console.error('Error fetching items by type:', error);
      throw error;
    }
  },

  async getItemsByCategory(category) {
    try {
      // This endpoint would need to be added to the backend if needed
      const allItems = await this.getAllItems();
      return allItems.filter(item => item.category === category);
    } catch (error) {
      console.error('Error fetching items by category:', error);
      throw error;
    }
  }
};
