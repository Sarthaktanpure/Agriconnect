import { useState } from "react";
import axios from "axios";

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Hi! I'm AgriBot 🌾 Ask me anything about selling crops, pricing, or farming!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setInput("");
    setLoading(true);

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/ai/chat`,
        { message: userMsg },
      );
      setMessages((prev) => [...prev, { role: "bot", text: data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Sorry, I'm unavailable right now. Try again!" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 bg-green-600 hover:bg-green-700 text-white rounded-full w-14 h-14 text-2xl shadow-lg flex items-center justify-center"
      >
        {open ? "✕" : "🌾"}
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
          <div className="bg-green-600 text-white px-4 py-3 font-semibold text-sm">
            🌾 AgriBot — Farming Assistant
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2 max-h-72">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`text-xs px-3 py-2 rounded-xl max-w-[85%] ${
                    m.role === "user"
                      ? "bg-green-600 text-white rounded-br-none"
                      : "bg-gray-100 text-gray-800 rounded-bl-none"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-500 text-xs px-3 py-2 rounded-xl rounded-bl-none">
                  Typing...
                </div>
              </div>
            )}
          </div>

          <div className="flex border-t border-gray-200 p-2 gap-2">
            <input
              className="flex-1 text-xs border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-green-500"
              placeholder="Ask about crops, prices..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
            />
            <button
              onClick={send}
              className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-2 rounded-lg"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};


export default ChatBot;