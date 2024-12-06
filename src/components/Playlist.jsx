import React, { useState } from "react";
import { Container, Button, Box, TextField } from "@mui/material";
import OldPlaylist from "./OldPlaylist";

const Playlist = ({
  userID,
  tracks,
  deleteTrack,
  returnTrack,
  deletePlaylist,
}) => {
  const [createToggle, setCreateToggle] = useState(false);
  const [newPlaylist, setNewPlaylist] = useState("");
  const [description, setDescription] = useState("");
  const [spotifyPlaylist, setSpotifyPlaylist] = useState([]);

  const handleToggle = () => {
    setCreateToggle(true);
  };

  const handleChange = (event, item) => {
    if (item === "title") {
      setNewPlaylist(event.target.value);
    } else if (item === "description") {
      setDescription(event.target.value);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const newPlaylistName = newPlaylist;
    const newDescription = description;
    if (newPlaylist && description) {
      try {
        const response = await fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.access_token}`,
            'Content-Type': " application/json"
          },
          body: JSON.stringify({
            name: newPlaylistName,
            description: newDescription,
            public: true,
            collaborative: false,
          }),
        });
        if (!response.ok) {
          throw new Error(`Failed to create playlist: ${response.status} ${response.statusText}`);
        }
      } catch (error) {

      }
    };

    setNewPlaylist("");
    setDescription("");
    setCreateToggle(false);
    return;
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSubmit(event);
    }
  };

  const handleCancel = () => {
    setNewPlaylist("");
    setDescription("");
    setCreateToggle(false);
  };

  const loadPlaylist = async () => {
    try {
      const result = await fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
        method: "GET",
        headers: { Authorization: `Bearer ${localStorage.access_token}` }
      });

      const data = await result.json();

      // Filter playlists where the owner is the user
      const userOwnedPlaylists = data.items.filter(item => item?.owner?.id === userID);
      setSpotifyPlaylist(userOwnedPlaylists);
    } catch (error) {
      console.error("Error retrieving user's playlists", error);
    }
  };

  return (
    <Container maxWidth="lg" sx={ { display: "flex", flexDirection: "column", alignItems: "start", gap: 4, marginTop: 2 } } >
      { !createToggle ?
        <Box sx={ { display: "flex", gap: 4 } }>
          <Button
            variant="contained"
            sx={ { fontFamily: "Lexend", minWidth: "100%", maxWidth: 82 } }
            onClick={ handleToggle }
            size='large'
            color="primary"
          >
            Create Playlist
          </Button>
          <Button
            variant="contained"
            sx={ { fontFamily: "Lexend", minWidth: "100%", maxWidth: 100 } }
            onClick={ loadPlaylist }
            size='large'
            color="primary"
          >
            (Re) Load Playlist
          </Button>
        </Box>
        :
        <Container disableGutters sx={ { display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "start" } }>
          <Box sx={ { display: "flex", alignItems: "center", gap: 4 } }>
            <h4>Create A New Playlist</h4>
            <Button
              variant="contained"
              sx={ { fontFamily: "Lexend", height: "60%" } }
              onClick={ loadPlaylist }
              size='large'
              color="primary"
            >
              (RE)  Load Playlist
            </Button>
          </Box>
          <Container disableGutters sx={ { display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "start", gap: 4 } }>
            <Box
              component="form"
              sx={ { display: "flex", alignItems: "center", gap: 2 } }
            >
              <Box component="form"
                sx={ { display: "flex", alignItems: "center", gap: 2 } }>
                <TextField
                  id="outlined-search"
                  label="Playlist Title"
                  value={ newPlaylist }
                  onChange={ event => handleChange(event, "title") }
                  type="text"
                  fullWidth
                  required
                  placeholder="Playlist name"
                  onKeyDown={ handleKeyDown }
                />
              </Box>
              <Box component="form"
                sx={ { display: "flex", alignItems: "center", gap: 2 } }>
                <TextField
                  id="outlined-search"
                  label="Description"
                  value={ description }
                  onChange={ event => handleChange(event, "description") }
                  type="text"
                  fullWidth
                  placeholder="Playlist description"
                  onKeyDown={ handleKeyDown }
                />
              </Box>
            </Box>
            <Container disableGutters sx={ { display: "flex", flexWrap: "wrap", justifyContent: "start", gap: 4, width: "100%" } }>
              <Box sx={ { display: "flex", gap: 2 } }>
                <Button
                  variant="contained"
                  sx={ { fontFamily: "Lexend" } }
                  onClick={ handleSubmit }
                  disabled={ !newPlaylist }
                  size='large'
                  color="primary"
                >
                  Save to Spotify
                </Button>
                <Button
                  variant="contained"
                  sx={ { fontFamily: "Lexend" } }
                  onClick={ handleCancel }
                  size='large'
                  color="primary"
                >
                  Cancel
                </Button>
              </Box>
            </Container>
          </Container>
        </Container>
      }
      { spotifyPlaylist && (
        <OldPlaylist spotifyPlaylist={ spotifyPlaylist } deleteTrack={ deleteTrack } deletePlaylist={ deletePlaylist }
          setSpotifyPlaylist={ setSpotifyPlaylist } userID={ userID } tracks={ tracks } returnTrack={ returnTrack }
        />
      ) }
    </Container>
  );
};

export default Playlist;
