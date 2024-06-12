import { moveStageHandler } from './stage.handler.js';
import { gameEnd, gameStart } from './game.handler.js';

const handlerMappings = {
  1: gameStart,
  2: gameEnd,
  11: moveStageHandler,
};

export default handlerMappings;
