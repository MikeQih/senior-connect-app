import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUIModel } from '../contexts/UIModelContext';
import { useController } from '../hardware/ControllerContext';
import './Chat.css';

function Chat() {
  const [view, setView] = useState('selection'); // 'selection' or 'conversation'
  const [selectedContact, setSelectedContact] = useState(null);
  const [highlightedContact, setHighlightedContact] = useState('Alice');
  const [isRecording, setIsRecording] = useState(false);
  const [rotation, setRotation] = useState(0);

  const navigate = useNavigate();
  const { uiModel } = useUIModel();
  const { lastAction, clearAction } = useController();

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

  const handleBack = () => {
    if (view === 'conversation') {
      setView('selection');
      setSelectedContact(null);
    } else {
      navigate('/dashboard');
    }
  };

  const handleArrowLeft = () => {
    const currentIndex = contacts.findIndex(c => c.name === highlightedContact);
    const newIndex = (currentIndex - 1 + contacts.length) % contacts.length;
    setHighlightedContact(contacts[newIndex].name);
  };

  const handleArrowRight = () => {
    const currentIndex = contacts.findIndex(c => c.name === highlightedContact);
    const newIndex = (currentIndex + 1) % contacts.length;
    setHighlightedContact(contacts[newIndex].name);
  };

  // HARDWARE CONTROLLER
  useEffect(() => {
    if (!lastAction?.type) return;

    const action = lastAction.type;

    // Selection View Actions
    if (view === 'selection') {
      if (action === "LEFT") {
        handleArrowLeft();
      }

      if (action === "RIGHT") {
        handleArrowRight();
      }

      if (action === "A") {
        handleConfirm();
      }

      if (action === "B") {
        navigate('/dashboard');
      }

      clearAction();
      return;
    }

    // Conversation View Actions
    if (view === 'conversation') {
      const currentIndex = contacts.findIndex(c => c.name === selectedContact);

      if (action === "LEFT") {
        const newIndex = (currentIndex - 1 + contacts.length) % contacts.length;
        setSelectedContact(contacts[newIndex].name);
        setRotation(prev => prev - 120);
      }

      if (action === "RIGHT") {
        const newIndex = (currentIndex + 1) % contacts.length;
        setSelectedContact(contacts[newIndex].name);
        setRotation(prev => prev + 120);
      }

      if (action === "A") {
        setIsRecording(prev => !prev);
      }

      if (action === "B") {
        setView('selection');
        setSelectedContact(null);
      }

      clearAction();
      return;
    }

  }, [lastAction, view, selectedContact, highlightedContact]);

  if (view === 'selection') {
    return (
      <div className="chat-container">
        <div className="contact-selection-view">
          <div className="contact-carousel">
            <button className="arrow-btn" onClick={handleArrowLeft}>◄</button>

            {contacts.map((contact) => (
              <div
                key={contact.name}
                className={`contact-card ${highlightedContact === contact.name ? 'highlighted' : ''}`}
                onClick={() => setHighlightedContact(contact.name)}
              >
                <img src={contact.image} className="contact-large-avatar" />
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
              className="control-icon"
            />
            <span className="hint-text">CHOOSE</span>
          </div>
          <div className="hint-item">
            <span className="control-btn">A</span>
            <span className="hint-text">CONFIRM</span>
          </div>
          <div className="hint-item">
            <span className="control-btn">B</span>
            <span className="hint-text">BACK</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <img
          src={contacts.find(c => c.name === selectedContact)?.image}
          className="chat-avatar"
        />
        <h2>{selectedContact}</h2>
      </div>

      <div className="chat-messages">
        {messages[selectedContact]?.map((msg, i) => (
          <div key={i} className={`message ${msg.sender === 'You' ? 'message-sent' : 'message-received'}`}>
            <div className="message-bubble">
              <p>{msg.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="voice-input">
        <button
          className={`voice-btn ${isRecording ? 'recording' : ''}`}
          onClick={() => setIsRecording(!isRecording)}
        >
          <img
            src={isRecording ? '/Resources/ModelD/VoiceRecording.png' : '/Resources/ModelD/Voice.png'}
            className="voice-icon"
          />
        </button>
      </div>

      <div className="contact-switcher">
        {contacts.map((contact, i) => {
          const indexNow = contacts.findIndex(c => c.name === selectedContact);

          return (
            <div
              key={contact.name}
              className={`switcher-contact ${selectedContact === contact.name ? 'active' : ''}`}
              onClick={() => {
                if (contact.name !== selectedContact && uiModel === 'ModelR') {
                  setRotation(prev => prev + (i > indexNow ? 120 : -120));
                }
                setSelectedContact(contact.name);
              }}
            >
              <img src={contact.image} className="switcher-avatar" />
              <span>{contact.name}</span>
              {selectedContact === contact.name && <div className="online-indicator"></div>}
            </div>
          );
        })}

        {uiModel === 'ModelR' && (
          <img
            src="/Resources/ModelR/ChooseIcon.png"
            className="chat-choose-icon"
            style={{ transform: `rotate(${rotation}deg)` }}
          />
        )}
      </div>

      <div className="control-hints">
        <div className="hint-item">
          <img
            src={uiModel === 'ModelR' ? '/Resources/ModelR/ChooseIcon.png' : '/Resources/ModelD/Arrows.png'}
            className="control-icon"
          />
          <span className="hint-text">CHOOSE</span>
        </div>
        <div className="hint-item">
          <span className="control-btn">A</span>
          <span className="hint-text">SELECT / RECORD</span>
        </div>
        <div className="hint-item">
          <span className="control-btn">B</span>
          <span className="hint-text">BACK</span>
        </div>
      </div>
    </div>
  );
}

export default Chat;
