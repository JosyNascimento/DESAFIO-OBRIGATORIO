let messages = [];

module.exports = (io, socket) => {
    console.log('Novo cliente conectado');

    socket.emit('messageHistory', messages);

    socket.on('newMessage', (data) => {
        const { user, message } = data;
        messages.push({ user, message });
        io.emit('messageHistory', messages);
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
};
