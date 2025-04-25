require('dotenv').config();
const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const loggerMiddleware = require('./middlewares/logger.middleware');
const mockingRouter = require('./routes/mocking.router');
const testLoggerRouter = require('./routes/Logger.router');
const errorHandler = require('./utils/errors/errorHandler');

const app = express();
const port = process.env.PORT || 3000;

// Configuração do Handlebars
app.engine('handlebars', exphbs.engine({
  layoutsDir: path.join(__dirname, 'views', 'layouts'),
  defaultLayout: 'main',
  extname: 'handlebars'
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  res.render('home', { title: 'Página Inicial' });

});

// Middleware para logs
app.use(loggerMiddleware);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/loggerTest', testLoggerRouter);
app.use('/', mockingRouter);
app.use(errorHandler);

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

module.exports = app;
