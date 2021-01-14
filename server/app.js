const app = require('express')();
const bodyParser = require('body-parser');
const postController = require('./controllers/post.controller')
const authController = require('./controllers/auth.controller');

app.use(bodyParser.json());

app.use((req, res, next) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    next();
});

app.use('/api/posts', postController);
app.use('/api/auth', authController);

const port = process.env.port || 3000;
const server = app.listen(port, () => {
    console.log('Listening on: ' + port);
}
);
