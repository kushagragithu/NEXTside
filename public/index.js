function openSubject(subject) {
  window.location.href = `/subjects/${subject}/topics`;
}

const settings = document.querySelector(".settings");
const tooltip = document.querySelector('.settings-tooltip');

settings.addEventListener('click', () => {
  settings.classList.add('settings-open');
});

document.addEventListener('click', (e) => {
  if (!settings.contains(e.target) && !tooltip.contains(e.target)) {
    settings.classList.remove('settings-open');
  }
});