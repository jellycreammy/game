import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basePath = path.join(__dirname, '../../assets');

console.log('Base path:', basePath); // 경로 확인을 위한 로그

// 파일을 비동기적으로 읽는 함수
const readFileAsync = (filename) => {
  return new Promise((resolve, reject) => {
    const filePath = path.join(basePath, filename);
    console.log('Reading file:', filePath); // 파일 경로 로그
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      try {
        resolve(JSON.parse(data));
      } catch (parseErr) {
        reject(parseErr);
      }
    });
  });
};

// 게임 데이터를 로드하는 함수
export const gameAssets = async () => {
  try {
    const [stageData, itemData, itemUnlockData] = await Promise.all([
      readFileAsync('stage.json'),
      readFileAsync('item.json'),
      readFileAsync('item_unlock.json') 
    ]);
    return { stageData, itemData, itemUnlockData };
  } catch (err) {
    console.error('Error loading game assets:', err);
    throw err;
  }
};

export default {
  gameAssets
};
