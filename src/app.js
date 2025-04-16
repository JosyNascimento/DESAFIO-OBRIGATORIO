// app.js
const express = require('express');
const mockingRouter = require('./routes/mocking.router');
const errorHandler = require('./utils/errors/errorHandler');
const exphbs = require('express-handlebars'); 
const path = require('path');
const app = express();

const PORT = 3001;

// Handlebars
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());

// Rotas
app.use('/', mockingRouter);

// Middleware de erro (deve ser o último)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
