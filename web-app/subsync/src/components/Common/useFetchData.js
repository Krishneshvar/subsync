import { useState, useEffect } from 'react'
import axios from 'axios'

const useFetchData = (url, { searchType, search, sort, order, currentPage }) => {
  const [data, setData] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await axios.get(url, {
          params: { searchType, search, sort, order, page: currentPage },
          withCredentials: true,
        })
  
        console.log('API response:', response.data)
        setData(response.data.customers)
        setTotalPages(response.data.totalPages)
      } catch (err) {
        setError("Failed to load data. Please try again later.")
        console.error("Error fetching data:", err)
      } finally {
        setLoading(false)
      }
    }      
  
    fetchData()
  }, [url, searchType, search, sort, order, currentPage])

  return { data, error, loading, totalPages }
}

export default useFetchData
