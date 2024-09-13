const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const porta = 3000;

const chaveSecreta = '1234567890';

// Definições de claims JWT
const claimsJWT = {
  "iss": "Emissor",
  "sub": "Assunto",
  "aud": "Audiência",
  "exp": "Tempo de Expiração",
  "nbf": "Não Antes de",
  "iat": "Emitido Em",
  "jti": "ID do JWT"
};

app.get('/jwt/claims', (req, res) => {
  res.json(claimsJWT);
});

app.get('/jwt/tokenid', (req, res) => {
  const payload = {};

  const opcoes = {
    expiresIn: '1h',
    jwtid: 'heitor123'
  };

  const token = jwt.sign(payload, chaveSecreta, opcoes);
  const decodificado = jwt.decode(token);

  res.json({
    id: decodificado.jti,
    emitidoEm: new Date(decodificado.iat * 1000).toISOString(),
    expiraEm: new Date(decodificado.exp * 1000).toISOString()
  });
});

app.listen(porta, () => {
  console.log(`Servidor rodando em http://localhost:${porta}`);
});
