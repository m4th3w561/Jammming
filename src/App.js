import './App.css';
import React, { useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, Button } from '@mui/material';
import SearchBar from './components/presentation/SearchBar';
import SearchResults from './components/presentation/SearchResults';
import Playlist from './components/presentation/Playlist';
import { redirectToAuthCodeFlow, getToken, getUserID } from './authenticator';
import Footer from './components/presentation/Footer';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App () {
  const [resultList, setResultList] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [playList, setPlayList] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userID, setUserID] = useState(null);

  const retrieveResult = (result) => {
    setResultList(result);
  };

  const selectTracks = (item) => {
    setTracks(prevTracks => prevTracks.includes(item) ? prevTracks : [...prevTracks, item]);
    setResultList(prevTracks => prevTracks.filter(track => track !== item));
  };

  const deleteTrack = (item, context, index) => {
    if (item === "all") {
      return setTracks([]);
    }

    switch (context) {
      case "search":
        return setResultList((prev) => prev.filter((track) => track !== item));

      case "playList":
        return setTracks((prev) => prev.filter((track) => track !== item));

      case "oldPlaylist":
        setPlayList((prev) =>
          prev.map((playlist, i) =>
            i === index
              ? {
                ...playlist,
                tracks: playlist.tracks.filter(
                  (track) => track.id !== item.id
                ),
              }
              : playlist
          )
        );
        break;

      default:
        console.warn("Invalid context:", context);
    }
  };

  // const editPlaylistName = (newName, index) => {
  //   setPlayList((prev) =>
  //     prev.map((playlist, i) =>
  //       i === index
  //         ? {
  //           ...playlist,
  //           name: newName,
  //         }
  //         : playlist
  //     )
  //   );
  // };

  // const editPlaylistDescription = (newDescription, index) => {
  //   setPlayList((prev) =>
  //     prev.map((playlist, i) =>
  //       i === index
  //         ? {
  //           ...playlist,
  //           description: newDescription,
  //         }
  //         : playlist
  //     )
  //   );
  // };

  const addNewPlayList = (item) => {
    setPlayList(prevTracks => prevTracks.includes(item) ? prevTracks : [...prevTracks, item]);
  };

  const deletePlaylist = (item) => {
    setPlayList((prev) => prev.filter((track) => track !== item));
  };

  const returnTrack = (item) => {
    if (Array.isArray(item)) {
      setResultList(prevTracks => {
        const newTracks = item.filter(track => !prevTracks.includes(track));
        return [...prevTracks, ...newTracks];
      });
    } else {
      setResultList(prevTracks => {
        return prevTracks.includes(item) ? prevTracks : [...prevTracks, item];
      });
    }
  };

  const clientId = process.env.REACT_APP_CLIENT_ID;
  const urlParams = new URLSearchParams(window.location.search);
  let code = urlParams.get('code');
  const redirectUri = "http://localhost:3000/";

  const logData = async () => {
    // console.log(playList);
    // console.log(isAuthenticated);
    try {
      const result = await fetch(`https://api.spotify.com/v1/playlists/25c0OvctWpld9RRBxiGQcU/tracks`, {
          method: "GET",
          headers: { Authorization: `Bearer ${localStorage.access_token}` },
      });
      const data = await result.json();
      console.log(data)
      return data.items || [];

  } catch (error) {
      console.error(`Error retrieving tracks for playlist:`, error);
      return [];
  }
  };


  const handleLogin = async () => {
    setIsLoading(true);
    try {
      if (!code) {
        redirectToAuthCodeFlow(clientId, redirectUri);
      } else {
        await getToken(clientId, code, redirectUri);
        setIsAuthenticated(true);

        const userID = await getUserID(localStorage.access_token);
        setUserID(userID);
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    // Check for 'code' in the URL when the app loads
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code && !isAuthenticated) {
      handleLoginWithCode(code);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const handleLoginWithCode = async (code) => {
    setIsLoading(true);
    try {
      await getToken(clientId, code, redirectUri);
      setIsAuthenticated(true);
      const userID = await getUserID(localStorage.access_token);
      setUserID(userID);

    } catch (error) {
      console.error("Error during login with code:", error);
    }
    setIsLoading(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserID(null);
    localStorage.clear();
    // Optionally, log out any other session data (but keep cached data intact)
    // Example: Don't touch the 'cachedData' in localStorage
    // localStorage.removeItem('cachedData'); // Only remove if you don't want to preserve

    window.location.href = "http://localhost:3000/";

    // Keep cached data in memory (assuming you store it in React state or localStorage)
    // Example: Leave cacheData untouched if it's stored in a state
    console.log("User logged out but cache data retained");
  };

  return (
    <div className="App">
      <ThemeProvider theme={ darkTheme }>
        <CssBaseline />
        <Container maxWidth="100%" disableGutters sx={ {
          display: "flex", flexDirection: "column", alignItems:
            "center", justifyContent: "center", gap: 4
        } }>
          <header className="App-header" style={ { width: "100%" } }>
            <h4>WELCOME TO JAMMMING</h4>
          </header>
          { isAuthenticated ?
            <Container maxWidth="xl" sx={ { display: "flex", flexDirection: "column", gap: 2, alignItems: "center" } }>
              <SearchBar retrieveResult={ retrieveResult } />
              <Container maxWidth="xl" disableGutters sx={ { display: "flex", padding: "1rem 0" } }>
                <SearchResults resultList={ resultList } selectTracks={ selectTracks } deleteTrack={ deleteTrack } />
                <Playlist userID={ userID } tracks={ tracks } deleteTrack={ deleteTrack } returnTrack={ returnTrack } addNewPlayList={ addNewPlayList } playList={ playList } deletePlaylist={ deletePlaylist } />
              </Container>
            </Container> :
            <Button
              variant="contained"
              sx={ { fontFamily: "Lexend" } }
              onClick={ () => handleLogin() }
              size='large'
              color="primary"
            >
              { isLoading ? "Logging in..." : "Login" }
            </Button>
          }
          <Footer logData={ logData } handleLogout={ handleLogout } />
        </Container>
      </ThemeProvider>
    </div>
  );
}

export default App;
