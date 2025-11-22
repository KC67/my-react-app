/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { useFetchTransactionDetailsData } from "../../api/transactionDetailsData";
import LoadingSpinner from "../../components/loader/LoadingSpinner";
import Table from "../../components/table/Table";
import { calculateMonthwiseRewards } from "../../utils/calculateMonthwiseRewards";

const columns = [
  { key: "customerId", label: "Customer Id" },
  { key: "name", label: "Name" },
  { key: "month", label: "Month" },
  { key: "year", label: "Year" },
  { key: "rewardPoints", label: "Reward Points" },
];

const UserMonthlyRewards = () => {
  const [data, setData] = useState([]);
  const { data: rewardsData, loading } = useFetchTransactionDetailsData();

  useEffect(() => {
    if (rewardsData && rewardsData.length > 0) {
      const monthlyRewards = calculateMonthwiseRewards(rewardsData);
      setData(monthlyRewards);
    }
  }, [rewardsData]);

  return (
    <div className="page-container">
      <h2>User Monthly Rewards</h2>
      {loading ? <LoadingSpinner /> : <Table columns={columns} data={data} />}
    </div>
  );
};

export default UserMonthlyRewards;
