import Player from './Player.js';
import Ground from './Ground.js';
import CactiController from './CactiController.js';
import Score from './Score.js';
import ItemController from './ItemController.js';

const ITEM_CONFIG = [
  { width: 50 / 1.5, height: 50 / 1.5, id: 1, image: 'images/items/pokeball_red.png' },
  { width: 50 / 1.5, height: 50 / 1.5, id: 2, image: 'images/items/pokeball_yellow.png' },
  { width: 50 / 1.5, height: 50 / 1.5, id: 3, image: 'images/items/pokeball_purple.png' },
  { width: 50 / 1.5, height: 50 / 1.5, id: 4, image: 'images/items/pokeball_cyan.png' },
];

async function fetchJSON(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
  }
  return response.json();
}

async function loadJSONData() {
  try {
    const stageData = await fetchJSON('/assets/stage.json');
    const itemData = await fetchJSON('/assets/item.json');
    const itemUnlockData = await fetchJSON('/assets/item_unlock.json');
    startGame(stageData, itemData, itemUnlockData);
  } catch (error) {
    console.error('Error loading JSON data:', error);
  }
}

function startGame(stageData, itemData, itemUnlockData) {
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');

  const GAME_SPEED_START = 1;
  const GAME_SPEED_INCREMENT = 0.00001;

  const GAME_WIDTH = 800;
  const GAME_HEIGHT = 200;

  const PLAYER_WIDTH = 88 / 1.5;
  const PLAYER_HEIGHT = 94 / 1.5;
  const MAX_JUMP_HEIGHT = GAME_HEIGHT;
  const MIN_JUMP_HEIGHT = 150;

  const GROUND_WIDTH = 2400;
  const GROUND_HEIGHT = 24;
  const GROUND_SPEED = 0.5;

  const CACTI_CONFIG = [
    { width: 48 / 1.5, height: 100 / 1.5, image: 'images/cactus_1.png' },
    { width: 98 / 1.5, height: 100 / 1.5, image: 'images/cactus_2.png' },
    { width: 68 / 1.5, height: 70 / 1.5, image: 'images/cactus_3.png' },
  ];

  let player = null;
  let ground = null;
  let cactiController = null;
  let itemController = null;
  let score = null;

  let scaleRatio = null;
  let previousTime = null;
  let gameSpeed = GAME_SPEED_START;
  let gameover = false;
  let hasAddedEventListenersForRestart = false;
  let waitingToStart = true;

  function createSprites() {
    const playerWidthInGame = PLAYER_WIDTH * scaleRatio;
    const playerHeightInGame = PLAYER_HEIGHT * scaleRatio;
    const minJumpHeightInGame = MIN_JUMP_HEIGHT * scaleRatio;
    const maxJumpHeightInGame = MAX_JUMP_HEIGHT * scaleRatio;

    const groundWidthInGame = GROUND_WIDTH * scaleRatio;
    const groundHeightInGame = GROUND_HEIGHT * scaleRatio;

    player = new Player(
      ctx,
      playerWidthInGame,
      playerHeightInGame,
      minJumpHeightInGame,
      maxJumpHeightInGame,
      scaleRatio,
    );

    ground = new Ground(ctx, groundWidthInGame, groundHeightInGame, GROUND_SPEED, scaleRatio);

    const cactiImages = CACTI_CONFIG.map((cactus) => {
      const image = new Image();
      image.src = cactus.image;
      return {
        image,
        width: cactus.width * scaleRatio,
        height: cactus.height * scaleRatio,
      };
    });

    cactiController = new CactiController(ctx, cactiImages, scaleRatio, GROUND_SPEED);

    const itemImages = ITEM_CONFIG.map((item) => {
      const image = new Image();
      image.src = item.image;
      return {
        image,
        id: item.id,
        width: item.width * scaleRatio,
        height: item.height * scaleRatio,
      };
    });

    itemController = new ItemController(ctx, itemImages, scaleRatio, GROUND_SPEED);

    score = new Score(ctx, scaleRatio, stageData, itemData);  // 수정된 부분
  }

  function getScaleRatio() {
    const screenHeight = Math.min(window.innerHeight, document.documentElement.clientHeight);
    const screenWidth = Math.min(window.innerHeight, document.documentElement.clientWidth);

    if (screenWidth / screenHeight < GAME_WIDTH / GAME_HEIGHT) {
      return screenWidth / GAME_WIDTH;
    } else {
      return screenHeight / GAME_HEIGHT;
    }
  }

  function setScreen() {
    scaleRatio = getScaleRatio();
    canvas.width = GAME_WIDTH * scaleRatio;
    canvas.height = GAME_HEIGHT * scaleRatio;
    createSprites();
  }

  setScreen();
  window.addEventListener('resize', setScreen);

  if (screen.orientation) {
    screen.orientation.addEventListener('change', setScreen);
  }

  function showGameOver() {
    const fontSize = 70 * scaleRatio;
    ctx.font = `${fontSize}px Verdana`;
    ctx.fillStyle = 'grey';
    const x = canvas.width / 4.5;
    const y = canvas.height / 2;
    ctx.fillText('GAME OVER', x, y);
  }

  function showStartGameText() {
    const fontSize = 40 * scaleRatio;
    ctx.font = `${fontSize}px Verdana`;
    ctx.fillStyle = 'grey';
    const x = canvas.width / 14;
    const y = canvas.height / 2;
    ctx.fillText('Tap Screen or Press Space To Start', x, y);
  }

  function updateGameSpeed(deltaTime) {
    gameSpeed += deltaTime * GAME_SPEED_INCREMENT;
  }

  function reset() {
    hasAddedEventListenersForRestart = false;
    gameover = false;
    waitingToStart = false;

    ground.reset();
    cactiController.reset();
    itemController.reset();
    score.reset();
    gameSpeed = GAME_SPEED_START;
  }

  function setupGameReset() {
    if (!hasAddedEventListenersForRestart) {
      hasAddedEventListenersForRestart = true;

      setTimeout(() => {
        window.addEventListener('keyup', reset, { once: true });
      }, 1000);
    }
  }

  function clearScreen() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  function gameLoop(currentTime) {
    if (previousTime === null) {
      previousTime = currentTime;
      requestAnimationFrame(gameLoop);
      return;
    }

    const deltaTime = currentTime - previousTime;
    previousTime = currentTime;

    clearScreen();

    if (!gameover && !waitingToStart) {
      ground.update(gameSpeed, deltaTime);
      cactiController.update(gameSpeed, deltaTime);
      itemController.update(gameSpeed, deltaTime);
      player.update(gameSpeed, deltaTime);
      updateGameSpeed(deltaTime);

      score.update(deltaTime);
    }

    if (!gameover && cactiController.collideWith(player)) {
      gameover = true;
      score.setHighScore();
      setupGameReset();
    }

    const collideWithItem = itemController.collideWith(player);
    if (collideWithItem && collideWithItem.itemId) {
      score.getItem(collideWithItem.itemId);
    }

    player.draw();
    cactiController.draw();
    ground.draw();
    score.draw();
    itemController.draw();

    if (gameover) {
      showGameOver();
    }

    if (waitingToStart) {
      showStartGameText();
    }

    requestAnimationFrame(gameLoop);
  }

  requestAnimationFrame(gameLoop);

  window.addEventListener('keyup', reset, { once: true });
}

loadJSONData();