const months = {
  1: 'January',
  2: 'February',
  3: 'March',
  4: 'April',
  5: 'May',
  6: 'June',
  7: 'July',
  8: 'August',
  9: 'September',
  10: 'October',
  11: 'November',
  12: 'December',
};

const goToCountdown = () => {
  document.getElementById('formContainer').style.display = 'none';
  document.getElementById('countdown').style.display = 'flex';
  generateCountdown();
};
const goToForm = () => {
  document.getElementById('formContainer').style.display = 'block';
  document.getElementById('countdown').style.display = 'none';

  generateYears();
};

const generateCountdown = () => {
  if (localStorage.title) {
    $('#countdown .countdownTitle').html(localStorage.title);
  }
  var timer = new easytimer.Timer();
  timer.start({
    countdown: true,
    precision: 'seconds',
    startValues: { seconds: Number(localStorage.diffInSeconds) },
  });

  $('#countdown .values').html(
    timer.getTimeValues().toString(['days', 'hours', 'minutes', 'seconds'])
  );

  $('#countdown .resetButton').click(function () {
    timer.stop();
    localStorage.diffInSeconds = '';
    localStorage.title = '';
  });

  timer.addEventListener('secondsUpdated', function (e) {
    const days = Number(timer.getTimeValues().days);
    const hours = Number(timer.getTimeValues().hours);
    const minutes = Number(timer.getTimeValues().minutes);
    const seconds = Number(timer.getTimeValues().seconds);
    localStorage.diffInSeconds =
      seconds + minutes * 60 + hours * 60 * 60 + days * 24 * 60 * 60;
    console.log(localStorage.diffInSeconds, days, hours, minutes, seconds);
    $('#countdown .values').html(
      timer.getTimeValues().toString(['days', 'hours', 'minutes', 'seconds'])
    );
  });

  timer.addEventListener('targetAchieved', function (e) {
    $('#countdown .values').html('Completed!');
  });
};

const generateForm = () => {
  document.getElementById('formContainer').style.display = 'block';
  generateYears();
};

const generateYears = () => {
  const date = luxon.DateTime.local().toObject();
  let yearSelect = document.getElementById('year');
  for (let i = 0; i < 10; i++) {
    let option = document.createElement('option');
    option.setAttribute('value', date.year + i);
    option.innerHTML = date.year + i;
    yearSelect.appendChild(option);
  }
};

const generateMonths = (selectedYear) => {
  const date = luxon.DateTime.local().toObject();
  const currentYear = date.year;
  const currentMonth = date.month;
  let monthSelector = document.getElementById('month');

  if (selectedYear == currentYear) {
    for (let i = currentMonth; i <= 12; i++) {
      let option = document.createElement('option');
      option.setAttribute('value', i);
      option.setAttribute('label', months[i]);
      monthSelector.appendChild(option);
    }
  } else {
    for (let i = 1; i <= 12; i++) {
      let option = document.createElement('option');
      option.setAttribute('value', i);
      option.setAttribute('label', months[i]);
      monthSelector.appendChild(option);
    }
  }
};

const generateDays = (selectedYear, selectedMonth) => {
  const date = luxon.DateTime.local().toObject();
  const currentYear = date.year;
  const currentMonth = date.month;
  const currentDay = date.day;
  const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
  let daySelector = document.getElementById('day');

  if (selectedYear == currentYear && selectedMonth == currentMonth) {
    for (let i = currentDay; i <= daysInMonth; i++) {
      let option = document.createElement('option');
      option.setAttribute('value', i);
      option.setAttribute('label', i);
      daySelector.appendChild(option);
    }
  } else {
    for (let i = 1; i <= daysInMonth; i++) {
      let option = document.createElement('option');
      option.setAttribute('value', i);
      option.setAttribute('label', i);
      daySelector.appendChild(option);
    }
  }
};

const handleSubmit = (event) => {
  event.preventDefault();
  const selectedYear = event.target.year.value;
  const selectedMonth = event.target.month.value;
  const selectedDay = event.target.day.value;
  const title = event.target.title.value;

  let diffInSeconds =
    luxon.DateTime.local(
      Number(selectedYear),
      Number(selectedMonth),
      Number(selectedDay)
    ).diff(luxon.DateTime.local()).milliseconds / 1000;
  diffInSeconds = Math.round(diffInSeconds);
  localStorage.diffInSeconds = Number(diffInSeconds);
  localStorage.title = title;
  goToCountdown();
  return false;
};

const handleSelectYear = () => {
  const selectedYear = document.getElementById('year').value;
  const monthSelector = document.getElementById('month');
  const daySelector = document.getElementById('day');
  while (monthSelector.lastChild.value != '') {
    monthSelector.removeChild(monthSelector.lastChild);
  }

  while (daySelector.lastChild.value != '') {
    daySelector.removeChild(daySelector.lastChild);
  }
  monthSelector.value = '';
  daySelector.value = '';
  generateMonths(selectedYear);
};

const handleSelectMonth = () => {
  const selectedYear = document.getElementById('year').value;
  const selectedMonth = document.getElementById('month').value;
  const daySelector = document.getElementById('day');
  while (daySelector.lastChild.value != '') {
    daySelector.removeChild(daySelector.lastChild);
  }
  daySelector.value = '';
  generateDays(selectedYear, selectedMonth);
};

if (localStorage.diffInSeconds) {
  goToCountdown();
} else {
  generateForm();
}
