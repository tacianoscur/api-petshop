const express = require('express');
const app = express();
const config = require('config');
const NaoEncontrado = require('./erros/NaoEncontrado');
const CampoInvalido = require('./erros/CampoInvalido');
const DadosNaoFornecidos = require('./erros/DadosNaoFornecidos');
const ValorNaoSuportado = require('./erros/ValorNaoSuportado');
const SemEstoqueDisponivel = require('./erros/SemEstoqueDisponivel');
const SerializadorErro = require('./Serializador').SerializadorErro;
const formats = require('./Serializador').formats;

app.use(express.json());

app.use((req, res, next) => {
    let formatoRequisitado = req.header('Accept');

    if (formatoRequisitado === '*/*') {
        formatoRequisitado = 'application/json';
    }

    if (formats.indexOf(formatoRequisitado) === -1) {
        res.status(406).end();
        return;
    }

    res.setHeader('Content-Type', formatoRequisitado);
    next();
});

app.use((req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    next();
});

const routerFornecedores = require('./rotas/fornecedores');
app.use('/api/fornecedores', routerFornecedores);

const routerFornecedoresV2 = require('./rotas/fornecedores/routes.v2');
app.use('/api/v2/fornecedores', routerFornecedoresV2);

app.use((erro, req, res, next) => {
    let status = 500;
    
    if (erro instanceof NaoEncontrado) {
        status = 404;
    }

    if (erro instanceof CampoInvalido || erro instanceof DadosNaoFornecidos || erro instanceof SemEstoqueDisponivel) {
        status = 400;
    }

    if (erro instanceof ValorNaoSuportado) {
        status = 406;
    }

    res.status(status);
    const serializador = new SerializadorErro(res.getHeader('Content-Type'));
    res.send(
        serializador.serializar({
            id: erro.idErro,
            mensagem: erro.message
        })
    );
});

app.listen(config.get('api.port'), () => {
    console.log('API rodando com sucesso!');
});