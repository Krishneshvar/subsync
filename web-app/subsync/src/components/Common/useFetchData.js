import { useState, useEffect } from 'react';
import axios from 'axios';

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

        const response = await axios.get(url, {
          params: { searchType, search, sort, order, page: currentPage },
          withCredentials: true,
        });

        // Ensure data is set as an array and handle response format
        setData(response.data.customers || []);  // Assuming the response has 'customers'
        setTotalPages(response.data.totalPages || 1);  // Assuming the response has 'totalPages'
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
