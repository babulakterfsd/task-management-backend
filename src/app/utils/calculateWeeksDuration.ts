const calculateWeeksDuration = (
  startDateStr: string,
  endDateStr: string,
): number => {
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  const timeDifference = endDate.getTime() - startDate.getTime();
  const daysDifference = timeDifference / (1000 * 60 * 60 * 24);
  const weeksDifference = Math.ceil(daysDifference / 7);

  return weeksDifference;
};

export default calculateWeeksDuration;
