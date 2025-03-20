// Desafio10-ReestruturaçãodoServidor/src/app.js
require('dotenv').config();
const express = require("express");
const http = require("http");
const handlebars = require("express-handlebars");
const path = require('path');
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
const { Server } = require("socket.io");
const Message = require('./dao/models/message.model');
const passport = require('./config/passport.config');
const authRouter = require('./routes/auth.router');
const mongoStore = require("connect-mongo");
const viewRouter = require("./routes/view.router");
const userRouter = require("./routes/user.router");
const cartRouter = require("./routes/cart.router");
const sessionRouter = require("./routes/session.router");

const productRouter = require('./routes/product.router');
const chatRoutes = require('./routes/chat.router'); 
const session = require('express-session');
const connectDB = require("./config/connectDB");

connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

io.on('connection', async (socket) => {
    console.log('Um cliente conectou');
    const mensagens = await Message.find();
    socket.emit('mensagens', mensagens);
    socket.on('mensagem', (mensagem) => {
        const novaMensagem = new Message({ texto: mensagem });
        novaMensagem.save()
            .then(() => {
                io.emit('mensagem', mensagem);
            })
            .catch((error) => console.error('Erro ao salvar mensagem:', error));
    });
    socket.on('disconnect', () => {
        console.log('Um cliente desconectou');
    });
});
console.log("Passport importado em app.js:", passport);

console.log('GITHUB_CLIENT_ID:', process.env.GITHUB_CLIENT_ID);
console.log('GITHUB_CLIENT_SECRET:', process.env.GITHUB_CLIENT_SECRET);

app.engine("handlebars", handlebars.engine({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    }
}));

app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));
app.use(cookieParser());
app.use('/cookies', require('./routes/cookie.router'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(path.join(__dirname, "public")));

app.use(session({
    store: mongoStore.create({
        mongoUrl: process.env.MONGO_URL,
        ttl: 15 * 60 * 60
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());
console.log("Passport inicializado.");

handlebars.create({
    helpers: {
        calculateTotal: (price, quantity) => (price * quantity).toFixed(2),
    },
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Usar o roteador de autenticação
app.use('/', authRouter);
app.use("/api/sessions", sessionRouter);
app.use("/carts", cartRouter);
app.use("/products", productRouter);
app.use('/', viewRouter);
app.use('/', userRouter);
app.use("/chat", chatRoutes);
app.use("/api", productRouter);


app.get("/", (req, res) => res.render("home", { title: "Página Inicial" }));
app.get("/register", (req, res) => res.render("register", { title: "Register" }));
app.get("/list", (req, res) => res.render("list", { title: "List" }));
app.get("/realtimeproducts", (req, res) => res.render("realTimeProducts", { title: "Produtos em Tempo Real" }));
app.get("/chat", (req, res) => res.render("chat", { title: "Chat em Tempo Real" }));
app.get('/perfil', (req, res) => {
    return res.send('Página de perfil');
});



const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));