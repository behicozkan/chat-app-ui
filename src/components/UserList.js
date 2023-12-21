// src/components/UserList.js
import React from "react";
import "./UserList.css";

function UserList({ users, onSelectUser }) {
  return (
    <div className="user-list">
      {users.map((user) => (
        <button
          key={user.id}
          className="user-button"
          onClick={() => onSelectUser(user)}
        >
          {user.name}
        </button>
      ))}
    </div>
  );
}

export default UserList;
