const API_BASE_URL = 'http://localhost:5000/api';

const getHeaders = (includeAuth = true) => {
  const headers = {
    'Content-Type': 'application/json'
  };

  if (includeAuth) {
    const token = localStorage.getItem('tablereserve_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
};

const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || `Request failed with status ${response.status}`);
    error.status = response.status;
    error.data = data;
    error.isConflict = response.status === 409;
    throw error;
  }

  return data;
};

export const api = {
  // Authentication
  auth: {
    login: async (credentials) => {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: getHeaders(false),
        body: JSON.stringify(credentials)
      });
      return handleResponse(res);
    },
    register: async (userData) => {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: getHeaders(false),
        body: JSON.stringify(userData)
      });
      return handleResponse(res);
    },
    getMe: async () => {
      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: getHeaders(true)
      });
      return handleResponse(res);
    }
  },

  // Restaurants
  restaurants: {
    getAll: async (params = {}) => {
      const query = new URLSearchParams();
      if (params.search) query.append('search', params.search);
      if (params.cuisine && params.cuisine !== 'All') query.append('cuisine', params.cuisine);
      if (params.priceLevel && params.priceLevel !== 'All') query.append('priceLevel', params.priceLevel);

      const res = await fetch(`${API_BASE_URL}/restaurants?${query.toString()}`, {
        method: 'GET',
        headers: getHeaders(false)
      });
      return handleResponse(res);
    },
    getById: async (id) => {
      const res = await fetch(`${API_BASE_URL}/restaurants/${id}`, {
        method: 'GET',
        headers: getHeaders(false)
      });
      return handleResponse(res);
    },
    getAvailability: async (restaurantId, date, time, partySize) => {
      const query = new URLSearchParams({
        date,
        time: time || '19:00',
        partySize: partySize || 2
      });
      const res = await fetch(`${API_BASE_URL}/restaurants/${restaurantId}/availability?${query.toString()}`, {
        method: 'GET',
        headers: getHeaders(false)
      });
      return handleResponse(res);
    },
    create: async (data) => {
      const res = await fetch(`${API_BASE_URL}/restaurants`, {
        method: 'POST',
        headers: getHeaders(true),
        body: JSON.stringify(data)
      });
      return handleResponse(res);
    },
    update: async (id, data) => {
      const res = await fetch(`${API_BASE_URL}/restaurants/${id}`, {
        method: 'PUT',
        headers: getHeaders(true),
        body: JSON.stringify(data)
      });
      return handleResponse(res);
    }
  },

  // Tables
  tables: {
    getByRestaurant: async (restaurantId) => {
      const res = await fetch(`${API_BASE_URL}/restaurants/${restaurantId}/tables`, {
        method: 'GET',
        headers: getHeaders(true)
      });
      return handleResponse(res);
    },
    add: async (restaurantId, tableData) => {
      const res = await fetch(`${API_BASE_URL}/restaurants/${restaurantId}/tables`, {
        method: 'POST',
        headers: getHeaders(true),
        body: JSON.stringify(tableData)
      });
      return handleResponse(res);
    },
    update: async (tableId, updateData) => {
      const res = await fetch(`${API_BASE_URL}/tables/${tableId}`, {
        method: 'PUT',
        headers: getHeaders(true),
        body: JSON.stringify(updateData)
      });
      return handleResponse(res);
    }
  },

  // Reservations
  reservations: {
    create: async (reservationData) => {
      const res = await fetch(`${API_BASE_URL}/reservations`, {
        method: 'POST',
        headers: getHeaders(true),
        body: JSON.stringify(reservationData)
      });
      return handleResponse(res);
    },
    getMy: async () => {
      const res = await fetch(`${API_BASE_URL}/reservations/my`, {
        method: 'GET',
        headers: getHeaders(true)
      });
      return handleResponse(res);
    },
    getById: async (id) => {
      const res = await fetch(`${API_BASE_URL}/reservations/${id}`, {
        method: 'GET',
        headers: getHeaders(true)
      });
      return handleResponse(res);
    },
    cancel: async (id) => {
      const res = await fetch(`${API_BASE_URL}/reservations/${id}/cancel`, {
        method: 'PATCH',
        headers: getHeaders(true)
      });
      return handleResponse(res);
    }
  },

  // Manager Portal
  manager: {
    getDashboard: async () => {
      const res = await fetch(`${API_BASE_URL}/manager/dashboard`, {
        method: 'GET',
        headers: getHeaders(true)
      });
      return handleResponse(res);
    },
    getReports: async () => {
      const res = await fetch(`${API_BASE_URL}/manager/reports`, {
        method: 'GET',
        headers: getHeaders(true)
      });
      return handleResponse(res);
    },
    getReservations: async (params = {}) => {
      const query = new URLSearchParams();
      if (params.date) query.append('date', params.date);
      if (params.status && params.status !== 'All') query.append('status', params.status);
      if (params.restaurantId) query.append('restaurantId', params.restaurantId);

      const res = await fetch(`${API_BASE_URL}/manager/reservations?${query.toString()}`, {
        method: 'GET',
        headers: getHeaders(true)
      });
      return handleResponse(res);
    },
    updateStatus: async (id, status) => {
      const res = await fetch(`${API_BASE_URL}/manager/reservations/${id}/status`, {
        method: 'PATCH',
        headers: getHeaders(true),
        body: JSON.stringify({ status })
      });
      return handleResponse(res);
    }
  }
};
