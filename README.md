# TrackIt - Location Tracking Web App

TrackIt is a real-time location tracking web application that allows users to share their location with others. It uses the Socket.IO library to establish a real-time communication channel between the server and the clients.

## Features

- Real-time location updates
- Map visualization with markers for different users
- Fixed marker for the home location
- User authentication and authorization

## Prerequisites

- Node.js
- npm

## Installation

Clone the repository:
```bash
git clone https://github.com/chetan202022/TrackIt-Location-Tracking-Web-App.git
```

Install dependencies:
```bash
npm install
```

Start the server:
```bash
node app.js
```

## Project Structure

```
.
├── node_modules
├── public
│   ├── css
│   │   └── style.css
│   └── js
│       └── script.js
├── views
│   └── index.ejs
├── README.md
├── app.js
├── package-lock.json
└── package.json
```

## Usage

1. Open your browser and navigate to `http://localhost:3000`.
2. The application will automatically connect to the server and display a map.
3. The user's current location will be shown as a marker on the map.
4. Other users' locations will be displayed as markers on the map in real-time.
5. The home location is marked with a fixed marker.

## Configuration

You can configure the home location by modifying the `homeLocation` variable in the `public/js/script.js` file.

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please submit a pull request.

## Acknowledgements

- [Socket.IO](https://socket.io/) - Real-time communication library
- [Leaflet](https://leafletjs.com/) - JavaScript library for interactive maps

