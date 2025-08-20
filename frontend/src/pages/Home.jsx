// import React, { useState, useEffect, useContext } from "react";
// import axios from "axios";
// import ChatBox from "../components/ChatBox.jsx";
// import AuthContext from "../context/AuthContext.jsx";
// import { FiSearch, FiUser } from "react-icons/fi";

// const Home = () => {
//   const { user } = useContext(AuthContext);
//   const [users, setUsers] = useState([]);
//   const [search, setSearch] = useState("");
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);

//   // Fetch all users except logged-in user
//   useEffect(() => {
//     const fetchUsers = async () => {
//       if (!user) return;
//       setIsLoading(true);
//       try {
//         const res = await axios.get(
//           `http://localhost:5000/api/users?search=${search}`,
//           { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
//         );
//         const filtered = res.data.filter((u) => u._id !== user.id);
//         setUsers(filtered);
//       } catch (err) {
//         console.error("Error fetching users:", err.response?.data || err);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     const debounceTimer = setTimeout(() => {
//       fetchUsers();
//     }, 300);

//     return () => clearTimeout(debounceTimer);
//   }, [search, user]);

//   return (
//     <div className="flex h-screen bg-gradient-to-br from-gray-50 to-blue-50">
//       {/* Sidebar / User List */}
//       <div className="flex flex-col w-full overflow-hidden bg-white shadow-lg md:w-1/3">
//         <div className="p-4 border-b border-gray-200">
//           <h2 className="text-2xl font-bold text-gray-800">Messages</h2>
//           <div className="relative mt-4">
//             <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//               <FiSearch className="text-gray-400" />
//             </div>
//             <input
//               type="text"
//               placeholder="Search users..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="w-full py-2 pl-10 pr-4 transition-all border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             />
//           </div>
//         </div>

//         {isLoading ? (
//           <div className="flex items-center justify-center flex-1">
//             <div className="w-8 h-8 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
//           </div>
//         ) : (
//           <ul className="flex-1 overflow-y-auto">
//             {users.length > 0 ? (
//               users.map((u) => (
//                 <li
//                   key={u._id}
//                   onClick={() => setSelectedUser(u)}
//                   className={`flex items-center px-4 py-3 border-b border-gray-100 cursor-pointer transition-all ${
//                     selectedUser?._id === u._id
//                       ? "bg-blue-50"
//                       : "hover:bg-gray-50"
//                   }`}
//                 >
//                   <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 text-blue-600 bg-blue-100 rounded-full">
//                     <FiUser size={18} />
//                   </div>
//                   <div className="ml-3">
//                     <p className="text-sm font-medium text-gray-900">
//                       {u.username}
//                     </p>
//                     <p className="text-xs text-gray-500">Online</p>
//                   </div>
//                 </li>
//               ))
//             ) : (
//               <div className="flex flex-col items-center justify-center h-full text-gray-400">
//                 <FiUser size={48} className="mb-2" />
//                 <p>No users found</p>
//               </div>
//             )}
//           </ul>
//         )}
//       </div>

//       {/* Chat Box */}
//       <div className="flex flex-col flex-1 md:flex">
//         {selectedUser ? (
//           <ChatBox chatWith={selectedUser} />
//         ) : (
//           <div className="flex flex-col items-center justify-center flex-1 m-4 bg-white shadow-sm rounded-xl">
//             <div className="max-w-md p-6 text-center">
//               <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 rounded-full bg-blue-50">
//                 <FiUser size={32} className="text-blue-500" />
//               </div>
//               <h3 className="mb-2 text-lg font-medium text-gray-900">
//                 Select a conversation
//               </h3>
//               <p className="text-gray-500">
//                 Choose from your existing conversations or search for users to
//                 start a new chat.
//               </p>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Mobile view when chat is selected */}
//       {selectedUser && (
//         <div className="absolute inset-0 z-10 bg-white md:hidden">
//           <ChatBox chatWith={selectedUser} onBack={() => setSelectedUser(null)} />
//         </div>
//       )}
//     </div>
//   );
// };

// export default Home;

