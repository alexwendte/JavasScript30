/* Get Our Elements */
const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');

/* Build our functions */
function togglePlay() {
  const method = video.paused ? 'play' : 'pause';
  video[method]();
}

function updateButton() {
  const icon = this.paused ? '►' : '❚ ❚';
  toggle.textContent = icon;
}

function skip() {
  video.currentTime += parseFloat(this.dataset.skip);
}

let rangeClicked = false;
function handleRangeUpdate() {
  if (!rangeClicked) return;
  video[this.name] = this.value;
}

function handleProgress() {
  const percent = video.currentTime / video.duration * 100;
  progressBar.style.flexBasis = `${percent}%`;
}

function scrub(e) {
  const scrubTime = e.offsetX / progress.offsetWidth * video.duration;
  video.currentTime = scrubTime;
  video.volume = 0;
}

function fixVolume() {
  video.volume = ranges[0].value;
}

function fullscreen() {
  if (video.requestFullscreen) {
    video.requestFullscreen();
  } else if (video.msRequestFullscreen) {
    video.msRequestFullscreen();
  } else if (video.mozRequestFullScreen) {
    video.mozRequestFullScreen();
  } else if (video.webkitRequestFullscreen) {
    video.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT)
  }
}

/* Hook up the event listeners */

video.addEventListener('click', () => {
  togglePlay();
  fullscreen();
});
toggle.addEventListener('click', togglePlay);
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);
video.addEventListener('timeupdate', handleProgress);
skipButtons.forEach((button) => {
  button.addEventListener('click', skip);
});
ranges.forEach((button) => {
  button.addEventListener('change', handleRangeUpdate);
});
ranges.forEach((button) => {
  button.addEventListener('mousemove', handleRangeUpdate);
  button.addEventListener('mousedown', (e) => {
    rangeClicked = true;
  });
});
let progressClicked = false;
progress.addEventListener('click', scrub);
progress.addEventListener('mousemove', (e) => progressClicked && scrub(e));
progress.addEventListener('mousedown', () => (progressClicked = true));
progress.addEventListener('mouseup', () => {
  progressClicked = false;
  fixVolume();
});
progress.addEventListener('mouseout', () => {
  progressClicked = false;
  fixVolume();
});
