import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUIModel } from '../contexts/UIModelContext';
import './Chat.css';

function Chat() {
  const [view, setView] = useState('selection'); // 'selection' or 'conversation'
  const [selectedContact, setSelectedContact] = useState(null);
  const [highlightedContact, setHighlightedContact] = useState('Alice');
  const [isRecording, setIsRecording] = useState(false);
  const [rotation, setRotation] = useState(0);
  const navigate = useNavigate();
  const { uiModel } = useUIModel();

  const contacts = [
    { name: 'Ying', image: '/Resources/ModelD/Ying.png' },
    { name: 'Alice', image: '/Resources/ModelD/Alice.png' },
    { name: 'Bob', image: '/Resources/ModelD/Bob.png' },
  ];

  const messages = {
    Bob: [
      { sender: 'Bob', text: 'Hi! How are you doing today?', time: '10:30 AM' },
      { sender: 'You', text: 'I\'m doing great! Thanks for asking.', time: '10:32 AM' },
      { sender: 'Bob', text: 'That\'s wonderful to hear!', time: '10:33 AM' },
    ],
    Alice: [
      { sender: 'Alice', text: 'Good morning!', time: '9:15 AM' },
      { sender: 'You', text: 'Good morning Alice!', time: '9:20 AM' },
    ],
    Ying: [
      { sender: 'Ying', text: 'Let\'s play a game later!', time: '2:45 PM' },
      { sender: 'You', text: 'Sure, sounds fun!', time: '2:50 PM' },
    ],
  };

  const handleConfirm = () => {
    setSelectedContact(highlightedContact);
    setView('conversation');
  };

  const handleRecordToggle = () => {
    setIsRecording(!isRecording);
  };

  const handleBack = () => {
    if (view === 'conversation') {
      setView('selection');
      setSelectedContact(null);
    } else {
      navigate('/dashboard');
    }
  };

  // Keyboard controls for contact switching in conversation view (ModelR)
  useEffect(() => {
    if (uiModel === 'ModelR' && view === 'conversation') {
      const handleKeyPress = (e) => {
        if (e.key === 'ArrowLeft') {
          // Switch to previous contact
          const currentIndex = contacts.findIndex(c => c.name === selectedContact);
          const newIndex = currentIndex > 0 ? currentIndex - 1 : contacts.length - 1;
          setSelectedContact(contacts[newIndex].name);
          setRotation(prev => prev - 120); // Rotate counter-clockwise
        } else if (e.key === 'ArrowRight') {
          // Switch to next contact
          const currentIndex = contacts.findIndex(c => c.name === selectedContact);
          const newIndex = currentIndex < contacts.length - 1 ? currentIndex + 1 : 0;
          setSelectedContact(contacts[newIndex].name);
          setRotation(prev => prev + 120); // Rotate clockwise
        }
      };

      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, [selectedContact, view, uiModel, contacts]);

  const handleArrowLeft = () => {
    const currentIndex = contacts.findIndex(c => c.name === highlightedContact);
    const newIndex = currentIndex > 0 ? currentIndex - 1 : contacts.length - 1;
    setHighlightedContact(contacts[newIndex].name);
  };

  const handleArrowRight = () => {
    const currentIndex = contacts.findIndex(c => c.name === highlightedContact);
    const newIndex = currentIndex < contacts.length - 1 ? currentIndex + 1 : 0;
    setHighlightedContact(contacts[newIndex].name);
  };

  if (view === 'selection') {
    return (
      <div className="chat-container">
        {/* Contact Selection View */}
        <div className="contact-selection-view">
          <div className="contact-carousel">
            <button className="arrow-btn" onClick={handleArrowLeft}>◄</button>

            {contacts.map((contact) => (
              <div
                key={contact.name}
                className={`contact-card ${highlightedContact === contact.name ? 'highlighted' : ''}`}
                onClick={() => setHighlightedContact(contact.name)}
              >
                <img src={contact.image} alt={contact.name} className="contact-large-avatar" />
                <button className={`contact-btn ${highlightedContact === contact.name ? 'active' : ''}`}>
                  {contact.name}
                </button>
              </div>
            ))}

            <button className="arrow-btn" onClick={handleArrowRight}>►</button>
          </div>
        </div>

        {/* Control hints */}
        <div className="control-hints">
          <div className="hint-item">
            <img
              src={uiModel === 'ModelR' ? '/Resources/ModelR/ChooseIcon.png' : '/Resources/ModelD/Arrows.png'}
              alt="Choose"
              className="control-icon"
            />
            <span className="hint-text">CHOOSE</span>
          </div>
          <div className="hint-item">
            <span className="control-btn" onClick={handleConfirm}>A</span>
            <span className="hint-text">CONFIRM</span>
          </div>
          <div className="hint-item">
            <span className="control-btn" onClick={handleBack}>B</span>
            <span className="hint-text">BACK</span>
          </div>
        </div>
      </div>
    );
  }

  // Conversation View
  return (
    <div className="chat-container">
      {/* Chat Header */}
      <div className="chat-header">
        <img
          src={contacts.find(c => c.name === selectedContact)?.image}
          alt={selectedContact}
          className="chat-avatar"
        />
        <h2>{selectedContact}</h2>
      </div>

      {/* Messages */}
      <div className="chat-messages">
        {messages[selectedContact]?.map((message, index) => (
          <div
            key={index}
            className={`message ${message.sender === 'You' ? 'message-sent' : 'message-received'}`}
          >
            <div className="message-bubble">
              <p>{message.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Voice Input */}
      <div className="voice-input">
        <button
          className={`voice-btn ${isRecording ? 'recording' : ''}`}
          onClick={handleRecordToggle}
        >
          <img
            src={isRecording ? '/Resources/ModelD/VoiceRecording.png' : '/Resources/ModelD/Voice.png'}
            alt="Voice"
            className="voice-icon"
          />
        </button>
      </div>

      {/* Contact Switcher */}
      <div className="contact-switcher">
        {contacts.map((contact, index) => {
          const currentIndex = contacts.findIndex(c => c.name === selectedContact);
          return (
            <div
              key={contact.name}
              className={`switcher-contact ${selectedContact === contact.name ? 'active' : ''}`}
              onClick={() => {
                if (contact.name !== selectedContact && uiModel === 'ModelR') {
                  // Calculate rotation direction
                  const clickedIndex = index;
                  if (clickedIndex > currentIndex) {
                    setRotation(prev => prev + 120); // Rotate clockwise
                  } else {
                    setRotation(prev => prev - 120); // Rotate counter-clockwise
                  }
                }
                setSelectedContact(contact.name);
              }}
            >
              <img src={contact.image} alt={contact.name} className="switcher-avatar" />
              <span className="switcher-name">{contact.name}</span>
              {selectedContact === contact.name && <div className="online-indicator"></div>}
            </div>
          );
        })}

        {/* ChooseIcon for ModelR */}
        {uiModel === 'ModelR' && (
          <img
            src="/Resources/ModelR/ChooseIcon.png"
            alt="Choose Icon"
            className="chat-choose-icon"
            style={{ transform: `rotate(${rotation}deg)` }}
          />
        )}
      </div>

      {/* Control hints */}
      <div className="control-hints">
        <div className="hint-item">
          <img
            src={uiModel === 'ModelR' ? '/Resources/ModelR/ChooseIcon.png' : '/Resources/ModelD/Arrows.png'}
            alt="Choose"
            className="control-icon"
          />
          <span className="hint-text">CHOOSE</span>
        </div>
        <div className="hint-item">
          <span className="control-btn">A</span>
          <span className="hint-text">SELECT/RECORD</span>
        </div>
        <div className="hint-item">
          <span className="control-btn" onClick={handleBack}>B</span>
          <span className="hint-text">BACK/CANCEL</span>
        </div>
      </div>
    </div>
  );
}

export default Chat;
