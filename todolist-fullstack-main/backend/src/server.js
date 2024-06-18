import express from "express";
import jsonwebtoken from "jsonwebtoken";
import { user, PRIVATE_KEY, tokenValited } from "./auth";

const api = express();
api.use(express.json());

api.get('/', (_, res) => res.status(200).json({
  message: 'This is a PUBLIC router...'
}));

api.get('/login', (req, res) => {
  const [, hash] = req.headers.authorization?.split(' ') || [' ', ' '];
  const [email, password] = Buffer.from(hash, 'base64').toString().split(':');

  try {
    const correctPassword = email === 'isaac@exemplo.com' && password === '123456';

    if (!correctPassword) return response.status(401).send('Password or E-mail incorrect!');

    const token = jsonwebtoken.sign(
      { user: JSON.stringify(user) },
      PRIVATE_KEY,
      { expiresIn: '60m' }
    );

    return res.status(200).json({ data: { user, token } });
  } catch (error) {
    console.log(error);
    return res.send(error);
  }
});

api.use('*', tokenValited);

api.get('/private', (req, res) => {
  const { user } = req.headers
  const currentUser = JSON.parse(user);
  return res.status(200).json({
    message: 'essa rota e PRIVADA...',
    data: {
      userLogged: currentUser
    }
  })
});

api.listen(3000, () => console.log('server running...'));

const app = require('./app');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running or port ${PORT}`));
