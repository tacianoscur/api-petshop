const router = require('express').Router({ mergeParams: true });
const TabelaProduto = require('./TabelaProduto');
const Produto = require('./Produto');
const SerializadorProduto = require('../../../Serializador').SerializadorProduto;

router.options('/', (req, res) => {
    res.set('Access-Control-Allow-Methods', 'GET, POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.status(204);
    res.end();
});

router.get('/', async (req, res) => {
    const idFornecedor = req.fornecedor.id;
    const produtos = await TabelaProduto.listar(idFornecedor);
    const serializador = new SerializadorProduto(res.getHeader('Content-Type'));
    res.send(
        serializador.serializar(produtos)
    );
});

router.post('/', async (req, res, next) => {
    try {
        const idFornecedor = req.fornecedor.id;
        const dadosRecebidos = req.body;
        const dados = Object.assign({}, dadosRecebidos, { fornecedor: idFornecedor });

        const produto = new Produto(dados);
        await produto.create();
        const serializador = new SerializadorProduto(res.getHeader('Content-Type'));
        res.set('ETag', produto.versao);
        const timestamp = (new Date(produto.dataAtualizacao)).getTime();
        res.set('Last-Modified', timestamp);
        res.set('Location', `/api/fornecedores${produto.fornecedor}/produtos/${[produto.id]}`);
        res.status(201);
        res.send(
            serializador.serializar(produto)
        );
    }
    catch(erro) {
        next(erro);
    }
});

router.options('/:id', (req, res) => {
    res.set('Access-Control-Allow-Methods', 'GET, PUT, DELETE, HEAD');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.status(204);
    res.end();
});

router.delete('/:id', async (req, res, next) => {
    try {
        const dados = {
            id: req.params.id,
            fornecedor: req.fornecedor.id
        };
    
        const produto = new Produto(dados);
        await produto.delete();
        res.status(204);
        res.end();
    }
    catch(erro) {
        next(erro);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const dados = {
            id: req.params.id,
            fornecedor: req.fornecedor.id
        };
    
        const produto = new Produto(dados);
        await produto.getById();
        const serializador = new SerializadorProduto(
            res.getHeader('Content-Type'),
            ['preco', 'estoque', 'fornecedor', 'dataCriacao', 'dataAtualizacao', 'versao']
        );
        res.set('ETag', produto.versao);
        const timestamp = (new Date(produto.dataAtualizacao)).getTime();
        res.set('Last-Modified', timestamp);
        res.status(200);
        res.send(
            serializador.serializar(produto)
        );
    }
    catch(erro) {
        next(erro);
    }
});

router.head('/:id', async (req, res, next) => {
    try {
        const dados = {
            id: req.params.id,
            fornecedor: req.fornecedor.id
        };
    
        const produto = new Produto(dados);
        await produto.getById();
        res.set('ETag', produto.versao);
        const timestamp = (new Date(produto.dataAtualizacao)).getTime();
        res.set('Last-Modified', timestamp);
        res.status(200);
        res.end();
    }
    catch(erro) {
        next(erro);
    }
});

router.put('/:id', async (req, res, next) => {
    try {
        const dados = Object.assign({}, req.body, {
            id: req.params.id,
            fornecedor: req.fornecedor.id
        });

        const produto = new Produto(dados);
        await produto.update();
        await produto.getById();
        res.set('ETag', produto.versao);
        const timestamp = (new Date(produto.dataAtualizacao)).getTime();
        res.set('Last-Modified', timestamp);
        res.status(204);
        res.end();
    }
    catch(erro) {
        next(erro);
    }
});

router.options('/:id/diminuir', (req, res) => {
    res.set('Access-Control-Allow-Methods', 'POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.status(204);
    res.end();
});

router.post('/:id/diminuir', async (req, res, next) => {
    try {
        const dados = {
            id: req.params.id,
            fornecedor: req.fornecedor.id
        };
    
        const produto = new Produto(dados);
        await produto.getById();
        produto.estoque = produto.estoque - req.body.quantidade;

        await produto.diminuirEstoque();
        await produto.getById();
        res.set('ETag', produto.versao);
        const timestamp = (new Date(produto.dataAtualizacao)).getTime();
        res.set('Last-Modified', timestamp);
        res.status(204);
        res.end();
    }
    catch(erro) {
        next(erro);
    }
});

module.exports = router;