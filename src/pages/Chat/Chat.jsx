import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useWorkspace } from "../../context/WorkspaceContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useLanguage } from "../../context/LanguageContext.jsx";
import {
  getChannels,
  createChannel,
  getOrCreateDirectChannel,
  getChannelMessages,
  sendChannelMessage,
} from "../../services/chatService.js";
import "./Chat.css";

function Chat() {
  const { workspaceId } = useWorkspace();
  const { user } = useAuth();
  const { t } = useLanguage();

  const [channels, setChannels] = useState([]);
  const [directChannels, setDirectChannels] = useState([]);
  const [workspaceMembers, setWorkspaceMembers] = useState([]);
  const [activeChannel, setActiveChannel] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [onlineUserIds, setOnlineUserIds] = useState(new Set());
  const [typingUsers, setTypingUsers] = useState({});

  // Modal create channel
  const [showModal, setShowModal] = useState(false);
  const [newChannelName, setNewChannelName] = useState("");
  const [newChannelDesc, setNewChannelDesc] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [modalError, setModalError] = useState("");

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const activeChannelRef = useRef(null);

  useEffect(() => {
    activeChannelRef.current = activeChannel;
  }, [activeChannel]);

  // 1. Initialize Socket.io connection
  useEffect(() => {
    if (!user) return;

    const socketUrl = window.location.origin;
    const socket = io(socketUrl, {
      query: { userId: user.id },
      transports: ["websocket", "polling"],
    });
    socketRef.current = socket;

    socket.on("user_presence", (onlineIds) => {
      setOnlineUserIds(new Set(onlineIds));
    });

    socket.on("new_message", (newMsg) => {
      if (activeChannelRef.current && newMsg.channelId === activeChannelRef.current.id) {
        setMessages((prev) => (prev.some((m) => m.id === newMsg.id) ? prev : [...prev, newMsg]));
      }
      if (workspaceId) {
        getChannels(workspaceId).then((data) => {
          setChannels(data.channels || []);
          setDirectChannels(data.directChannels || []);
          setWorkspaceMembers(data.workspaceMembers || []);
        }).catch(() => {});
      }
    });

    socket.on("user_typing", ({ channelId, userId, userName, isTyping }) => {
      if (activeChannelRef.current && channelId === activeChannelRef.current.id) {
        setTypingUsers((prev) => {
          if (isTyping) {
            return { ...prev, [userId]: userName };
          } else {
            const copy = { ...prev };
            delete copy[userId];
            return copy;
          }
        });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [user, workspaceId]);

  // 2. Fetch channels when workspaceId changes
  useEffect(() => {
    if (!workspaceId) return;
    loadChannelsData();
  }, [workspaceId]);

  const loadChannelsData = async () => {
    if (!workspaceId) return;
    try {
      const data = await getChannels(workspaceId);
      setChannels(data.channels || []);
      setDirectChannels(data.directChannels || []);
      setWorkspaceMembers(data.workspaceMembers || []);

      // Auto-select general channel if no active channel
      if (data.channels && data.channels.length > 0 && !activeChannel) {
        selectChannel(data.channels[0]);
      }
    } catch (err) {
      console.error("Failed to load chat channels", err);
    }
  };

  // 3. Handle Selecting a Channel
  const selectChannel = async (channel) => {
    if (!channel || !workspaceId) return;
    if (activeChannel && socketRef.current) {
      socketRef.current.emit("leave_channel", activeChannel.id);
    }

    setActiveChannel(channel);
    setTypingUsers({});

    if (socketRef.current) {
      socketRef.current.emit("join_channel", channel.id);
    }

    try {
      const history = await getChannelMessages(workspaceId, channel.id);
      setMessages(history || []);
    } catch (err) {
      console.error("Failed to fetch channel messages", err);
    }
  };

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle typing status
  const handleInputChange = (e) => {
    setMessageText(e.target.value);

    if (socketRef.current && activeChannel) {
      socketRef.current.emit("typing", {
        channelId: activeChannel.id,
        userId: user.id,
        userName: user.name,
        isTyping: true,
      });

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socketRef.current.emit("typing", {
          channelId: activeChannel.id,
          userId: user.id,
          userName: user.name,
          isTyping: false,
        });
      }, 2000);
    }
  };

  // Handle sending a message
  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!messageText.trim() || !activeChannel || !workspaceId) return;

    const content = messageText.trim();
    setMessageText("");

    try {
      const sentMsg = await sendChannelMessage(workspaceId, activeChannel.id, { content });
      setMessages((prev) => (prev.some((m) => m.id === sentMsg.id) ? prev : [...prev, sentMsg]));

      if (socketRef.current) {
        socketRef.current.emit("typing", {
          channelId: activeChannel.id,
          userId: user.id,
          userName: user.name,
          isTyping: false,
        });
      }
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  // Start Direct Message with a workspace member
  const handleStartDM = async (targetUser) => {
    if (!workspaceId) return;
    try {
      const dmChannel = await getOrCreateDirectChannel(workspaceId, targetUser.id);
      await loadChannelsData();
      selectChannel(dmChannel);
    } catch (err) {
      console.error("Failed to create DM", err);
    }
  };

  // Handle Create Channel
  const handleCreateChannelSubmit = async (e) => {
    e.preventDefault();
    if (!newChannelName.trim() || !workspaceId) return;

    setModalError("");
    setIsCreating(true);

    try {
      const created = await createChannel(workspaceId, {
        name: newChannelName,
        description: newChannelDesc,
      });
      setNewChannelName("");
      setNewChannelDesc("");
      setShowModal(false);
      await loadChannelsData();
      if (created) selectChannel(created);
    } catch (err) {
      console.error("Failed to create channel", err);
      setModalError(err.message || "Failed to create channel");
    } finally {
      setIsCreating(false);
    }
  };

  // Helper to format channel title / DM title
  const getChannelDisplayName = (chan) => {
    if (!chan) return "";
    if (chan.type === "direct") {
      const otherMember = chan.members?.find((m) => m.user?.id !== user?.id);
      return otherMember?.user?.name || "Direct Message";
    }
    return `# ${chan.name}`;
  };

  const filteredChannels = channels.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMembers = workspaceMembers.filter((m) =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeChannelName = getChannelDisplayName(activeChannel);

  return (
    <div className="chat-container">
      {/* Sidebar Channels & DMs */}
      <div className="chat-sidebar">
        <div className="chat-sidebar-header">
          <div className="chat-title-row">
            <h2>
              <i className="bi bi-chat-dots-fill"></i> Chat
            </h2>
            <button
              className="chat-add-btn"
              onClick={() => {
                setModalError("");
                setShowModal(true);
              }}
              title={t("newChannel")}
            >
              <i className="bi bi-plus-lg"></i>
            </button>
          </div>
          <div className="chat-search-input">
            <i className="bi bi-search"></i>
            <input
              type="text"
              placeholder={t("search")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="chat-sections-scroll">
          {/* Public & Project Channels */}
          <div>
            <div className="chat-section-header">
              <span>{t("channels")}</span>
            </div>
            <ul className="chat-item-list">
              {filteredChannels.map((chan) => (
                <li
                  key={chan.id}
                  className={`chat-item ${activeChannel?.id === chan.id ? "active" : ""}`}
                  onClick={() => selectChannel(chan)}
                >
                  <i className={`bi ${chan.type === "project" ? "bi-folder" : "bi-hash"} chat-item-icon`}></i>
                  <div className="chat-item-info">
                    <div className="chat-item-name">{chan.name}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Direct Messages Section */}
          <div>
            <div className="chat-section-header">
              <span>{t("directMessages")}</span>
            </div>
            <ul className="chat-item-list">
              {filteredMembers.map((member) => {
                const isOnline = onlineUserIds.has(member.id);
                // Check if existing DM channel exists for active styling
                const existingDm = directChannels.find((d) =>
                  d.members?.some((m) => m.userId === member.id)
                );
                const isActive = activeChannel?.id === existingDm?.id;

                return (
                  <li
                    key={member.id}
                    className={`chat-item ${isActive ? "active" : ""}`}
                    onClick={() => handleStartDM(member)}
                  >
                    <div className="user-avatar-wrapper">
                      <div className="chat-avatar">
                        {member.name ? member.name.charAt(0).toUpperCase() : "U"}
                      </div>
                      <span className={`status-dot ${isOnline ? "online" : "offline"}`}></span>
                    </div>
                    <div className="chat-item-info">
                      <div className="chat-item-name">{member.name}</div>
                      <div className="chat-item-subtitle">{isOnline ? t("online") : t("offline")}</div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      {/* Main Discussion Area */}
      <div className="chat-main">
        {activeChannel ? (
          <>
            <div className="chat-main-header">
              <div className="chat-header-details">
                <div>
                  <h3 className="chat-header-title">{activeChannelName}</h3>
                  {activeChannel.description && (
                    <p className="chat-header-subtitle">{activeChannel.description}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Message Feed */}
            <div className="chat-feed">
              {messages.length === 0 ? (
                <div className="chat-empty-state">
                  <i className="bi bi-chat-text"></i>
                  <p>Aucun message dans ce canal. Envoyez le premier !</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isMine = msg.senderId === user?.id;
                  const senderName = msg.sender?.name || "Utilisateur";
                  const timeStr = new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <div key={msg.id} className={`message-row ${isMine ? "mine" : ""}`}>
                      <div className="message-avatar">
                        {senderName.charAt(0).toUpperCase()}
                      </div>
                      <div className="message-content-wrapper">
                        <div className="message-meta">
                          <span className="message-sender">{senderName}</span>
                          <span className="message-time">{timeStr}</span>
                        </div>
                        <div className="message-bubble">{msg.content}</div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Typing status */}
            {Object.keys(typingUsers).length > 0 && (
              <div className="typing-indicator">
                {Object.values(typingUsers).join(", ")} est en train d'écrire...
              </div>
            )}

            {/* Message Input Box */}
            <form className="chat-input-container" onSubmit={handleSendMessage}>
              <div className="chat-input-wrapper">
                <textarea
                  className="chat-textarea"
                  rows="1"
                  placeholder={t("typeMessage")}
                  value={messageText}
                  onChange={handleInputChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
              </div>
              <button
                type="submit"
                className="chat-send-btn"
                disabled={!messageText.trim()}
              >
                <i className="bi bi-send-fill"></i>
              </button>
            </form>
          </>
        ) : (
          <div className="chat-empty-state">
            <i className="bi bi-chat-left-dots"></i>
            <p>{t("selectChannelToStart")}</p>
          </div>
        )}
      </div>

      {/* Modal for Creating New Channel */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{t("createChannel")}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowModal(false);
                    setModalError("");
                  }}
                  disabled={isCreating}
                ></button>
              </div>
              <form onSubmit={handleCreateChannelSubmit}>
                <div className="modal-body">
                  {modalError && (
                    <div className="alert alert-danger py-2">{modalError}</div>
                  )}
                  <div className="mb-3">
                    <label className="form-label">{t("channelName")}</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="ex: discussions-techniques"
                      value={newChannelName}
                      onChange={(e) => setNewChannelName(e.target.value)}
                      required
                      disabled={isCreating}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">{t("description")}</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Objectif de ce canal..."
                      value={newChannelDesc}
                      onChange={(e) => setNewChannelDesc(e.target.value)}
                      disabled={isCreating}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowModal(false);
                      setModalError("");
                    }}
                    disabled={isCreating}
                  >
                    {t("cancel")}
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={isCreating || !newChannelName.trim()}>
                    {isCreating ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        {t("loading")}
                      </>
                    ) : (
                      t("create")
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chat;
