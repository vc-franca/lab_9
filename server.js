import express from 'express';
import mongodb from 'mongodb';
import bodyParser from 'body-parser';

const app = express();
const port = 80;

/* -------------------------------------------------------------------------- */
/*                                    MONGO                                   */
/* -------------------------------------------------------------------------- */
const MongoClient = mongodb.MongoClient;
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

const db = client.db('p2_academia');

let alunos = db.collection('alunos');

/* -------------------------------------------------------------------------- */
/*                                   CONFIG                                   */
/* -------------------------------------------------------------------------- */
app.use(express.static('./views'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/* -------------------------------------------------------------------------- */
/*                                     EJS                                    */
/* -------------------------------------------------------------------------- */
app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', async (req, res) => {
    try {
        const result = await alunos.find().toArray();

        res.render('lista_de_alunos.ejs', {
            alunos: result
        });
    } catch (err) {
        res.render('lista_de_alunos.ejs', {
            alunos: `erro ao exibir alunos: ${JSON.stringify(err)}`
        });
    }
});

app.post('/cadastrar_aluno', async (req, res) => {
    const { nome, exercicio, carga } = req.body;

    if (isNaN(carga)) {
        return res.render('res_erro.ejs', {
            erro: 'a carga informada não é um valor válido'
        });
    }

    const data = {
        dbNome: nome,
        dbExercicio: exercicio,
        dbCarga: carga
    };

    try {
        const result = await alunos.insertOne(data);

        console.log(`resultado: ${JSON.stringify(result)}`);

        res.render('res_usuario.ejs', {
            resposta: 'aluno criado com sucesso',
            aluno: nome,
            carga: carga
        });
    } catch (err) {
        res.render('res_usuario.ejs', {
            resposta: `erro ao cadastrar aluno: ${err}`
        });
    }
});

// app.get('/lista_de_alunos.ejs', async (req, res) => {

// });

app.listen(port, () => {
    console.log(`servidor rodando em: http://localhost:${port}`);
});