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

const db = client.db('blog');

let posts = db.collection('posts');

/* -------------------------------------------------------------------------- */
/*                                   CONFIG                                   */
/* -------------------------------------------------------------------------- */
app.use(express.static('./public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/* -------------------------------------------------------------------------- */
/*                                     EJS                                    */
/* -------------------------------------------------------------------------- */
app.set('view engine', 'ejs');
app.set('views', './views');

app.post('/cadastrar_post', async (req, res) => {
    console.log('ROTA ACESSADA!');
    console.log(req.body);

    const { titulo, resumo, conteudo } = req.body;

    const data = {
        dbTitulo: titulo,
        dbResumo: resumo,
        dbConteudo: conteudo
    };

    try {
        const result = await posts.insertOne(data);

        console.log(`resultado: ${JSON.stringify(result)}`);

        res.render('res_usuario.ejs', {
            resposta: 'post criado com sucesso'
        });
    } catch (err) {
        res.render('res_usuario.ejs', {
            resposta: `erro ao cadastrar post: ${JSON.stringify(err)}`
        });
    }
});

app.get('/blog.ejs', async (req, res) => {
    try {
        const result = await posts.find().toArray();

        res.render('blog.ejs', {
            posts: result
        });
    } catch (err) {
        res.render('blog.ejs', {
            resposta: `erro ao exibir posts: ${JSON.stringify(err)}`
        });
    }
});

app.listen(port, () => {
    console.log(`servidor rodando em: http://localhost:${port}`);
});