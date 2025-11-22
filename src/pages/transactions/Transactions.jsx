/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { useFetchTransactionDetailsData } from "../../api/transactionDetailsData";
import LoadingSpinner from "../../components/loader/LoadingSpinner";
import Table from "../../components/table/Table";
import { calculateRewardPoints } from "../../utils/calculateRewardPoints";

const columns = [
  { key: "id", label: "Transaction ID" },
  { key: "customerName", label: "Customer Name" },
  { key: "date", label: "Purchase Date" },
  { key: "product", label: "Product Purchased" },
  { key: "price", label: "Price" },
  { key: "rewardPoints", label: "Reward Points" },
];

const Transactions = () => {
  const [data, setData] = useState([]);
  const { data: rewardsData, loading } = useFetchTransactionDetailsData();

  useEffect(() => {
    if (rewardsData && rewardsData.length > 0) {
      setData(
        rewardsData.map((t) => {
          return {
            id: t.transactionId,
            customerName: t.name,
            date: t.date,
            product: t.product,
            price: t.price,
            rewardPoints: calculateRewardPoints(t.price),
          };
        })
      );
    }
  }, [rewardsData]);

  return (
    <div className="page-container">
      <h2>Transactions</h2>
      {loading ? <LoadingSpinner /> : <Table columns={columns} data={data} />}
    </div>
  );
};

export default Transactions;
