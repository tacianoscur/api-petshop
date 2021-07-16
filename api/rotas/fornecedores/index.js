const router = require('express').Router();
const TabelaFornecedor = require('./TabelaFornecedor');
const Fornecedor = require('./Fornecedor');
const SerializadorFornecedor = require('../../Serializador').SerializadorFornecedor;

router.options('/', (req, res) => {
    res.set('Access-Control-Allow-Methods', 'GET, POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.status(204);
    res.end();
});

router.get('/', async (req, res) => {
    const results = await TabelaFornecedor.listar();
    res.status(200);
    const serializador = new SerializadorFornecedor(
        res.getHeader('Content-Type'),
        ['empresa']
    );
    res.send(
        serializador.serializar(results)
    );
});

router.post('/', async (req, res, next) => {
    try{
        const dadosRecebidos = req.body;
        const fornecedor = new Fornecedor(dadosRecebidos);
        await fornecedor.create();

        res.status(201);
        const serializador = new SerializadorFornecedor(
            res.getHeader('Content-Type'),
            ['empresa']
        );
        res.send(
            serializador.serializar(fornecedor)
        );
    }
    catch (erro) {
        next(erro);
    }
    
});

router.options('/:id', (req, res) => {
    res.set('Access-Control-Allow-Methods', 'GET, PUT, DELETE');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.status(204);
    res.end();
});

router.get('/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const fornecedor = new Fornecedor({ id: parseInt(id) });

        await fornecedor.getById();

        res.status(200);
        const serializador = new SerializadorFornecedor(
            res.getHeader('Content-Type'), 
            ['empresa', 'email', 'dataCriacao', 'dataAtualizacao']
        );
        res.send(
            serializador.serializar(fornecedor)
        );
    }
    catch (erro) {
        next(erro);
    }
});

router.put('/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const dados = req.body;
        const dadosNovos = Object.assign({}, dados, { id: id });
    
        const fornecedor = new Fornecedor(dadosNovos);
        await fornecedor.update();
        res.status(204).end();
    }
    catch (erro) {
        next(erro);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const fornecedor = new Fornecedor({ id: id });
        await fornecedor.getById();
        await fornecedor.delete();
        res.status(204).end();
    }
    catch (erro) {
        next(erro);
    }
});

const routerProdutos = require('./produtos');

const verificarFornecedor = async (req, res, next) => {
    try {
        const id = req.params.idFornecedor;
        const fornecedor = new Fornecedor({ id: id });
        await fornecedor.getById();
        req.fornecedor = fornecedor;
        next();
    }
    catch(erro) {
        next(erro);
    }
};

router.use('/:idFornecedor/produtos', verificarFornecedor, routerProdutos);

module.exports = router;