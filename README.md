# Welcome To JAMMMING

A portoflio project from Codecademy.
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

###### This project is a simple spotify playlist editor that allows users to search for songs, create or edit playlists directly from their spotify accounts.

### To enable this app, please follow these steps:

#### Clone this repository

You can do so from your terminal using the following command:
`git clone https://github.com/m4th3w561/Jammming.git`

#### Install dependencies

Run the following command in your terminal to install the required dependencies:
`npm install`

#### Create a Spotify Developer Account and App
1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/)
2. Create a new app
3. Go to the "Edit Settings" tab and add a redirect URI ("http://localhost:3000/")
4. Go to the "Edit Settings" tab and add copy client ID
5. Go to the root directory where you clone the repository and create a new file called `.env` and add the following line: `REACT_APP_CLIENT_ID={Paste your client ID here}`

#### Start the app
`npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

