import React, { useState } from "react";
import { Mail, Send, CheckCircle, ShieldAlert, FileText } from "lucide-react";

interface ContactProps {
  onLogMessage: (level: "INFO" | "WARN" | "CORE" | "ERROR", text: string) => void;
}

export default function Contact({ onLogMessage }: ContactProps) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleSendPacket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !message) return;

    setIsSending(true);
    onLogMessage("INFO", `Encrypted secure email packet initialized: to J-X Core support.`);

    setTimeout(() => {
      setIsSending(false);
      setSentSuccess(true);
      onLogMessage("CORE", "Secure mail packet dispatched. Core confirmation code: MSG_SENT_042.");
      setSubject("");
      setMessage("");
      setEmail("");
    }, 2500);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8 text-white relative flex flex-col justify-center min-h-[60vh]">
      <div className="p-6 bg-black/45 border border-cyan-500/20 rounded-xl backdrop-blur-md relative overflow-hidden">
        {/* Glowing header stripe */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-fuchsia-400 to-transparent" />

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full border border-fuchsia-500/30 bg-fuchsia-500/5 flex items-center justify-center text-fuchsia-400 mx-auto mb-3">
            <Mail size={22} className={isSending ? "animate-pulse" : ""} />
          </div>
          <h2 className="text-lg font-mono font-bold text-white uppercase tracking-widest">TRANSMIT PACKET DECK</h2>
          <span className="text-[10px] font-mono text-cyan-400/50 uppercase">Secured Sub-Spatium Mail Pipeline</span>
        </div>

        {sentSuccess ? (
          <div className="text-center py-6 space-y-4 font-mono">
            <CheckCircle size={36} className="text-green-400 mx-auto animate-bounce" />
            <p className="text-xs text-green-300">SECURE DISPATCH SUCCESSFUL.</p>
            <p className="text-[9px] text-gray-500">PACKET_ID // #MSG_SENT_042 &bull; COMPILING RESPONSE SYNAPSES</p>
            <button
              onClick={() => setSentSuccess(false)}
              className="px-4 py-1.5 border border-white/10 hover:border-cyan-500/30 rounded text-[10px] uppercase font-bold text-cyan-400 font-mono cursor-pointer"
            >
              TRANSMIT_ANOTHER
            </button>
          </div>
        ) : isSending ? (
          <div className="text-center py-8 space-y-4 font-mono text-xs">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-fuchsia-400 mx-auto mb-2" />
            <p className="text-fuchsia-400 uppercase tracking-widest animate-pulse">ENCRYPTING PACKET LAYERS...</p>
            <p className="text-[10px] text-gray-500">Encoding with 4096-bit matrix layers.</p>
          </div>
        ) : (
          <form onSubmit={handleSendPacket} className="space-y-4">
            <div>
              <label className="block text-[9px] font-mono text-cyan-400/50 uppercase mb-1">Locator Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="captain@aurora.io"
                className="px-3 py-2 w-full bg-cyan-950/10 border border-cyan-500/20 rounded text-xs select-text focus:outline-none focus:border-cyan-400 text-white font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-[9px] font-mono text-cyan-400/50 uppercase mb-1">Thread Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g., Quantum core expansion parameters"
                className="px-3 py-2 w-full bg-cyan-950/10 border border-cyan-500/20 rounded text-xs select-text focus:outline-none focus:border-cyan-400 text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-[9px] font-mono text-cyan-400/50 uppercase mb-1">Instruction Payload Description</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message to J-X operations..."
                rows={4}
                className="px-3 py-2 w-full bg-cyan-950/10 border border-cyan-500/20 rounded text-xs select-text focus:outline-none focus:border-cyan-400 text-white"
                required
              />
            </div>

            <button
              type="submit"
              id="send-packet-button"
              className="w-full py-3 bg-fuchsia-500 hover:bg-fuchsia-400 active:bg-fuchsia-600 text-white font-semibold rounded-lg font-mono text-xs tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(217,70,239,0.3)]"
            >
              DISPATCH PACKET <Send size={12} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
