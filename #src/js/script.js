const lastUpdate = "2021 sep 14 19:00";

const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minsEl = document.getElementById("mins");
const secondsEl = document.getElementById("seconds");

function count() {
  const lastUpdateDate = new Date(lastUpdate);
  const currentDate = new Date();
  const diff = (currentDate - lastUpdateDate) / 1000;
  const days = Math.floor(diff / 3600 / 24);
  const hours = Math.floor(diff / 3600) % 24;
  const mins = (Math.floor(diff / 60)) % 60;
  const seconds = Math.floor(diff % 60);
  daysEl.innerHTML = days;
  hoursEl.innerHTML = hours;
  minsEl.innerHTML = mins;
  secondsEl.innerHTML = seconds;
  // console.log(days, hours, mins, seconds);
}
count();
setInterval(count, 1000);

