import { useEffect, useState } from "react";

export default function useTerminologySearch(filter: string) {
  const apiUrl = '/terminology-api/api/v1/frontend/searchTerminology';

  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (
      async function () {
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
          .catch(error => {
            setError(error)
          })
          .finally(() => {
            setLoading(false)
          })
      }
    )();
  }, [filter]);

  return { results, error, loading }
};
