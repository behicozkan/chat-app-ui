//Mainchat.js
import React, { useState, useEffect } from "react";
import UserList from "./UserList";
import ChatRoom from "./ChatRoom";
import "../App.css";
import { useLocation } from "react-router-dom";

function MainChat() {
  const location = useLocation();
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const senderUser = location.state?.user;

  useEffect(() => {
    fetch("http://127.0.0.1:8000/users/getlist?skip=0&limit=10")
      .then((response) => response.json())
      .then((data) => {
        const loadedUsers = data.map((user) => ({
          id: user.Id,
          name: user.Name,
        }));
        setUsers(loadedUsers);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, []);

  return (
    <div className="app-container">
      <UserList users={users} onSelectUser={setSelectedUser} />
      <ChatRoom user={selectedUser} senderUser={senderUser} />
    </div>
  );
}

export default MainChat;
