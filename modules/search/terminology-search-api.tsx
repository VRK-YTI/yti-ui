import { useEffect, useState } from "react";

export default function useTerminologySearch() {
  const apiUrl = '/terminology-api/api/v1/frontend/searchTerminology';

  const [results, setResults] = useState(null)
  const [filter, setFilter] = useState(''); 
  const [loading, setLoading] = useState(false);

  async function fetchData() {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: filter,
        searchConcepts: true,
        prefLang: 'fi',
        pageSize: 10,
        pageFrom: 0,
      }),
    };

    setLoading(true)
    await fetch(apiUrl, requestOptions)
      .then((response) => response.json())
      .then(data => setResults(data))
      .catch(error => setLoading(false))

    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [filter])

  return [results, setFilter, loading] as const
  
}
