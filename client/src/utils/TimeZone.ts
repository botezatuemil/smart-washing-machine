export const changeTimeZone = (date: Date) => {
  const currentDate = date;
  const difference = -currentDate.getTimezoneOffset() / 60;
  currentDate.setHours(currentDate.getHours() + difference);
  return currentDate;
};
