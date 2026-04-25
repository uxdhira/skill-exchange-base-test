export function getRatingStats(reviews: { rating: number }[]) {
  if (!reviews || reviews.length === 0) {
    return { average: 0, total: 0 };
  }

  const totalReviews = reviews.length;

  const sum = reviews.reduce((acc, r) => acc + (r.rating || 0), 0);

  return {
    average: Number((sum / totalReviews).toFixed(1)), // 4.7 style
    total: totalReviews,
  };
}
