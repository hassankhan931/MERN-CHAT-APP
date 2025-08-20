import { useEffect, useState } from "react";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import "./ChatList.css"; // Assuming you have a CSS file for styling

const ChatList = ({ currentUser, selectUser }) => {
  const [users, setUsers] = useState([]);
  const [lastMessages, setLastMessages] = useState({});

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("/api/users", {
          headers: { Authorization: `Bearer ${currentUser.token}` }
        });
        setUsers(res.data.filter(user => user._id !== currentUser.id));
      } catch (err) {
        console.error("Failed to load users:", err);
      }
    };

    fetchUsers();
  }, [currentUser]);

  useEffect(() => {
    const fetchLastMessages = async () => {
      const messages = {};
      for (const user of users) {
        try {
          const res = await axios.get(`/api/messages/last?with=${user._id}`, {
            headers: { Authorization: `Bearer ${currentUser.token}` }
          });
          if (res.data) messages[user._id] = res.data;
        } catch (err) {
          console.error(`Failed to load messages with ${user._id}:`, err);
        }
      }
      setLastMessages(messages);
    };

    if (users.length) fetchLastMessages();
  }, [users, currentUser]);

  return (
    <div className="chat-list-container">
      {users.map(user => {
        const lastMsg = lastMessages[user._id];
        return (
          <div 
            key={user._id}
            className="chat-list-item"
            onClick={() => selectUser(user)}
          >
            <div className="chat-list-item-header">
              <span className="chat-list-username">{user.username}</span>
              {lastMsg && (
                <span className="chat-list-time">
                  {formatDistanceToNow(new Date(lastMsg.createdAt))} ago
                </span>
              )}
            </div>
            {lastMsg && (
              <div className="chat-list-preview">
                {(lastMsg.from === currentUser.id ? "You: " : "") + 
                 (lastMsg.message || "📷 Image")}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ChatList;