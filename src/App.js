import './App.css';
import React, { useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, Button, Box } from '@mui/material';
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';
import Playlist from './components/Playlist';
import { redirectToAuthCodeFlow, getToken, getUserID } from './authenticator';
import Footer from './components/Footer';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App () {
  const [result, setResult] = useState({});
  const [resultList, setResultList] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userID, setUserID] = useState(null);

  const searchResult = (data) => {
    setResult(data);
  };
  const retrieveResult = (result) => {
    setResultList(result);
  };
  const fetchResults = async (url) => {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.access_token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch results');
      }
      const data = await response.json();
      setResult(data.tracks);
      setResultList(data.tracks.items);
    } catch (error) {
      console.error('Error fetching results:', error);
    }
  };

  const nextResults = () => {
    if (result.next) {
      fetchResults(result.next);
    }
  };

  const prevResults = () => {
    if (result.previous) {
      fetchResults(result.previous);
    }
  };

  const selectTracks = (item) => {
    setTracks(prevTracks => prevTracks.includes(item) ? prevTracks : [item, ...prevTracks]);
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

      default:
        console.warn("Invalid context:", context);
    }
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
  const redirectUri = "https://jammming-a-spotify-playlist-editor.netlify.app/";

  const logData = async () => {
    console.log(tracks);
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
    window.location.href = "http://localhost:3000/";
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
              <SearchBar retrieveResult={ retrieveResult } searchResult={ searchResult } resultList={ resultList } />
              <Container maxWidth="xl" disableGutters sx={ { display: "flex", padding: "1rem 0" } }>
                <Box sx={ { display: "flex", padding: "1rem 0", width: "100%", flexDirection: "column", alignItems: "center", marginBottom: 6, gap: 4 } }>
                  <SearchResults resultList={ resultList } selectTracks={ selectTracks } deleteTrack={ deleteTrack } />
                  { resultList.length > 0 && (
                    <Box sx={ { display: 'flex', gap: 1, width: "100%", minWidth: "100%", maxWidth: 100, justifyContent:"center" } }>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={ prevResults }
                        disabled={ !result.previous } // Disable if no previous
                      >
                        Back
                      </Button>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={ nextResults }
                        disabled={ !result.next } // Disable if no next
                      >
                        Next
                      </Button>
                    </Box>
                  ) }
                </Box>
                <Playlist userID={ userID } tracks={ tracks } deleteTrack={ deleteTrack } returnTrack={ returnTrack } />
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
};

export default App;
