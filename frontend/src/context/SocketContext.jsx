import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import AuthContext from "./AuthContext.jsx";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (user) {
      const s = io("http://localhost:5000"); // change if backend is remote
      setSocket(s);
      return () => s.disconnect();
    }
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;
