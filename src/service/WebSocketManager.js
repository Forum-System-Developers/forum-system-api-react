import SERVER_URL from "./server";

const createWebSocket = (onMessageHandler) => {
    const socket = new WebSocket(`wss://${SERVER_URL}/ws/connect`);


    socket.onopen = () => {
        const token = localStorage.getItem("token");
        if (!token) {
            return;
        }
        const authData = { type: 'auth', token: token };
        const serializedAuthData = JSON.stringify(authData);
        socket.send(serializedAuthData);
        console.log('WebSocket Client Connected');
    };

    socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        onMessageHandler(message);
    };

    socket.onerror = (error) => {
        console.error('WebSocket error:', error.message);
    };

    return socket;
};

export default createWebSocket;
