# Firebase Setup Guide for Matching Pairs Game

## Overview
This document explains how to set up Firebase for storing Matching Pairs game scores, including participant IDs, timestamps, and game data.

## What's Already Done

1. **Installed Firebase**: The Firebase SDK has been added to your project
2. **Created Firebase Configuration**: `src/firebase/config.js`
3. **Created Game Scores Module**: `src/firebase/gameScores.js` with functions to:
   - Save game scores
   - Retrieve participant scores
   - Get best scores per level
4. **Integrated with MatchingPairs Game**: Automatically saves scores when a level is completed

## Setup Steps

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" (or select an existing project)
3. Follow the setup wizard

### 2. Create a Firestore Database

1. In your Firebase project, go to **Firestore Database**
2. Click "Create database"
3. Choose **Start in test mode** (for development) or **Production mode**
4. Select a location for your database

### 3. Get Your Firebase Configuration

1. In Firebase Console, click the gear icon (⚙️) next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click the Web icon (`</>`) to create a web app
5. Register your app with a nickname (e.g., "SeniorConnect")
6. Copy the `firebaseConfig` object

### 4. Update Your Configuration File

Open `src/firebase/config.js` and replace the placeholder values with your actual Firebase configuration:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 5. Configure Firestore Security Rules

In Firebase Console → Firestore Database → Rules, add appropriate security rules:

#### Development Rules (Not secure - use only for testing):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

#### Production Rules (Recommended):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /gameScores/{scoreId} {
      // Allow anyone to read scores
      allow read: if true;

      // Only allow writing with valid data structure
      allow create: if request.resource.data.keys().hasAll([
        'participantId', 'gameType', 'level', 'moves', 'time', 'timestamp'
      ]);

      // Prevent updates and deletes for data integrity
      allow update, delete: if false;
    }
  }
}
```

## Data Structure

Each game score document in the `gameScores` collection contains:

```javascript
{
  participantId: string,      // Backend participant ID
  gameType: string,           // "matching_pairs"
  level: number,              // 1-5
  moves: number,              // Number of moves taken
  time: number,               // Time in seconds
  timestamp: Timestamp,       // Firebase server timestamp
  createdAt: string          // ISO string date
}
```

## Usage in Code

The game automatically saves scores when a level is completed. No additional code is needed!

### Setting Participant ID

Currently, the participant ID is hardcoded as `"TEST_PARTICIPANT_001"`. To use actual participant IDs:

1. Open `src/pages/MatchingPairs.jsx`
2. Find line 84:
   ```javascript
   const [participantId, setParticipantId] = useState("TEST_PARTICIPANT_001");
   ```
3. Replace with your backend participant ID, for example:
   ```javascript
   const [participantId, setParticipantId] = useState(currentUser?.id || "GUEST");
   ```

### Available Functions

Import from `src/firebase/gameScores.js`:

```javascript
import {
  saveMatchingPairsScore,
  getParticipantScores,
  getGameScores,
  getBestScores
} from '../firebase/gameScores';

// Save a score (already integrated)
await saveMatchingPairsScore(participantId, level, moves, time);

// Get all scores for a participant
const scores = await getParticipantScores("PARTICIPANT_001");

// Get all scores for matching_pairs game
const allScores = await getGameScores("matching_pairs");

// Get best scores per level for a participant
const bestScores = await getBestScores("PARTICIPANT_001", "matching_pairs");
```

## Testing

1. Run your app: `npm run dev`
2. Play the Matching Pairs game
3. Complete a level
4. Check the browser console for "Score successfully saved to Firebase!"
5. Go to Firebase Console → Firestore Database
6. You should see a new document in the `gameScores` collection

## Troubleshooting

### "Failed to save score" error
- Check that you've updated `src/firebase/config.js` with your actual Firebase credentials
- Verify your Firestore security rules allow writes
- Check browser console for detailed error messages

### No data appearing in Firestore
- Make sure you've created a Firestore database in Firebase Console
- Verify your Firebase configuration is correct
- Check that your internet connection is working

### CORS or authentication errors
- Ensure your domain is authorized in Firebase Console → Authentication → Settings → Authorized domains
- For local development, `localhost` should be authorized by default

## Next Steps

- Set up Firebase Authentication for secure user management
- Create a leaderboard component using `getGameScores()`
- Add data analytics using Firebase Analytics
- Implement user profiles with best scores display
