import { useMemo } from "react";
import useFetchData from "../hooks/useFetchData";

export const apiURL =
  "https://6915d19e465a9144626db46a.mockapi.io/api/v1/rewards/allTransactions";

export function useFetchTransactionDetailsData() {
  const { data, loading } = useFetchData(apiURL);

  const processedData = useMemo(() => {
    if (!Array.isArray(data)) return [];

    const today = new Date();

    return data
      .filter((t) => t?.date)
      .filter((t) => {
        const dateObj = new Date(t.date);
        if (isNaN(dateObj)) return false;

        const diff =
          (today.getFullYear() - dateObj.getFullYear()) * 12 +
          (today.getMonth() - dateObj.getMonth());

        return diff < 3 && diff >= 0; // last 3 months
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [data]); // only recompute when API data changes

  return { data: processedData, loading };
}
