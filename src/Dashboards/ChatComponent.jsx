import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Client } from "@stomp/stompjs";
import axios from "axios";
import { format, isBefore, isToday, isYesterday, subDays } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { Button, Modal } from "react-bootstrap"; // Ensure Button is imported
import { MdDelete, MdEdit } from "react-icons/md";
import SockJS from "sockjs-client";
import Swal from "sweetalert2";
import './ChatComponent.css';


const BASE_API_URL = process.env.REACT_APP_API_URL;

const ChatComponent = ({ applicationId, hrId, candidateId, userType, setIsChatOpen }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const stompClientRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const chatBoxRef = useRef(null);
  const [editMessageId, setEditMessageId] = useState(null); // To track which message is being edited

  // Helper function to format time
  function formatMessageDateTime(timestamp) {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {
      console.error("Invalid date:", timestamp);
      return "Invalid Date";
    }

    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;

    return `${formattedHours}:${minutes} ${ampm}`;
  }

  // Helper function to format date
  function formatDate(timestamp) {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {
      console.error("Invalid date:", timestamp);
      return "Invalid Date";
    }

    if (isToday(date)) {
      return "Today";
    } else if (isYesterday(date)) {
      return "Yesterday";
    } else {
      return format(date, 'eeee');
    }
  }

  const [userName, setUserName] = useState('');
  useEffect(() => {
    const fetchUserName = async () => {
      try {
        if (userType === 'HR') {
          const response = await axios.get(`${BASE_API_URL}/getUserName`, {
            params: {
              userId: candidateId
            }
          });
          setUserName(response.data.userName);
        }
        else if (userType === 'Candidate') {
          const response = await axios.get(`${BASE_API_URL}/getUserName`, {
            params: {
              userId: hrId
            }
          });
          setUserName(response.data.companyName + ' HR');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        console.error('Error fetching data:');
      }
    }
    fetchUserName();
  }, [userType, hrId, candidateId]); // Runs when userType changes





  // Fetching messages on component mount
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`${BASE_API_URL}/messages?applicationId=${applicationId}`);
        const allMessages = response.data;
        const today = new Date();
        const twoDaysAgo = subDays(today, 2);

        const filteredMessages = allMessages.filter(msg => {
          const messageDate = new Date(msg.timestamp);
          return isBefore(messageDate, twoDaysAgo) === false;
        });

        setMessages(filteredMessages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();

    const socket = new SockJS(`${BASE_API_URL}/ws`);
    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log('Connected to WebSocket');
        setConnected(true)
        //   const message = JSON.parse(messageOutput.body);
        //   setMessages((prevMessages) => [...prevMessages, message]);
        // });

        client.subscribe(`/topic/app`, (messageOutput) => {
          const message = JSON.parse(messageOutput.body);
          setMessages((prevMessages) => {
            // Check if the message is an update
            const existingMessageIndex = prevMessages.findIndex(msg => msg.chatId === message.chatId);
            if (existingMessageIndex > -1) {
              // Update the existing message
              const updatedMessages = [...prevMessages];
              updatedMessages[existingMessageIndex] = message;
              return updatedMessages;
            } else {
              // If it's a new message, just append it
              return [...prevMessages, message];
            }
          });
        });
      },
      onDisconnect: () => {
        console.log('Disconnected from WebSocket');
        setConnected(false);
      },
      onStompError: (error) => {
        console.error('STOMP Error: ', error);
      },
    });

    client.activate();
    stompClientRef.current = client;

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
      }
    };
  }, [applicationId]);

  // Auto scroll the chat to the bottom when new messages arrive
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const [isSending, setIsSending] = useState(false);

  // Send new message
  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const stompClient = stompClientRef.current;

    if (!stompClient || !stompClient.connected) {
      console.error("STOMP client is not connected!");
      return;
    }

    const message = {
      applicationId,
      hrMessage: hrId && userType === 'HR' ? newMessage : '',
      candidateMessage: candidateId && userType === 'Candidate' ? newMessage : '',
      isHRRead: false,
      isCandidateRead: false,
      timestamp: new Date().toISOString(),
    };

    stompClient.publish({
      destination: '/app/chat',
      body: JSON.stringify(message),
    });

    setNewMessage("");
  };

  // Close chat
  const handleClose = () => {
    setIsChatOpen(false);
  };

  // Delete message with confirmation
  const handleDelete = (chatId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to delete this message?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMsg(chatId);
      }
    });
  };

  // Delete message from server
  const deleteMsg = async (chatId) => {
    try {
      await axios.delete(`${BASE_API_URL}/deleteChatMsg`, { params: { chatId: chatId } });
      setMessages(messages.filter((msg) => msg.chatId !== chatId));

      Swal.fire("Deleted!", "Your message has been deleted.", "success");
    } catch (error) {
      console.error("Error deleting message:", error);
      Swal.fire("Error!", "Failed to delete the message.", "error");
    }
  };

  // Edit message
  const handleUpdate = (chatId) => {
    const messageToEdit = messages.find((msg) => msg.chatId === chatId);
    if (messageToEdit) {
      setNewMessage(messageToEdit.hrMessage || messageToEdit.candidateMessage);
      setEditMessageId(chatId); // Track the ID of the message being edited
    }
  };

  const handleUpdateMessage = async () => {
    setIsSending(true);
    try {

      const updatedMessage = {
        chatId: editMessageId,
        applicationId,
        hrMessage: hrId && userType === 'HR' ? newMessage : '',
        candidateMessage: candidateId && userType === 'Candidate' ? newMessage : '',
        timestamp: new Date().toISOString(),
      };

      // Update the message on the server
      await axios.put(`${BASE_API_URL}/updateChatMsg`, updatedMessage, {
        params: { chatId: editMessageId },
      });

      // Update the message in the local state
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.chatId === editMessageId ? { ...msg, ...updatedMessage } : msg
        )
      );

      // Publish the updated message to the WebSocket topic
      const stompClient = stompClientRef.current;
      if (stompClient && stompClient.connected) {
        stompClient.publish({
          destination: '/app/chat',
          body: JSON.stringify(updatedMessage),
        });
      }

      setNewMessage('');
      setEditMessageId(null);
      Swal.fire("Updated!", "Your message has been updated.", "success");
    } catch (error) {
      console.error("Error updating message:", error);
      Swal.fire("Error!", "Failed to update the message.", "error");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Modal show={true} onHide={handleClose} style={{ overflowY: 'auto' }}>
      <Modal.Header closeButton>
        <Modal.Title>Chat with {userName}</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ maxHeight: '400px', display: 'flex', flexDirection: 'column' }}>
        <div className="chat-box" ref={chatBoxRef} style={{ flexGrow: 1, overflowY: 'auto' }}>
          {messages.map((msg, msgIndex) => {
            const messageDate = formatDate(msg.createdAt);

            return (
              <div key={msg.chatId}>
                {msgIndex === 0 || formatDate(messages[msgIndex - 1].createdAt) !== messageDate ? (
                  <div className="message-date-heading" style={{ textAlign: 'center' }}>
                    <strong>{messageDate}</strong>
                  </div>
                ) : null}

                <div className={`message-container ${msg.hrMessage
                  ? userType === 'HR' ? 'message-left' : 'message-right'
                  : userType === 'Candidate' ? 'message-left' : 'message-right'
                  }`}
                  style={{ position: 'relative' }}
                >
                  <div className="message-content">
                    <strong>{msg.hrMessage && userType === 'HR' ? 'You' : msg.candidateMessage && userType === 'Candidate' ? 'You' : userName}: </strong>
                    <span>{msg.hrMessage || msg.candidateMessage}</span>
                    <div className="message-time">
                      <span>{formatMessageDateTime(msg.createdAt)}</span>
                    </div>
                  </div>

                  {/* Conditionally render edit and delete icons */}
                  {((userType === 'Candidate' && msg.candidateMessage) || (userType === 'HR' && msg.hrMessage)) && (
                    <>
                      {/* Calculate the time difference */}
                      {
                        msg.createdAt && (new Date().toISOString() && (new Date().getTime() - new Date(msg.createdAt).getTime()) < 15 * 60 * 1000) ? (
                          // Only show the edit button if it's within 15 minutes, using system's current time
                          <div className="edit-icon" onClick={() => handleUpdate(msg.chatId)}>
                            <MdEdit size={18} />
                          </div>
                        ) : (
                          null
                        )
                      }


                      {/* Delete button, always enabled */}
                      <div className="delete-icon" onClick={() => handleDelete(msg.chatId)}>
                        <MdDelete size={18} />
                      </div>

                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div className="message-input">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message here"
            disabled={isSending}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && newMessage.trim() !== '') {
                // Check if we're in edit mode and call handleUpdateMessage
                if (editMessageId) {
                  handleUpdateMessage();
                } else {
                  sendMessage();
                }
                e.preventDefault(); // Prevents the default Enter key behavior (new line in textarea)
              }
            }}
          />
        </div>
        <div className="message-actions">
          {editMessageId ? (
            <Button
              className="send-chat"
              variant="primary"
              onClick={handleUpdateMessage}
              disabled={isSending}
            >
              <FontAwesomeIcon icon={faPaperPlane} /> {isSending ? 'Updating...' : 'Update Message'}
            </Button>
          ) : (
            <Button
              className="send-chat"
              variant="primary"
              onClick={sendMessage}
              disabled={isSending}
            >
              <FontAwesomeIcon icon={faPaperPlane} /> {isSending ? 'Sending...' : 'Send Message'}
            </Button>
          )}
        </div>

      </Modal.Body>
    </Modal>
  );
};

export default ChatComponent;
