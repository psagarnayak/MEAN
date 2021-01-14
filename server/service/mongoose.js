const mongoose = require('mongoose');

if (!process.env.MONGO_URL || !process.env.MONGO_USER || !process.env.MONGO_PWD) {
    console.log('MONGO_URL/MONGO_USER/MONGO_PWD environment variables not set. Unable to connect to DB. Terminating Server. ')
    process.kill(process.pid, 'SIGTERM');
}

mongoose.connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PWD}@${process.env.MONGO_URL}`,
    { useNewUrlParser: true, useUnifiedTopology: true }
).then(() => {
    console.log('Mongodb Connection Established!');
}).catch(error => {
    console.log('Error establising db connection! Terminating Server.', error);
    //Fatal error, terminate server.
    process.kill(process.pid, 'SIGTERM');
});

module.exports = mongoose;

