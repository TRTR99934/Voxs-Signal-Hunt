const stage = document.querySelector('#stage');
const player = document.querySelector('#player');
const flagsBox = document.querySelector('#flags');
const countEl = document.querySelector('#count');
const totalEl = document.querySelector('#total');
const ending = document.querySelector('#ending');
const message = document.querySelector('#message');

const spots = [[8, 31], [30, 38], [56, 31], [83, 34], [19, 72], [72, 70]];
let pos = { x: 45, y: 60 };
let keys = {};
let collected = 0;
let flags = [];
let round = 0;

function placePlayer() {
  player.style.left = `calc(${pos.x}% - ${player.offsetWidth / 2}px)`;
  player.style.top = `calc(${pos.y}% - ${player.offsetHeight}px)`;
}

function start() {
  round += 1;
  collected = 0;
  pos = { x: 45, y: 60 };
  flagsBox.innerHTML = '';
  ending.hidden = true;
  message.hidden = false;
  flags = spots.map(([x, y], index) => {
    const flag = document.createElement('img');
    flag.className = 'flag';
    flag.src = 'assets/trans-flag.png';
    flag.alt = 'Transgender pride flag';
    flag.style.left = `${x}%`;
    flag.style.top = `${y}%`;
    flag.style.animationDelay = `${index * 0.17}s`;
    flagsBox.append(flag);
    return { x, y, el: flag };
  });
  countEl.textContent = '0';
  totalEl.textContent = flags.length;
  requestAnimationFrame(placePlayer);
  stage.focus();
}

function collectNearbyFlags() {
  flags.forEach((flag) => {
    if (!flag.el.isConnected || Math.hypot(pos.x - flag.x, pos.y - flag.y) >= 7) return;
    flag.el.remove();
    collected += 1;
    countEl.textContent = collected;
    message.textContent = collected === flags.length ? 'Signal complete!' : `${collected} signal${collected === 1 ? '' : 's'} collected!`;
    if (collected === flags.length) {
      const winningRound = round;
      setTimeout(() => {
        if (round === winningRound && collected === flags.length) {
          message.hidden = true;
          ending.hidden = false;
        }
      }, 450);
    }
  });
}

function tick() {
  const dx = (keys.ArrowRight || keys.d ? 1 : 0) - (keys.ArrowLeft || keys.a ? 1 : 0);
  const dy = (keys.ArrowDown || keys.s ? 1 : 0) - (keys.ArrowUp || keys.w ? 1 : 0);
  if (dx || dy) {
    pos.x = Math.max(5, Math.min(95, pos.x + dx * 0.55));
    pos.y = Math.max(27, Math.min(96, pos.y + dy * 0.55));
    placePlayer();
    collectNearbyFlags();
  }
  requestAnimationFrame(tick);
}

addEventListener('keydown', (event) => {
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(event.key)) {
    keys[event.key] = true;
    event.preventDefault();
  }
});
addEventListener('keyup', (event) => { keys[event.key] = false; });
document.querySelector('#reset').onclick = start;
document.querySelector('#again').onclick = start;
start();
tick();
