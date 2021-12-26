require("dotenv").config();
const io = require("socket.io")(process.env.PORT || 4000);

const users = {};

io.on("connection", (socket) => {
	// new user joined
	socket.on("new-user-joined", (name) => {
		users[socket.id] = name;
		socket.broadcast.emit("user-joined", name);
	});

	// send message to group
	socket.on("send", (message) => {
		socket.broadcast.emit("recieve", {
			message: message,
			name: users[socket.id],
		});
	});

	// user left the group
	socket.on("disconnect", (message) => {
		socket.broadcast.emit("left", users[socket.id]);
		delete users[socket.id];
	});
});
