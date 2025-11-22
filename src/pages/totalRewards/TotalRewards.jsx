/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { useFetchTransactionDetailsData } from "../../api/transactionDetailsData";
import LoadingSpinner from "../../components/loader/LoadingSpinner";
import Table from "../../components/table/Table";
import { calculateRewardPoints } from "../../utils/calculateRewardPoints";

const columns = [
  { key: "customerName", label: "Customer Name" },
  { key: "rewardPoints", label: "Reward Points" },
];

const TotalRewards = () => {
  const [data, setData] = useState([]);
  const { data: rewardsData, loading } = useFetchTransactionDetailsData();
  useEffect(() => {
    if (rewardsData && rewardsData.length > 0) {
      setData(
        Object.values(
          rewardsData
            .map((t) => {
              return {
                customerName: t.name,
                rewardPoints: calculateRewardPoints(t.price),
              };
            })
            .reduce((acc, curr) => {
              // merge total rewards for unique customer
              if (!acc[curr.customerName]) {
                acc[curr.customerName] = { ...curr };
              } else {
                acc[curr.customerName].rewardPoints += curr.rewardPoints;
              }
              return acc;
            }, {})
        )
      );
    }
  }, [rewardsData]);

  return (
    <div className="page-container">
      <h2>Total Rewards</h2>
      {loading ? <LoadingSpinner /> : <Table columns={columns} data={data} />}
    </div>
  );
};

export default TotalRewards;
