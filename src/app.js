import express from 'express';
import { createServer } from 'http';
import handlerMappings from './handlers/handlerMapping.js';
import bodyParser from 'body-parser';
import { initSocket } from './init/socket.js';
import { gameAssets } from './init/assets.js'; 

const app = express();
const server = createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

initSocket(server); // initSocket 함수를 호출합니다.

app.post('/api', (req, res) => {
  const { handlerID, payload } = req.body;
  const handler = handlerMappings[handlerID];
  
  if (handler) {
    handler(payload);
    res.status(200).send('Success');
  } else {
    res.status(400).send('Invalid handler ID');
  }
});

// 서버 시작 시 게임 데이터를 로드하고 콘솔에 출력
const startServer = async () => {
  try {
    const assets = await gameAssets();
    console.log('Stage Data:', assets.stageData);
    console.log('Item Data:', assets.itemData);
    console.log('Item Unlock Data:', assets.itemUnlockData);

    server.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  } catch (err) {
    console.error('Failed to load game assets:', err);
  }
};

startServer();
