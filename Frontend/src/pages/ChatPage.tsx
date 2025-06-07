import { useState, useEffect, useRef } from "react";

const WS_URL = "wss://chat-app-ux3n.onrender.com/";

const ChatPage = () => {
   const [mode, setMode] = useState<"join" | "create">("join");
  const [userEmail, setUserEmail] = useState("");
  const [roomId, setRoomId] = useState("");
  const [joined, setJoined] = useState(false);
  const [messages, setMessages] = useState<{ userEmail: string; text: string }[]>([]);
  const [text, setText] = useState("");
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (joined) {
      ws.current = new WebSocket(WS_URL);

      ws.current.onopen = () => {
        ws.current?.send(JSON.stringify({ type: "join", userEmail, roomId }));
      };

      ws.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === "message") {
          setMessages((prev) => [...prev, { userEmail: data.userEmail, text: data.text }]);
        }
      };

      ws.current.onclose = () => {
        console.log("WebSocket closed");
      };

      return () => {
        ws.current?.close();
      };
    }
  }, [joined]);

  const handleSend = () => {
    if (text && ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ type: "message", roomId, userEmail, text }));
      setMessages((prev) => [...prev, { userEmail, text }]);
      setText("");
    }
  };

  const generateRoomId = () => {
    return `room-${Math.random().toString(36).substr(2, 6)}`;
  };

 if (!joined) {
  return (
  <div className="min-h-screen flex flex-col justify-center items-center bg-black p-6 text-white relative overflow-hidden">
    <div className="absolute inset-0 opacity-10">
      <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
    </div>

    <div className="relative z-10 bg-black border border-gray-800 p-12 rounded-xl max-w-md w-full">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-light tracking-wide mb-1">CHAT ROOM</h1>
        <div className="w-16 h-px bg-white mx-auto opacity-20"></div>
      </div>

      <div className="mb-8 flex bg-gray-900 rounded-lg p-1 border border-gray-800">
        <button
          className={`flex-1 px-4 py-3 rounded-md text-sm font-medium transition-colors ${
            mode === "join" 
              ? "bg-white text-black" 
              : "text-gray-400 hover:text-white"
          }`}
          onClick={() => setMode("join")}
        >
          Join Room
        </button>
        <button
          className={`flex-1 px-4 py-3 rounded-md text-sm font-medium transition-colors ${
            mode === "create" 
              ? "bg-white text-black" 
              : "text-gray-400 hover:text-white"
          }`}
          onClick={() => {
            const newRoomId = generateRoomId();
            setRoomId(newRoomId);
            setMode("create");
          }}
        >
          Create Room
        </button>
      </div>

      <div className="mb-6">
        <label className="block text-xs text-gray-400 mb-2">EMAIL ADDRESS</label>
        <input
          placeholder="your@email.com"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
          className="w-full px-4 py-3 rounded bg-gray-900 border border-gray-800 text-white placeholder-gray-600 focus:outline-none focus:border-gray-500 transition-colors"
          type="email"
        />
      </div>

      {mode === "join" ? (
        <div className="mb-8">
          <label className="block text-xs text-gray-400 mb-2">ROOM ID</label>
          <input
            placeholder="Enter room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="w-full px-4 py-3 rounded bg-gray-900 border border-gray-800 text-white placeholder-gray-600 focus:outline-none focus:border-gray-500 transition-colors"
          />
        </div>
      ) : (
        <div className="mb-8 p-4 bg-gray-900 rounded border border-gray-800">
          <p className="text-xs text-gray-400 mb-1">ROOM ID</p>
          <div className="flex items-center justify-between">
            <span className="text-white font-mono text-sm tracking-wide">{roomId}</span>
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        </div>
      )}

      <button
        onClick={() => {
          if (userEmail && roomId) setJoined(true);
          else alert("Please enter your email and room ID");
        }}
        className="w-full px-6 py-3 bg-white text-black font-medium rounded hover:bg-gray-100 transition-colors border border-white"
      >
        {mode === "join" ? "JOIN ROOM" : "CREATE & JOIN"}
      </button>

      <div className="mt-10 flex justify-center">
        <div className="w-1 h-1 bg-white rounded-full opacity-30"></div>
      </div>
    </div>
  </div>
);
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-6 flex flex-col items-center relative">
  <div className="absolute inset-0 opacity-5">
    <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse"></div>
    <div className="absolute bottom-10 right-10 w-48 h-48 bg-white rounded-full blur-3xl animate-pulse delay-1000"></div>
  </div>

  <div className="relative z-10 w-full max-w-4xl flex flex-col h-screen">
    <div className="bg-gradient-to-r from-gray-900 to-black border border-gray-700 rounded-t-2xl p-6 shadow-2xl">
      <h2 className="text-white text-3xl font-bold text-center bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
        Room ID: {roomId}
      </h2>
      <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent mx-auto mt-2 opacity-50"></div>
    </div>

    <div className="flex-1 bg-gradient-to-b from-white via-gray-50 to-white border-x border-gray-300 overflow-y-auto p-6 flex flex-col space-y-4 shadow-inner">
      {messages.map((msg, idx) => {
        const isUser = msg.userEmail === userEmail;
        return (
          <div key={idx} className={`flex mb-3 ${isUser ? "justify-end" : "justify-start"} animate-fade-in`}>
            <div
              className={`max-w-xs lg:max-w-md px-6 py-3 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-200 ${
                isUser 
                  ? "bg-gradient-to-br from-black to-gray-800 text-white rounded-br-md border-2 border-gray-700" 
                  : "bg-gradient-to-br from-gray-600 to-gray-700 text-white rounded-bl-md border-2 border-gray-500"
              }`}
            >
  
              <div className={`absolute w-0 h-0 ${
                isUser 
                  ? "right-0 bottom-0 border-l-8 border-l-black border-b-8 border-b-transparent translate-x-2" 
                  : "left-0 bottom-0 border-r-8 border-r-gray-600 border-b-8 border-b-transparent -translate-x-2"
              }`}></div>
              
              <span className="block text-sm leading-relaxed font-medium">{msg.text}</span>
              
              <div className="flex justify-end mt-2">
                <span className="text-xs text-gray-300 opacity-70">
                  {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>
            </div>
          </div>
        );
      })}
      
 
      <div className="h-4"></div>
    </div>

    <div className="bg-gradient-to-r from-gray-900 to-black border border-gray-700 rounded-b-2xl p-6 shadow-2xl">
      <div className="flex space-x-4 items-end max-w-2xl mx-auto">
        <div className="flex-grow relative">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-600 rounded-2xl blur opacity-30"></div>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type your message..."
            className="relative w-full bg-gradient-to-r from-black to-gray-900 border-2 border-gray-600 rounded-2xl px-6 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition-all duration-300 hover:border-gray-500 shadow-inner"
          />
        </div>

        <button
          onClick={handleSend}
          className="bg-gradient-to-r from-white to-gray-100 hover:from-gray-100 hover:to-gray-200 text-black px-8 py-4 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl border-2 border-transparent hover:border-gray-300 flex items-center space-x-2"
        >
          <span>Send</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>

      <div className="flex justify-center mt-4 space-x-2">
        <div className="w-2 h-2 bg-white rounded-full opacity-20 animate-pulse"></div>
        <div className="w-2 h-2 bg-white rounded-full opacity-40 animate-pulse delay-200"></div>
        <div className="w-2 h-2 bg-white rounded-full opacity-60 animate-pulse delay-400"></div>
      </div>
    </div>
  </div>
</div>
  );
};

export default ChatPage;
