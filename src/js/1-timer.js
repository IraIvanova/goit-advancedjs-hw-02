import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

let userSelectedDate;
let timerId;
const startBtn = document.querySelector('[data-start]');
const dateInput = document.querySelector('#datetime-picker');
const daysSpan = document.querySelector('span[data-days]');
const hoursSpan = document.querySelector('span[data-hours]');
const minutesSpan = document.querySelector('span[data-minutes]');
const secondsSpan = document.querySelector('span[data-seconds]');

startBtn.disabled = true;
startBtn.addEventListener('click', onStart);

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selected = selectedDates[0];

    if (!validateDate(selected)) return;

    userSelectedDate = selected;
    startBtn.disabled = false;
  },
};

flatpickr('#datetime-picker', options);

function validateDate(selected) {
  if (!selected || selected.getTime() <= Date.now()) {
    userSelectedDate = null;
    startBtn.disabled = true;

    iziToast.error({
      title: 'Error',
      message: 'Please choose a date in the future',
      position: 'center',
    });

    return false;
  }

  return true;
}

function onStart() {
  if (!validateDate(userSelectedDate)) return;

  startBtn.disabled = true;
  dateInput.disabled = true;

  timerId = setInterval(tick, 1000);
  tick();
}

function tick() {
  const msLeft = userSelectedDate.getTime() - Date.now();

  if (msLeft <= 0) {
    stopTimer();
    return;
  }

  updateTimer(convertMs(msLeft));
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function updateTimer({ days, hours, minutes, seconds }) {
  daysSpan.textContent = addLeadingZero(days);
  hoursSpan.textContent = addLeadingZero(hours);
  minutesSpan.textContent = addLeadingZero(minutes);
  secondsSpan.textContent = addLeadingZero(seconds);
}

function stopTimer() {
  clearInterval(timerId);
  timerId = null;

  updateTimer({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  dateInput.disabled = false;
  startBtn.disabled = true;
  userSelectedDate = null;
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
