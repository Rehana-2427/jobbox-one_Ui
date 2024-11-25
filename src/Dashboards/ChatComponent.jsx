import { Client } from "@stomp/stompjs";
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import SockJS from "sockjs-client";
import './ChatComponent.css';
import { Modal } from "react-bootstrap";
import { subDays, isBefore } from "date-fns"; // For date manipulation
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";


const BASE_API_URL = process.env.REACT_APP_API_URL;

const ChatComponent = ({ applicationId, hrId, candidateId, userType, setIsChatOpen }) => {
  const [messages, setMessages] = useState([]); // Messages in chat
  const [newMessage, setNewMessage] = useState(''); // The current message
  const stompClientRef = useRef(null); // WebSocket client using ref
  const [connected, setConnected] = useState(false); // Connection status

  console.log("applicationId -> " + applicationId + " CandidateId -> " + candidateId + " HrId -> " + hrId + " userType -> " + userType);

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

  // Fetch previous messages from backend when the component mounts
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`${BASE_API_URL}/messages?applicationId=${applicationId}`);
        const allMessages = response.data
        // Filter messages to get only the last 2 days of chat
        const today = new Date();
        const twoDaysAgo = subDays(today, 1); // Get the date 2 days ago

        const filteredMessages = allMessages.filter(msg => {
          const messageDate = new Date(msg.timestamp);
          return isBefore(messageDate, twoDaysAgo) === false; // Include messages from the last 2 days
        });

        setMessages(filteredMessages); // Set the filtered messages
      } catch (error) {
        console.error('Error fetching messages:', error);
        if (error.response && error.response.status === 403) {
          console.error('Access Forbidden: You might not have the necessary permissions.');
        }
      }
    };

    fetchMessages();

    // Initialize WebSocket connection
    const socket = new SockJS(`${BASE_API_URL}/ws`);
    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log('Connected to WebSocket');
        setConnected(true); // Update connection status

        // Subscribe to the correct topic after connection
        client.subscribe(`/topic/app`, (messageOutput) => {
          const message = JSON.parse(messageOutput.body);
          setMessages((prevMessages) => [...prevMessages, message]);
        });
      },
      onDisconnect: () => {
        setConnected(false);
      },
      onStompError: (error) => {
        console.error('STOMP Error: ', error);
      },
    });

    client.activate(); // Activates WebSocket connection
    stompClientRef.current = client; // Set the stompClientRef

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate(); // Cleanup on component unmount
      }
    };
  }, [applicationId]); // Removed stompClient from dependency list, it should not cause re-renders

  // Send a message function
  const sendMessage = () => {
    if (!newMessage.trim()) return; // Don't send empty messages

    const stompClient = stompClientRef.current;

    if (!stompClient || !stompClient.connected) {
      console.error("STOMP client is not connected!");
      return;
    }

    const message = {
      applicationId,
      hrMessage: hrId && userType === 'HR' ? newMessage : '',
      candidateMessage: candidateId && userType === 'Candidate' ? newMessage : '',
      isHRRead: false, // Add read status logic if required
      isCandidateRead: false, // Add read status logic if required
    };

    // Save message to the database using REST API (Axios)
    // axios.post(`${BASE_API_URL}/messagesPost`, message)
    //   .then(response => {
    //     setMessages((prevMessages) => [...prevMessages, response.data]);
    //     setNewMessage(''); // Clear input field after sending
    //   })
    //   .catch(error => {
    //     console.error('Error saving message:', error);
    //     if (error.response && error.response.status === 403) {
    //       console.error('Forbidden: You might not have permission to post messages.');
    //     }
    //   });

    // Send the message through WebSocket to other party (Real-time)
    // stompClient.send('/app/chat', {}, JSON.stringify(message));
    // Use publish method here, or another alternative
    stompClient.publish({
      destination: '/app/chat',
      body: JSON.stringify(message)
    });
    setNewMessage(''); // Clear input field after sending
  };

  const handleClose = () => {
    setIsChatOpen(false); // Close the modal when close button is clicked
  };

  return (
    <Modal show={true} onHide={handleClose} style={{ overflowY: 'auto' }}>
      <Modal.Header closeButton>
        <Modal.Title>Chat with {userName}</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ maxHeight: '400px', overflowY: 'auto' }}> {/* Set max height and overflow */}
        {/* Chat box with scrollable content */}
        <div className="chat-box" style={{ maxHeight: '100%', overflowY: 'auto' }}>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={msg.hrMessage ? (userType === 'HR' ? 'message-left' : 'message-right') : (userType === 'Candidate' ? 'message-left' : 'message-right')}
            >
              <strong>{msg.hrMessage && userType === 'HR' ? 'You' : msg.candidateMessage && userType === 'Candidate' ? 'You' : userName}: </strong>              {msg.hrMessage || msg.candidateMessage}
            </div>
          ))}
        </div>
        {/* Textarea and send button */}
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => {
            if (e.key === 'Enter' && newMessage.trim() !== '') {
              sendMessage();
              e.preventDefault();
            }
          }}
        />
        <button className="send-chat"  onClick={sendMessage} disabled={!connected} >  <FontAwesomeIcon icon={faPaperPlane} /> {/* Send icon from Font Awesome */}Send</button>
      </Modal.Body>
    </Modal>

  );
};

export default ChatComponent;
