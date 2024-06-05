import dayjs from 'dayjs';

const isPointPast = (pointDate) => dayjs(pointDate.dateFrom).isBefore(dayjs());
const isPointFuture = (pointDate) => dayjs(pointDate.dateFrom).isAfter(dayjs());
const getDateTime = (date) => dayjs(date).format('DD/MM/YY hh:mm');
const getDate = (date) => dayjs(date).format('DD MMM');

const getDays = (days) => {
  if (days < 10 && days !== 0) {
    days = `0${days}D`;
  }
  else if (days === 0) {
    days = '';
  }
  else {
    days = `${days}D`;
  }
  return days;
};

const getHours = (hours) => {
  while (hours > 23) {
    hours -= 24;
  }

  if (hours < 10 && hours !== 0) {
    hours = `0${hours}H`;
  }
  else if (hours === 0) {
    hours = '';
  }
  else {
    hours = `${hours}H`;
  }
  return hours;
};

const getMinutes = (minuts) => {
  while (minuts > 59) {
    minuts -= 60;
  }

  if (minuts < 10 && minuts !== 0) {
    minuts = `0${minuts}M`;
  }
  else {
    minuts = `${minuts}M`;
  }
  return minuts;
};

export { isPointFuture, isPointPast, getDateTime, getDate, getDays, getHours, getMinutes };
