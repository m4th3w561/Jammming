import React from "react";
import { Box, Container, Grow, Typography } from "@mui/material";
import Track from "./Track";

const TrackList = ({ resultList, selectTracks, deleteTrack, tracks, returnTrack, context }) => {

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
            { tracks.length > 0 ? (
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
                    timeout={ index * 500 }
                  >
                    <Box sx={ { width: "100%", minWidth: 460 } } onClick={ () => handleClick() }>
                      <Track
                        name={ item.name }
                        artist={ item.artists[0].name }
                        media={ item.album.images[1].url }
                        album={ item.album.name }
                        mediaAlt={ item.album.name }
                        id={item.id}
                        button="delete"
                      />
                    </Box>
                  </Grow>
                );
              })
            ) : (
              <Typography>No tracks added to the playlist yet.</Typography>
            ) }
          </Container>
        )  : null }
      </Box>
    </Container>

  );
};

export default TrackList;
