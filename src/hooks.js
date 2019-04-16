import { useState, useEffect } from 'react';

export const useYTSSearch = ({query, type }) => {
  const [request, setRequest] = useState({ data: [], status: 'INIT' });
  
  useEffect(() => {
    if (query && type) {
      setRequest({ ...request, status: 'LOADING' });
      const searchParams = new URLSearchParams();
      searchParams.append('query', query);
      searchParams.append('type', type);
      const searchUrl = `/api/search?${searchParams.toString()}`;
      fetch(searchUrl)
      .then((response) => {
        if (!response.ok) throw Error(response.statusText);
        return response.json();
      })
      .then((data) => {
        console.log('data :', data);
        setRequest({ ...request, data, status: 'SUCCESS' });
      })
      .catch(err => {
        console.log('err :', err);
        setRequest({ ...request, data: [], status: 'ERROR' });
      });
    }
  }, [query, type]);

  return request;
}