import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import ChatBox from "../components/ChatBox.jsx";
import AuthContext from "../context/AuthContext.jsx";
import {
  FiSearch,
  FiUser,
  FiChevronLeft,
  FiMessageSquare,
} from "react-icons/fi";

const Home = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

  // Check for mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch all users except logged-in user
  useEffect(() => {
    const fetchUsers = async () => {
      if (!user) return;
      setIsLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:5000/api/users?search=${search}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const filtered = res.data.filter((u) => u._id !== user.id);
        setUsers(filtered);
      } catch (err) {
        console.error("Error fetching users:", err.response?.data || err);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchUsers();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [search, user]);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar / User List - Hidden on mobile when chat is selected */}
      {(!isMobileView || !selectedUser) && (
        <div
          className={`flex flex-col w-full h-full overflow-hidden bg-white shadow-sm md:w-96 md:border-r md:border-gray-200 ${
            selectedUser && isMobileView ? "hidden" : "block"
          }`}
        >
          {/* Header */}
          <div className="p-4 bg-white border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">Messages</h2>
              {isMobileView && selectedUser && (
                <button
                  onClick={() => setSelectedUser(null)}
                  className="p-1 text-gray-500 rounded-full hover:bg-gray-100"
                >
                  <FiChevronLeft size={20} />
                </button>
              )}
            </div>

            {/* Search Bar */}
            <div className="relative mt-4">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full py-2 pl-10 pr-4 text-sm text-black placeholder-gray-500 transition-all bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* User List */}
          {isLoading ? (
            <div className="flex items-center justify-center flex-1">
              <div className="w-8 h-8 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
            </div>
          ) : (
            <ul className="flex-1 overflow-y-auto">
              {users.length > 0 ? (
                users.map((u) => (
                  <li
                    key={u._id}
                    onClick={() => setSelectedUser(u)}
                    className={`flex items-center px-4 py-3 border-b border-gray-100 cursor-pointer transition-all ${
                      selectedUser?._id === u._id
                        ? "bg-blue-50"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="relative flex-shrink-0">
                      <div className="flex items-center justify-center w-10 h-10 text-blue-600 bg-blue-100 rounded-full">
                        <FiUser size={18} />
                      </div>
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                    </div>
                    <div className="ml-3 overflow-hidden">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {u.username}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        Hey there! I'm using this app
                      </p>
                    </div>
                    <div className="ml-auto text-xs text-gray-400">2m</div>
                  </li>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-6 text-center text-gray-400">
                  <div className="p-4 mb-3 bg-gray-100 rounded-full">
                    <FiMessageSquare size={32} />
                  </div>
                  <h3 className="mb-1 text-lg font-medium text-gray-700">
                    No conversations yet
                  </h3>
                  <p className="max-w-xs text-sm text-gray-500">
                    {search
                      ? "No users match your search"
                      : "Start a new conversation by searching for users"}
                  </p>
                </div>
              )}
            </ul>
          )}
        </div>
      )}

      {/* Chat Box */}
      <div
        className={`flex-1 flex flex-col ${
          !selectedUser && isMobileView ? "hidden" : "flex"
        }`}
      >
        {selectedUser ? (
          <ChatBox
            chatWith={selectedUser}
            onBack={isMobileView ? () => setSelectedUser(null) : null}
          />
        ) : (
          <div className="flex flex-col items-center justify-center flex-1 p-6 bg-gray-50">
            <div className="max-w-md p-8 text-center bg-white shadow-sm rounded-xl">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-blue-50">
                <FiMessageSquare size={24} className="text-blue-500" />
              </div>
              <h3 className="mb-2 text-xl font-medium text-gray-900">
                {isMobileView ? "Select a chat" : "Welcome to your messages"}
              </h3>
              <p className="mb-6 text-gray-500">
                {isMobileView
                  ? "Choose a conversation to start chatting"
                  : "Select a conversation from the sidebar or search for users to start a new chat"}
              </p>
              {!isMobileView && (
                <button
                  onClick={() =>
                    document.querySelector('input[type="text"]')?.focus()
                  }
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Search for users
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
