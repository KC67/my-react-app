import useFetchData from "../hooks/useFetchData";

export const apiURL =
  "https://6915d19e465a9144626db46a.mockapi.io/api/v1/rewards/allTransactions";

export function useFetchTransactionDetailsData() {
  return useFetchData(apiURL);
}
