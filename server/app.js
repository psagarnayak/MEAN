const app = require('express')();
const bodyParser = require('body-parser');
const postController = require('./controllers/post.controller')

app.use(bodyParser.json());

app.use('/api/posts', postController);

const port = process.env.port || 3000;
const server = app.listen(port, () => {
    console.log('Listening on: ' + port);
}
);
