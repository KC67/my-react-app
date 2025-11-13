import { calculateRewardPoints } from "./calculateRewardPoints";

export const calculateMonthwiseRewards = (data) => {
  return Object.values(
    data
      .map((t) => {
        const dateObj = new Date(t.date);
        const month = dateObj.toLocaleString("default", { month: "short" });
        const year = dateObj.getFullYear();
        const key = `${t.name}-${month}-${year}`;

        return {
          key,
          customerId: t.customerId,
          name: t.name,
          month,
          year,
          rewardPoints: calculateRewardPoints(t.price),
        };
      })
      .reduce((acc, curr) => {
        // merge transactions for same customer in same month
        if (!acc[curr.key]) {
          acc[curr.key] = { ...curr };
        } else {
          acc[curr.key].rewardPoints += curr.rewardPoints;
        }
        return acc;
      }, {})
  );
};
