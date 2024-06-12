import express from 'express';
import handlerMappings from './handlers/handlerMapping.js';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());

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

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
