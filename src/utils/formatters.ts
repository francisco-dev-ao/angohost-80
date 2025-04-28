
export const formatPrice = (price: number) => {
  return `${Math.round(price).toLocaleString()}kz`;
};
