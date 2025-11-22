import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
export default function useFetchData(url) {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(url);
        if (!res.ok) {
          navigate("/404", { replace: true });
          return;
        }
        const result = await res.json();
        setData(result);
      } catch {
        navigate("/404", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, navigate]);

  return { data, loading };
}
