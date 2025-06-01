import { useState, useEffect } from 'react';

import api from '@/lib/axiosInstance.js';

const useFetchData = (url, params = {}) => {
  const { searchType = '', search = '', sort = '', order = '', currentPage = 1 } = params;
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.get(url, {
          params: { searchType, search, sort, order, page: currentPage },
          withCredentials: true,
        });

        setData(response.data.customers || []);
        setTotalPages(response.data.totalPages || 1);
      } catch (err) {
        setError("Failed to load data. Please try again later.");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, searchType, search, sort, order, currentPage]);

  return { data, error, loading, totalPages };
};

export default useFetchData;
