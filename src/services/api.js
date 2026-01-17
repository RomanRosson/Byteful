// API service layer to handle HTTP requests to the backend
// This abstracts the API calls and can be easily swapped for a cloud solution later

// Use relative path in development to leverage Vite proxy, full URL in production
const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '/api' : 'http://localhost:3001/api');

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
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to create item' }));
        throw new Error(errorData.error || `Failed to create item: ${response.status} ${response.statusText}`);
      }
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
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to update item' }));
        throw new Error(errorData.error || `Failed to update item: ${response.status} ${response.statusText}`);
      }
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


  async getItemTypes() {
    try {
      const response = await fetch(`${API_BASE_URL}/items/types`);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to fetch item types:', response.status, errorText);
        throw new Error('Failed to fetch item types');
      }
      const data = await response.json();
      console.log('getItemTypes response:', data);
      // Ensure we return an array
      if (Array.isArray(data)) {
        return data.filter(type => type && type.trim() !== ''); // Filter out empty types
      }
      return [];
    } catch (error) {
      console.error('Error fetching item types:', error);
      return [];
    }
  },

  // Type management
  async getAllTypes() {
    try {
      const response = await fetch(`${API_BASE_URL}/types`);
      if (!response.ok) throw new Error('Failed to fetch types');
      return await response.json();
    } catch (error) {
      console.error('Error fetching types:', error);
      throw error;
    }
  },

  async createType(name) {
    try {
      const response = await fetch(`${API_BASE_URL}/types`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });
      if (!response.ok) {
        let errorMessage = 'Failed to create type';
        try {
          const error = await response.json();
          errorMessage = error.error || errorMessage;
        } catch (e) {
          // Response is not JSON, use status text
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating type:', error);
      throw error;
    }
  },

  async updateType(id, name) {
    try {
      const response = await fetch(`${API_BASE_URL}/types/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });
      if (!response.ok) {
        let errorMessage = 'Failed to update type';
        try {
          const error = await response.json();
          errorMessage = error.error || errorMessage;
        } catch (e) {
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating type:', error);
      throw error;
    }
  },

  async deleteType(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/types/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        let errorMessage = 'Failed to delete type';
        try {
          const error = await response.json();
          errorMessage = error.error || errorMessage;
        } catch (e) {
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }
      return await response.json();
    } catch (error) {
      console.error('Error deleting type:', error);
      throw error;
    }
  }
};
