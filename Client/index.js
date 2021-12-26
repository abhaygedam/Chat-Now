const socket = io("https://multiuserchatapp.herokuapp.com/", {
	transports: ["websocket"],
});

const form = document.getElementById("inputBox");
const messageInput = document.getElementById("messageInput");
const messageContainer = document.querySelector(".chatBox");

// append function to show the message into the chat box
const append = (message, position) => {
	const messageElement = document.createElement("div");
	let markup = `
        <h4>${message.name}:</h4>
        <p>${message.message}</p>	
    `;
	messageElement.innerHTML = markup;
	// messageElement.innerText = message;
	messageElement.classList.add("message");
	messageElement.classList.add(position);
	messageContainer.append(messageElement);
};

// take typed message and send to socket
form.addEventListener("submit", (e) => {
	e.preventDefault();
	const message = messageInput.value;
	const data = {
		name: "You",
		message: message,
	};
	append(data, "right");
	// append(`You: ${message}`, "right");
	socket.emit("send", message);
	messageInput.value = "";
});

const name = prompt("Enter your name to join chat room");

socket.emit("new-user-joined", name);

// user joined chat room
socket.on("user-joined", (name) => {
	if (name != null) {
		$(function () {
			toastr.info(`${name} joined the chat`);
		});
	}
});

// recieve message from socket and call append function
socket.on("recieve", (data) => {
	append(data, "left");
});

// user left the chat app
socket.on("left", (name) => {
	if (name != null) {
		$(function () {
			toastr.warning(`${name} left the chat`);
		});
	}
});
