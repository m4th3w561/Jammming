import React from "react";
import { Box, Container, Grow } from "@mui/material";
import OldTrack from "./OldTrack";

const OldTrackList = ({ deleteTrack, tracks, playListIndex, context }) => {
    return (
        <Container disableGutters maxWidth="lg">
            <Box sx={ { display: "flex", flexWrap: "wrap", justifyContent: "start", gap: 4 } }>
                <Container disableGutters sx={ { display: "flex", flexDirection: "column", gap: 4 } }>
                    { tracks.map((item, index) => {
                        const deleteOldTrack = () => {
                            deleteTrack(item, context, playListIndex);
                        };
                        return (
                            <Grow
                                key={ item.id || item.name || `playlist-${index}` }
                                in={ true }
                                style={ { transformOrigin: "left" } }
                                timeout={ index * 500 }
                            >
                                <Box sx={ { width: "100%", minWidth: 460 } }>
                                    <OldTrack
                                        name={ item.track?.name }
                                        artist={ item.track?.artists[0].name }
                                        media={ item.track?.album.images[1].url }
                                        album={ item.track?.album.name }
                                        mediaAlt={ item.track?.album.name }
                                        button="delete"
                                        deleteOldTrack={ deleteOldTrack }
                                        context={ "trackName" }
                                    />
                                </Box>
                            </Grow>
                        );
                    }) }
                </Container>
            </Box>
        </Container>
    );
};

export default OldTrackList;
