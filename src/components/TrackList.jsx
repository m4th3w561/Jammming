import React from "react";
import { Box, Container, Grow, Button, Typography } from "@mui/material";
import Track from "./Track";

const TrackList = ({ resultList, playListName, playlistID, selectTracks, deleteTrack, tracks, returnTrack, context }) => {

  const handleSubmit = async () => {
    const trackUris = tracks.map(track => track.uri);
    try {
      const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.access_token}`,
          'Content-Type': " application/json"
        },
        body: JSON.stringify({
          "uris": trackUris
        }),
      });
      if (!response.ok) {
        throw new Error(`Failed to add tracks to ${playListName}: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error(`Error adding tracks for playlist ${playListName}:`, error);
    }
    returnTrack(tracks);
    deleteTrack("all");
    return;
  };

  const handleCancel = () => {
    returnTrack(tracks);
    deleteTrack("all");
    return;
  };

  return (
    <Container disableGutters maxWidth="lg">
      <Box sx={ { display: "flex", flexWrap: "wrap", justifyContent: "start", gap: 4 } }>
        { context === "search" ? (
          resultList.map((item, index) => {
            const handleClick = () => {
              deleteTrack(item, "search",);
              selectTracks(item);
            };

            return (
              <Grow
                key={ item.id || item.name || `search-${index}` }
                in={ true }
                style={ { transformOrigin: "left" } }
                timeout={ index * 500 }
              >
                <Box sx={ { width: "100%", minWidth: 460 } } onClick={ () => handleClick() }>
                  <Track
                    name={ item.name }
                    artist={ item.artists[0].name }
                    media={ item.album.images[1].url }
                    album={ item.album.name }
                    mediaAlt={ item.album.name }
                    button="add"
                  />
                </Box>
              </Grow>
            );
          })
        ) : context === "playList" ? (
          <Container disableGutters sx={ { display: "flex", flexDirection: "column", alignItems: "start", gap: 4 } }>
            { tracks.length > 0 &&
              <Box sx={ { width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 } }>
                <Typography component="div" variant="p" color="#9e9e9e" >
                  Adding tracks to
                  <span style={ { fontWeight: "bold" } }> { playListName } </span>
                </Typography>
                <Box sx={ { display: "flex", alignItems: "center", gap: 1 } }>
                  <Button
                    variant="contained"
                    sx={ { fontFamily: "Lexend" } }
                    onClick={ handleSubmit }
                    disabled={ !tracks.length > 0 }
                    size='small'
                    color="primary"
                  >
                    Save
                  </Button>
                  <Button
                    variant="outlined"
                    sx={ { fontFamily: "Lexend" } }
                    onClick={ handleCancel }
                    size='small'
                    color="primary"
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            }
            { tracks.length > 0 &&
              tracks.map((item, index) => {
                const handleClick = () => {
                  deleteTrack(item, "playList");
                  returnTrack(item);
                };
                return (
                  <Grow
                    key={ item.id || item.name || `playlist-${index}` }
                    in={ true }
                    style={ { transformOrigin: "left" } }
                    timeout={ 800 }
                  >
                    <Box sx={ { width: "100%", minWidth: 460 } } onClick={ () => handleClick() }>
                      <Track
                        name={ item.name }
                        artist={ item.artists[0].name }
                        media={ item.album.images[1].url }
                        album={ item.album.name }
                        mediaAlt={ item.album.name }
                        id={ item.id }
                        button="delete"
                      />
                    </Box>
                  </Grow>
                );
              })
            }

          </Container>
        )
          : null }
      </Box>
    </Container>
  );
};

export default TrackList;