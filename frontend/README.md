# Transport Tracker Frontend

React frontend application for the Transport Tracking App.

## Setup Instructions

1. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Create .env file**
   Create a `.env` file in the `frontend` directory with:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

3. **Start the Development Server**
   ```bash
   npm start
   ```
   The app will open at `http://localhost:3000`

## Backend Setup

Make sure the backend is running:
```bash
cd backend
npm run dev
```

## Features

- **Live Location**: Displays real-time vehicle location with auto-refresh every 5 seconds
- **ETA**: Shows estimated time of arrival information
- **Interactive Map**: Uses Leaflet maps to visualize vehicle positions

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── LiveLocation.jsx
│   │   ├── ETA.jsx
│   │   └── MapView.jsx
│   ├── services/
│   │   └── api.js
│   ├── App.jsx
│   ├── index.js
│   └── styles.css
├── .env
├── package.json
└── README.md
```

