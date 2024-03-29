// Chatbot.js
import React, { useState, useEffect, useRef  } from 'react';
import Navbar from '../Navbar/Navbar';
import  './chatbot.css';
import Loader from '../../../Loader/Loader';
import { useUser } from '../../../../UserContext';


let messageIdCounter = 0;

const Chatbot = () => {
  const { userId } = useUser();
  const [isMuted, setIsMuted] = useState(false);
  const [isReadingAloud, setIsReadingAloud] = useState(false);
  const [currentUtterance, setCurrentUtterance] = useState(null);
  const [messageInputValue, setMessageInputValue] = useState('');
  const [loadingGifDisplay, setLoadingGifDisplay] = useState('none');
  const [latestBotMessage, setLatestBotMessage] = useState('');
  const [recentChats, setRecentChats] = useState([]);

  const userMessagesDivRef = useRef(null);
  const chatBoxRef = useRef(null);

  useEffect(() => {
    const userMessagesDiv = userMessagesDivRef.current;
    const chatBox = chatBoxRef.current;
    const micButton = document.getElementById('mic-icon');
    const micSlashButton = document.getElementById('mic-slash-icon');
    micSlashButton.style.display = 'none';
     const muteButton = document.getElementById('mute-icon');
    const readAloudButton = document.getElementById('read-aloud-icon');

    readAloudButton.style.display = 'inline-block';
    muteButton.style.display = 'none';

    let recognition;

    micButton.addEventListener('click', () => {
      micButton.style.display = 'none';
      micSlashButton.style.display = 'inline-block';

      recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setMessageInputValue(transcript);
      };

      recognition.onspeechend = () => {
        recognition.stop();
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
      };

      recognition.start();
    });

    micSlashButton.addEventListener('click', () => {
      if (recognition) {
        recognition.stop();
      }

      micSlashButton.style.display = 'none';
      micButton.style.display = 'inline-block';
    });
  }, [userMessagesDivRef, chatBoxRef]);

  useEffect(() => {
    // Fetch recent chats when the component mounts
    fetchRecentChats();
  }, [userId]); // Fetch again if userId changes
  
  const fetchRecentChats = () => {
    // Fetch recent chats from the server
    fetch(`http://localhost:5000/recent-chats/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        userMessagesDivRef.current.innerHTML = '';
        // Extract the message and timestamp fields from each object in the recentChats array
        data.recentChats.forEach(chat => {
          const { message, timestamp } = chat;
          addUserMessage(message, timestamp);
        });
      })
      .catch((error) => {
        console.error('Error fetching recent chats:', error);
      });
  };
  



  const sendMessage = () => {
    let message = messageInputValue.trim();
    setMessageInputValue('');
  
    // Greeting recognition logic
    const greetings = ['hello', 'hi', 'hey', 'greetings'];
    const normalizedMessage = message.toLowerCase();
  
    if (greetings.some(greeting => normalizedMessage.includes(greeting))) {
      addBotMessage("Hello! 😊 ScriptSage at your service....");
      return;
    }
    // Check for queries about the bot's name
    if (normalizedMessage.includes('what\'s your name') || normalizedMessage.includes('your name')) {
      addBotMessage("My name is ScriptSage 🤖");
      return;
    }
  
    // Automatically append 'in C programming language' to the message
    message += ' in C programming language';
  
    addUserMessage(message);
  
    // Display loading effect
    setLoadingGifDisplay('block');

    fetch('http://localhost:5000/user-message', {    //here we add user-messages to mongodb also
    method: 'POST', 
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, message }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data); // Log the response from the server if needed
    })
    .catch((error) => {
      console.error(error);
      // Handle errors if necessary
    });
  
    fetch('http://localhost:7000/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    })
      .then((response) => response.json())
      .then((data) => {
        const content = data.content;
  
        // Check if the content has a code block
        const hasCodeBlock = content.includes('```');
        if (hasCodeBlock) {
          // If the content has a code block, wrap it in a <pre><code> element
          const codeContent = content.replace(
            /```([\s\S]+?)```/g,
            '</p><pre><code>$1</code></pre><p>'
          );
          addBotMessage(codeContent);
        } else {
          addBotMessage(content);
        }
  
        // Hide loading effect
        setLoadingGifDisplay('none');
      })
      .catch((error) => {
        console.error(error);
        // Hide loading effect in case of an error
        setLoadingGifDisplay('none');
        addBotMessage("server not connected lol 😂");
      });
  };
  
  // const isCRelatedQuery = (query) => {
  //   // Check if the query is related to C language (you can customize this logic based on your needs)
  //   const cKeywords = ['C', 'programming', 'code', 'algorithm']; // Example keywords
  //   const normalizedQuery = query.toLowerCase();

  //   return cKeywords.some(keyword => normalizedQuery.includes(keyword));
  // };

  const addUserMessage = (message, timestamp) => {
    const messageId = messageIdCounter++;
    const maxLength = 10;
  
    const truncatedMessage = truncateText(message, maxLength);
  
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('user-message');
    messageDiv.dataset.messageId = messageId;
  
    const newMessageIndicator = document.createElement('span');
    newMessageIndicator.classList.add('new-message-indicator');
    newMessageIndicator.innerHTML = '🔔';
    messageDiv.appendChild(newMessageIndicator);
  
    const messageContent = document.createElement('p');
    messageContent.classList.add('message-content');
    messageContent.innerHTML = `${timestamp}: ${truncatedMessage}`;
    messageDiv.appendChild(messageContent);
  
    if (message.length > maxLength) {
      const readMoreButton = document.createElement('button');
      readMoreButton.classList.add('read-more-button');
      readMoreButton.innerHTML = 'Read More';
      // Inline CSS for reducing the size
      messageContent.style.color = '#9360e6';
      readMoreButton.style.fontSize = '0.4em'; // Adjust as needed for the desired size
      readMoreButton.style.marginRight = '5px'; // Add margin for spacing
      readMoreButton.style.height = '20px'; // Adjust as needed for the desired height
      readMoreButton.style.width = '60px';
      readMoreButton.addEventListener('click', () => toggleMessage(messageId, message));
      messageDiv.appendChild(readMoreButton);
    }
  
    userMessagesDivRef.current.appendChild(messageDiv);
    userMessagesDivRef.current.scrollTop = userMessagesDivRef.current.scrollHeight;
  };
  
  
  
  
  
  
  const toggleMessage = (messageId, fullMessage) => {
    const messageDiv = Array.from(userMessagesDivRef.current.children).find(
      (child) => child.dataset.messageId === messageId.toString()
    );
  
    if (messageDiv) {
      const messageContent = messageDiv.querySelector('.message-content');
      messageContent.innerHTML = fullMessage;
    }
  };
  
  
  
    
  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      console.log('Truncated message:', text.slice(0, maxLength) + '...');
      return text.slice(0, maxLength) + '...';
    }
    return text;
  };
  

  

  const addBotMessage = (message) => {
    // Clear previous bot messages
    chatBoxRef.current.innerHTML = '';
  
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('bot-message', 'mt-3', 'p-3', 'rounded');
  
    // Create an image element for the bot icon
    const botIcon = document.createElement('img');
    botIcon.src = "/Logo.png";
    botIcon.classList.add('bot-icon');
    messageDiv.appendChild(botIcon);
  
    // Create a paragraph element for the message content
    const messageContent = document.createElement('p');
    messageContent.classList.add('bot-message-content');
    messageContent.style.color = 'white';
    messageContent.style.fontSize = '1.2rem';
    messageContent.innerHTML = beautifyMessage(message);
    messageDiv.appendChild(messageContent);
  
    // Append the message div to the chat box
    chatBoxRef.current.appendChild(messageDiv);
  
    // Set the latest bot message
    setLatestBotMessage(message);
  
    // Scroll to the top of the chat box
    chatBoxRef.current.scrollTop = 0;
  };
  
  const beautifyMessage = (message) => {
    // Add line breaks before each sentence
    const formattedMessage = message.replace(/\. /g, '.\n\n');
    
    // Apply styling or additional formatting as needed, including hover effect and font size
    const styledMessage = `<span style="color: #9360e6; cursor: pointer; transition: color 0.8s ease; font-size: 1.1em;"
                           onmouseover="this.style.color='white'; this.style.fontSize='1.2em'"
                           onmouseout="this.style.color='#9360e6'; this.style.fontSize='1.1em'">
                           ${formattedMessage}
                         </span>`;
  
    return styledMessage;
};

  
  
  
const clearChatBox = () => {
  // Display loading effect
  setLoadingGifDisplay('block');
// Apply blur effect to the chat box
  chatBoxRef.current.style.filter = 'blur(5px)';
  // Use a timeout to simulate the loading process (you can replace this with actual loading logic)
  setTimeout(() => {
    // Assuming chatBox is a reference to the container for messages
    chatBoxRef.current.innerHTML = ''; // Clear the chat box content
    chatBoxRef.current.style.filter = 'none';
    // Hide loading effect
    setLoadingGifDisplay('none');
  }, 3000); // Adjust the timeout duration as needed
};





  


  const muteToggle = () => {
    // Stop ongoing read-aloud if it's in progress
    readAloudButton.style.display = 'inline-block';
    muteButton.style.display = 'none';
    if (isReadingAloud) {
      speechSynthesis.cancel();
      setIsReadingAloud(false); // Reset the flag
    }

    setIsMuted(!isMuted);
  };

  const readAloud = () => {
    // Stop ongoing read-aloud if it's in progress
    readAloudButton.style.display = 'none';
    muteButton.style.display = 'inline-block';
    if (isReadingAloud) {
      speechSynthesis.cancel();
    }

    setIsReadingAloud(true);

    const words = latestBotMessage.split(' ');
    let currentWordIndex = 0;

    const utterance = new SpeechSynthesisUtterance();
    utterance.text = latestBotMessage;
    utterance.lang = 'en-US';

    
    utterance.onend = () => {
      setIsReadingAloud(false); // Reset the flag
      // Assuming readAloudButton is a reference to the read-aloud button
      const updatedReadAloudButton = document.getElementById('read-aloud-icon');
      updatedReadAloudButton.style.display = 'inline-block';
      // Assuming muteButton is a reference to the mute button
      // Update the button reference for the correct behavior
      const updatedMuteButton = document.getElementById('mute-icon');
      updatedMuteButton.style.display = 'none';
    };

    // Save the current utterance
    setCurrentUtterance(utterance);

    speechSynthesis.speak(utterance);
  };

  
  const muteButton = document.getElementById('mute-icon');
  const readAloudButton = document.getElementById('read-aloud-icon');

  

  return (
    <div className="abcd">
          <div>
          <p style={{ fontSize: 'larger', color: '#9360e6', position: 'absolute', left: '0px',
        bottom: '220px',
        }}>Recent Chats</p>
  

            <div className="user-messages" ref={userMessagesDivRef}>
              {/* User messages will be added here dynamically */}
            </div>
          </div>
      <Navbar/>
      <div>
      <p className='user-id-chatbot'>User ID: {userId}</p>
      <div id="black_board"></div>
      <div className="container mt-5">
        <h1 style={{ color: 'white' }}>ScriptSage Blackboard</h1>
        <div className="row mt-3">
          <div className="col-md-8 offset-md-2 chat-box-container">
            <div className="chat-box mt-3" ref={chatBoxRef}>
              {/* Chat messages will be added here dynamically */}
            </div>
            <div className="loading-gif" style={{ display: loadingGifDisplay, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
              {loadingGifDisplay && <Loader />}
            </div>



            <div className="form-group mt-3">
              <textarea
                className="form-control"
                rows="2"
                placeholder="Type your message here"
                id="message-input"
                value={messageInputValue}
                onChange={(e) => setMessageInputValue(e.target.value)}
              ></textarea>
            </div>
            <button type="button" className="get-started-button" id="send-btn" onClick={sendMessage}>
              Send
            </button>
            <button type="button" className="clear-button" onClick={clearChatBox}>
              Clear
            </button>

            <button type="button" className="mic-button" id="mic-icon" >
              <i className="fa-solid fa-microphone"></i>
            </button>

            <button type="button" className="mic-button-slash" id="mic-slash-icon" >
              <i className="fa-solid fa-microphone-slash"></i>
            </button>
            
            <button
                type="button"
                className="read-aloud-button"
                id="read-aloud-icon"
                onClick={readAloud}
              >
                <i className="fa-solid fa-volume-high"></i>
            </button>

            <button type="button" className="mute-button" id="mute-icon" onClick={muteToggle}>
              <i className="fa-solid fa-volume-xmark"></i>
            </button>
            
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Chatbot;
