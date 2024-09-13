const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const JWT_SECRET = 'minha_senha_secreta';

app.post('/jwt/auth', (req, res) => {
    const { nome, senha } = req.body;

    if ( nome !== 'heitor' || senha !== '1234567890') {
        return res.status(401).json({ message: 'Usuário ou senha inválidos' });
    }

    const token = jwt.sign({ nome: nome, senha: senha }, JWT_SECRET, {
        expiresIn: '2h',
    });

    const iat = new Date();
    const exp = new Date(iat.getTime() + 2 * 60 * 60 * 1000);

    return res.json({
        token_id: token,
        iat: iat.toISOString(),
        exp: exp.toISOString(),
    });
});

function autenticarJWT(req, res, next) {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ message: 'Token não fornecido' });
    }

    jwt.verify(token.split(' ')[1], JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Token inválido' });
        }

        req.user = decoded;
        next();
    });
}

app.get('/jwt/produtos', autenticarJWT, (req, res) => {
    const produtos = [
        { id: 1, nome: 'Produto 1', preco: 100 },
        { id: 2, nome: 'Produto 2', preco: 200 },
    ];

    res.json(produtos);
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
