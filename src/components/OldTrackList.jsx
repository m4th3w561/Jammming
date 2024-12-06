import React from "react";
import { Box, Container, Grow } from "@mui/material";
import OldTrack from "./OldTrack";

const OldTrackList = ({ refreshPlaylistTracks, tracks, playListName, playlistID, context }) => {

    return (
        <Container disableGutters maxWidth="lg">
            <Box sx={ { display: "flex", flexWrap: "wrap", justifyContent: "start", gap: 4 } }>
                <Container disableGutters sx={ { display: "flex", flexDirection: "column", gap: 4 } }>
                    { tracks.map((item, index) => {
                        const deleteOldTrack = async () => {
                            try {
                                const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`, {
                                    method: "DELETE",
                                    headers: {
                                        Authorization: `Bearer ${localStorage.access_token}`,
                                        'Content-Type': " application/json"
                                    },
                                    body: JSON.stringify({
                                        "tracks": [
                                            {
                                                "uri": item.track.uri
                                            }
                                        ]
                                    }),
                                });
                                if (!response.ok) {
                                    throw new Error(`Failed to delete track ${item.track?.name}: ${response.status} ${response.statusText}`);
                                }
                                if (refreshPlaylistTracks) {
                                    await refreshPlaylistTracks(playlistID);
                                }
                            } catch (error) {
                                console.error(`Error deleting track ${item.track?.name} from ${playListName}:`, error);
                            }
                        };
                        return (
                            <Grow
                                key={ item.id || item.name || `playlist-${index}` }
                                in={ true }
                                style={ { transformOrigin: "left" } }
                                timeout={ index * 800 }
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
