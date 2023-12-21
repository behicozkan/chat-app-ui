//ChatRoom
import React, { useState, useEffect } from "react";
import "./ChatRoom.css";

function ChatRoom({ user, senderUser }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [ws, setWs] = useState(null);

  useEffect(() => {
    // WebSocket bağlantısını aç
    const newWebSocket = new WebSocket(
      `ws://127.0.0.1:8001/ws/${senderUser.Id}`
    );
    setWs(newWebSocket);

    newWebSocket.onmessage = (event) => {
      const receivedMessage = JSON.parse(event.data);
      console.log(receivedMessage);
      if (
        (receivedMessage.ReceiverId === senderUser.Id &&
          receivedMessage.UserId === user.id) ||
        (receivedMessage.UserId === senderUser.Id &&
          receivedMessage.ReceiverId === user.id) ||
        (receivedMessage.ReceiverId === 1 && user.id === 1)
      )
        setMessages((prevMessages) => [...prevMessages, receivedMessage]);
    };

    newWebSocket.onerror = (event) => {
      console.error("WebSocket error observed:", event);
    };
    // Sohbet geçmişini veya broadcast mesajlarını yükle
    const fetchChatHistory = async () => {
      const endpoint =
        user.id === 1
          ? `http://127.0.0.1:8000/messages/getbroadcastmessages?skip=0&limit=100`
          : `http://127.0.0.1:8000/messages/getbyusershistory/${senderUser.Id}/${user.id}?skip=0&limit=100`;

      try {
        const response = await fetch(endpoint);
        if (response.ok) {
          const data = await response.json();
          setMessages(data);
        } else {
          console.error("Mesajlar yüklenemedi.");
        }
      } catch (error) {
        console.error("Bir hata oluştu:", error);
      }
    };

    if (user && senderUser) {
      console.log(users);
      fetchChatHistory();
    }

    return () => {
      newWebSocket.close();
    };
  }, [user, senderUser]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/users/getlist`);
        if (response.ok) {
          const userList = await response.json();
          setUsers(userList);
        } else {
          console.error("Kullanıcılar yüklenemedi.");
        }
      } catch (error) {
        console.error("Bir hata oluştu:", error);
      }
    };

    fetchUsers();
  }, [senderUser, user]);

  const getUsernameById = (userId) => {
    const user = users.find((u) => u.Id === userId);
    return user ? user.Name : "Bilinmeyen Kullanıcı";
  };

  const sendMessage = () => {
    if (message.trim() && ws) {
      const msgData = {
        UserId: senderUser.Id,
        ReceiverId: user.id,
        Message: message,
      };
      ws.send(JSON.stringify(msgData)); // WebSocket üzerinden mesaj gönder

      if (user.id != 1) {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            UserId: senderUser.Id,
            Message: message,
          },
        ]);
      }
      setMessage(""); // Mesaj gönderildikten sonra input'u temizle
    }
  };

  return (
    <div className="chat-room">
      <h2>{user ? user.name : "Genel Chat Odası"}</h2>
      <div className="messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${
              msg.UserId === senderUser.Id ? "sender" : "receiver"
            }`}
          >
            <strong>
              {getUsernameById(msg.UserId)}
              {msg.ReceiverId === 1 ? " (Broadcast)" : ""}:
            </strong>{" "}
            {msg.Message}
          </div>
        ))}
      </div>
      <div className="message-input">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={"Mesaj yaz..."}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Gönder</button>
      </div>
    </div>
  );
}

export default ChatRoom;
