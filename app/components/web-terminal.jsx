import React, { useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";

export default function Terminal() {
  const [history, setHistory] = useState([
    {
      command: "welcome",
      output: ["Bem-vindo ao Terminal Web v1.0.0", "Digite 'help' para ver os comandos disponíveis.", ""],
      timestamp: new Date(),
    },
  ]);
  const [currentInput, setCurrentInput] = useState("");
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [currentPath, setCurrentPath] = useState("remote");
  const [platform, setPlatform] = useState("web");
  const [system, setSystem] = useState("anonimo");

  const terminalRef = useRef(null);
  const inputRef = useRef(null);
  const socketRef = useRef(null);
  const [myself, setMyself] = useState("");
  const [token, setToken] = useState("");
  const [device, setDevice] = useState({});

  function generateToken(length = 16) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  // Só adiciona ao histórico imediatamente se for comando local
  const appendHistory = (cmd, output, isLocal = false) => {
    // Se não for comando local e não houver output, não adiciona ainda
    if (!isLocal && output === undefined) return;
    setHistory((prev) => [
      ...prev,
      {
        command: cmd ?? "",
        output: output !== undefined
          ? (Array.isArray(output) ? output : [output])
          : [],
        timestamp: new Date(),
      },
    ]);
  };

  const handleSubmit = async () => {
    const command = currentInput.trim();
    if (!command) return;

    setCommandHistory((prev) => [...prev, command]);
    setHistoryIndex(-1);
    setCurrentInput("");

    if (command === "clear") {
      setHistory([]);
      return;
    }

    if (command === "help") {
      appendHistory(command, [
        "Comandos disponíveis:",
        "  help          - Mostra esta ajuda",
        "  clear         - Limpa o terminal",
        "  shutdown      - Envia comando de desligar",
        "  show          - Mostra os tokens",
        "  device        - Informações do dispositivo",
        "",
      ]);
    } else if (command === "show") {
      appendHistory(command, [
        `Local  -> localhost\t\t\t${myself}`,
        `Remote -> ${device.user}\t\t\t${token}`,
      ]);
    } else if (command === "device") {
      appendHistory(command, [
        `TOKEN:\t\t${device.mytoken}`,
        `PLATFORM:\t${device.platform}`,
        `SYSTEM:\t\t${device.system}`,
        `USER:\t\t${device.user}`,
        `VERSION:\t${device.version}`,
      ]);
    } else if (command === "shutdown") {
      appendHistory(command, ["Enviando sinal..."]);
      try {
        const res = await fetch("/signal", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, myself, command }),
        });
        const msg = res.ok ? "Sinal enviado com sucesso." : `Erro: ${res.statusText}`;
        appendHistory(command, msg);
      } catch (err) {
        appendHistory(command, `Erro: ${err.message}`);
      }
    } else {
      try {
        await fetch("/command", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, myself, command }),
        });
      } catch (err) {
        appendHistory(command, `Erro: ${err.message}`);
      }
    }

    appendHistory(command);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(newIndex);
      setCurrentInput(commandHistory[newIndex] || "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const newIndex = historyIndex + 1;
      if (newIndex >= commandHistory.length) {
        setHistoryIndex(-1);
        setCurrentInput("");
      } else {
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[newIndex] || "");
      }
    }
  };

  useEffect(() => {
    const data = JSON.parse(sessionStorage.getItem("_selected_device") || "{}");
    const userToken = sessionStorage.getItem("_selected_token");
    const id = generateToken();

    setCurrentPath(data.user || "remote");
    setPlatform(data.platform || "web");
    setSystem(data.system || "anonimo");
    setDevice(data);
    setMyself(id);
    setToken(userToken);

    const socket = io();
    socketRef.current = socket;

    // socket.on("connect", () => {
    // appendHistory("Socket", "Conectado ao servidor");
    // });

    // socket.on(`info/${id}`, (data) => {
    //   appendHistory("info", data.message);
    // });

    socket.on(`response/${id}`, (data) => {
      appendHistory(data.command, data.stdout || "sem resposta");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
  }, [history]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="bg-gray-900 border border-gray-700 overflow-hidden rounded">
        <div className="bg-gray-800 px-4 py-2 flex items-center gap-2 border-b border-gray-700">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="text-gray-300 text-sm ml-4">Terminal Web</div>
        </div>

        <div
          ref={terminalRef}
          className="bg-gray-900 text-green-400 font-mono text-sm p-4 h-96 overflow-y-auto"
          onClick={() => inputRef.current?.focus()}
        >
          {history.map((entry, index) => (
            <div key={index} className="mb-2">
              {entry.command !== "welcome" && (
                <div className="flex">
                  <span className="text-purple-400">{currentPath}</span>
                  <span className="text-white">:</span>
                  <span className="text-blue-400">{platform}@</span>
                  <span className="text-white">$ </span>
                  <span className="text-green-400 ml-2">{entry.command}</span>
                </div>
              )}
              {entry.output.map((line, i) => (
                <div key={i} className="text-gray-300">{line}</div>
              ))}
            </div>
          ))}

          <div className="flex items-center">
            <span className="text-purple-400">{currentPath}</span>
            <span className="text-white">:</span>
            <span className="text-blue-400">{platform}@</span>
            <span className="text-white">$ </span>
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="ml-2 bg-transparent border-none outline-none text-green-400 flex-1 font-mono"
              autoComplete="off"
              spellCheck={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
