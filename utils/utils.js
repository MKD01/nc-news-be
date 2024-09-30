exports.getRandomDate = () => {
  const to = new Date();

  const randomMonth = Math.ceil(Math.random() * (to.getMonth() - 1));
  const maxDaysInMonth = new Date(2024, randomMonth, 0).getDate();

  const randomDay = Math.round(Math.random() * maxDaysInMonth);

  const from = new Date(2024, randomMonth, randomDay);

  const fromTime = from.getTime();
  const toTime = to.getTime();

  return new Date(fromTime + Math.random() * (toTime - fromTime));
};
