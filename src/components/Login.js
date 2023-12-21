import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const checkUsernameAndNavigate = async () => {
    try {
      let response = await fetch(
        `http://127.0.0.1:8000/users/getbyusername/${username}`
      );

      let user;
      if (response.ok) {
        user = await response.json();
      } else {
        const createUserResponse = await fetch(
          "http://127.0.0.1:8000/users/create",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              Name: username,
              Username: username,
            }),
          }
        );

        if (!createUserResponse.ok) throw new Error("Failed to create user");

        user = await createUserResponse.json();
      }

      navigate("/main", { state: { user } });
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred!");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      checkUsernameAndNavigate();
    } else {
      alert("Please enter a username.");
    }
  };

  return (
    <div className="container">
      <div className="title">Chat Uygulamasına Hoşgeldin</div>
      <div className="subtitle">Chat'e başlamak için lütfen adınzı girin</div>
      <form onSubmit={handleSubmit} className="Login">
        <label>
          Kullanıcı Adı:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <button type="submit">Katıl</button>
      </form>
    </div>
  );
}

export default Login;
