import fs from 'fs';

export const loadGameData = () => {
  const stageData = JSON.parse(fs.readFileSync('./assets/stage.json', 'utf8'));
  const itemData = JSON.parse(fs.readFileSync('./assets/item.json', 'utf8'));
  
  return { stageData, itemData };
};
