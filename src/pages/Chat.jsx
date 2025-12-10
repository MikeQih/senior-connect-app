import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUIModel } from '../contexts/UIModelContext';
import { useController } from '../hardware/ControllerContext';
import './Chat.css';

const initialVoiceMessages = {
  Ben: [
    { sender: 'You', duration: '0:12', time: '10:20 AM' },
    { sender: 'Ben', duration: '0:07', time: '10:21 AM' },
    { sender: 'You', duration: '0:09', time: '10:24 AM' },
  ],
  Alice: [
    { sender: 'Alice', duration: '0:05', time: '09:15 AM' },
    { sender: 'You', duration: '0:08', time: '09:18 AM' },
  ],
  Ying: [
    { sender: 'Ying', duration: '0:10', time: '02:45 PM' },
    { sender: 'You', duration: '0:06', time: '02:50 PM' },
  ],
};

function Chat() {
  const navigate = useNavigate();
  const { uiModel } = useUIModel();
  const { lastAction, clearAction } = useController();

  // view: contact selection (big cards) OR conversation
  const [view, setView] = useState('selection'); // 'selection' | 'conversation'
  const [highlightedContact, setHighlightedContact] = useState('Alice');
  const [selectedContact, setSelectedContact] = useState(null); // Ying | Alice | Ben | null

  // voice messages state – local only, resets when page changes
  const [messagesByContact, setMessagesByContact] = useState(initialVoiceMessages);

  // interaction / focus
  const [focusArea, setFocusArea] = useState('mic'); // 'contacts' | 'mic' | 'messages'
  const [selectedMessageIndex, setSelectedMessageIndex] = useState(null);

  // recording / playback state
  const [mode, setMode] = useState('idle'); // 'idle' | 'recording' | 'playing'
  const [rotation, setRotation] = useState(0); // for ModelR choose icon

  const contacts = [
    { name: 'Ying', image: '/Resources/ModelD/Ying.png' },
    { name: 'Alice', image: '/Resources/ModelD/Alice.png' },
    { name: 'Ben', image: '/Resources/ModelD/Bob.png' }, // Ben uses Bob-style avatar in assets
  ];

  const currentMessages =
    selectedContact && messagesByContact[selectedContact]
      ? messagesByContact[selectedContact]
      : [];

  const helperText = (() => {
    if (mode === 'recording') return 'Press A again to stop recording';
    if (mode === 'playing') return 'Playing voice message...';
    if (focusArea === 'mic') return 'Press A to record a voice message';
    if (focusArea === 'messages') return 'Press A to hear this voice message';
    return 'Use arrows to choose who to chat with';
  })();

  const confirmContactSelection = () => {
    const name = highlightedContact || 'Alice';
    setSelectedContact(name);
    setView('conversation');
    setFocusArea('mic');
    setSelectedMessageIndex(null);
    setMode('idle');
  };

  const goBack = () => {
    if (view === 'conversation') {
      setView('selection');
      setSelectedContact(null);
      setFocusArea('contacts');
      setSelectedMessageIndex(null);
      setMode('idle');
    } else {
      navigate('/dashboard');
    }
  };

  /* ---------- HARDWARE INPUT ---------- */
  useEffect(() => {
    if (!lastAction || !lastAction.type) return;
    const action = lastAction.type;

    /* --- CONTACT SELECTION SCREEN --- */
    if (view === 'selection') {
      const index = contacts.findIndex(c => c.name === highlightedContact);

      if (action === 'LEFT') {
        const newIndex = (index - 1 + contacts.length) % contacts.length;
        setHighlightedContact(contacts[newIndex].name);
      } else if (action === 'RIGHT') {
        const newIndex = (index + 1) % contacts.length;
        setHighlightedContact(contacts[newIndex].name);
      } else if (action === 'A') {
        confirmContactSelection();
      } else if (action === 'B') {
        navigate('/dashboard');
      }

      clearAction();
      return;
    }

    /* --- CONVERSATION SCREEN --- */

    // Back behaviour
    if (action === 'B') {
      if (mode === 'recording') {
        // stop recording without saving anything
        setMode('idle');
      } else if (focusArea !== 'contacts') {
        setFocusArea('contacts');
        setSelectedMessageIndex(null);
      } else {
        goBack();
      }
      clearAction();
      return;
    }

    // Move focus up/down between areas: messages ↔ mic ↔ contacts
    if (action === 'UP') {
      if (focusArea === 'contacts') setFocusArea('mic');
      else if (focusArea === 'mic') setFocusArea('messages');
    } else if (action === 'DOWN') {
      if (focusArea === 'messages') setFocusArea('mic');
      else if (focusArea === 'mic') setFocusArea('contacts');
    }

        // HORIZONTAL MOVEMENT
    // If NOT on messages, LEFT/RIGHT swaps between chats
    if (focusArea !== 'messages' && selectedContact && (action === 'LEFT' || action === 'RIGHT')) {
      const currentIndex = contacts.findIndex(c => c.name === selectedContact);
      if (currentIndex !== -1) {
        const delta = action === 'LEFT' ? -1 : 1;
        const newIndex = (currentIndex + delta + contacts.length) % contacts.length;
        setSelectedContact(contacts[newIndex].name);
        if (uiModel === 'ModelR') {
          setRotation(r => r + (delta === 1 ? 120 : -120));
        }
        clearAction();
        return;
      }
    }

    // If focus IS on messages, LEFT/RIGHT moves between voice messages
    if (focusArea === 'messages' && currentMessages.length > 0) {
      if (selectedMessageIndex === null) {
        setSelectedMessageIndex(0);
      } else if (action === 'LEFT') {
        setSelectedMessageIndex(
          (selectedMessageIndex - 1 + currentMessages.length) % currentMessages.length
        );
      } else if (action === 'RIGHT') {
        setSelectedMessageIndex(
          (selectedMessageIndex + 1) % currentMessages.length
        );
      }
    }


    // A button (actions)
    if (action === 'A') {
      if (focusArea === 'mic') {
        // toggle recording
        if (mode === 'recording') {
          // finish recording and append a fake message
          const fakeDuration = '0:07';
          const time = new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          });

          if (selectedContact) {
            setMessagesByContact(prev => ({
              ...prev,
              [selectedContact]: [
                ...(prev[selectedContact] || []),
                { sender: 'You', duration: fakeDuration, time },
              ],
            }));
          }
          setMode('idle');
        } else {
          setMode('recording');
          setSelectedMessageIndex(null);
        }
      } else if (focusArea === 'messages' && selectedMessageIndex !== null) {
        // pretend to play message
        setMode('playing');
        setTimeout(() => setMode('idle'), 1500);
      } else if (focusArea === 'contacts' && !selectedContact) {
        confirmContactSelection();
      }
    }

    clearAction();
  }, [
    lastAction,
    view,
    focusArea,
    mode,
    selectedContact,
    highlightedContact,
    currentMessages.length,
    selectedMessageIndex,
    uiModel,
    contacts,
    clearAction,
    navigate,
  ]);

  /* ---------- RENDER ---------- */

  // Big contact chooser screen
  if (view === 'selection') {
    return (
      <div className="chat-container">
        <div className="contact-selection-view">
          <div className="contact-carousel">
            <button
              className="arrow-btn"
              onClick={() => {
                const index = contacts.findIndex(c => c.name === highlightedContact);
                const newIndex = (index - 1 + contacts.length) % contacts.length;
                setHighlightedContact(contacts[newIndex].name);
              }}
            >
              ◄
            </button>

            {contacts.map(contact => (
              <div
                key={contact.name}
                className={
                  'contact-card ' +
                  (highlightedContact === contact.name ? 'highlighted' : '')
                }
                onClick={() => setHighlightedContact(contact.name)}
              >
                <img
                  src={contact.image}
                  className="contact-large-avatar"
                  alt={contact.name}
                />
                <button
                  className={
                    'contact-btn ' +
                    (highlightedContact === contact.name ? 'active' : '')
                  }
                  onClick={confirmContactSelection}
                >
                  {contact.name}
                </button>
              </div>
            ))}

            <button
              className="arrow-btn"
              onClick={() => {
                const index = contacts.findIndex(c => c.name === highlightedContact);
                const newIndex = (index + 1) % contacts.length;
                setHighlightedContact(contacts[newIndex].name);
              }}
            >
              ►
            </button>
          </div>
        </div>

        {/* Control hints - bottom left */}
        <div className="control-hints">
          <div className="hint-item">
            <img
              src={
                uiModel === 'ModelR'
                  ? '/Resources/ModelR/ChooseIcon.png'
                  : '/Resources/ModelD/Arrows.png'
              }
              className="control-icon"
              alt="Choose"
            />
            <span className="hint-text">CHOOSE</span>
          </div>
          <div className="hint-item">
            <span className="control-btn">A</span>
            <span className="hint-text">SELECT</span>
          </div>
          <div className="hint-item">
            <span className="control-btn">B</span>
            <span className="hint-text">BACK</span>
          </div>
        </div>
      </div>
    );
  }

  // Conversation screen
  const activeContact = contacts.find(c => c.name === selectedContact);

  return (
    <div className="chat-container">
      <div className="chat-header">
        {activeContact && (
          <img
            src={activeContact.image}
            className="chat-avatar"
            alt={activeContact.name}
          />
        )}
        <h2>{selectedContact}</h2>
      </div>

      <div className="chat-messages">
        {currentMessages.map((msg, i) => (
          <div
            key={i}
            className={
              'message ' +
              (msg.sender === 'You' ? 'message-sent' : 'message-received') +
              (focusArea === 'messages' && selectedMessageIndex === i
                ? ' focused'
                : '')
            }
          >
            <div className="message-bubble">
              <div className="voice-wave" />
              <div className="voice-meta">
                <span className="voice-duration">{msg.duration}</span>
                <span className="voice-time">{msg.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

            {/* Bottom interaction: helper text + mic + contacts in one row */}
      <div className="bottom-interaction">

  {/* Helper text ABOVE mic */}
  <div className="mic-block">
    <p className="helper-text">{helperText}</p>

    <button
      className={
        'voice-btn ' +
        (mode === 'recording' ? 'recording ' : '') +
        (focusArea === 'mic' ? 'focused' : '')
      }
      onClick={() => {
        if (mode === 'recording') {
          const fakeDuration = '0:07';
          const time = new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          });
          if (selectedContact) {
            setMessagesByContact(prev => ({
              ...prev,
              [selectedContact]: [
                ...(prev[selectedContact] || []),
                { sender: 'You', duration: fakeDuration, time },
              ],
            }));
          }
          setMode('idle');
        } else {
          setMode('recording');
          setSelectedMessageIndex(null);
        }
      }}
    >
      <img
        src={
          mode === 'recording'
            ? '/Resources/ModelR/DuringCallingWave.png'
            : '/Resources/ModelD/Mic.svg'
        }
        className={
          'voice-icon ' + (mode === 'recording' ? 'recording-wave' : '')
        }
        alt="Voice"
      />
    </button>
  </div>

  {/* Contact cards row stays the same */}
  <div className="contact-switcher">
    {contacts.map((contact, i) => {
      const indexNow = contacts.findIndex(c => c.name === selectedContact);
      const isActive = selectedContact === contact.name;
      const isFocused = focusArea === 'contacts' && isActive;

      return (
        <div
          key={contact.name}
          className={
            'switcher-contact ' +
            (isActive ? 'active ' : '') +
            (isFocused ? 'focused' : '')
          }
          onClick={() => {
            if (selectedContact !== contact.name && uiModel === 'ModelR') {
              setRotation(prev => prev + (i > indexNow ? 120 : -120));
            }
            setSelectedContact(contact.name);
          }}
        >
          <img
            src={contact.image}
            className="switcher-avatar"
            alt={contact.name}
          />
          <span className="switcher-name">{contact.name}</span>
          {isActive && <div className="online-indicator" />}
        </div>
      );
    })}

    {uiModel === 'ModelR' && (
      <img
        src="/Resources/ModelR/ChooseIcon.png"
        className="chat-choose-icon"
        style={{ transform: `rotate(${rotation}deg)` }}
        alt="Rotate to choose"
      />
    )}
  </div>
</div>



      {/* Control hints bottom-left */}
      <div className="control-hints">
        <div className="hint-item">
          <img
            src={
              uiModel === 'ModelR'
                ? '/Resources/ModelR/ChooseIcon.png'
                : '/Resources/ModelD/Arrows.png'
            }
            className="control-icon"
            alt="Choose"
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
