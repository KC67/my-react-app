export const calculateRewardPoints = (price) => {
  const amount = Math.floor(price);
  if (amount >= 100) {
    return 50 + (amount - 100) * 2;
  }
  if (amount >= 50) {
    return amount - 50;
  }
  return 0;
};
