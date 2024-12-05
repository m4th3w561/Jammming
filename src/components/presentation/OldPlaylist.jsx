import React, { useState } from "react";
import { Box, Container, Grow } from '@mui/material';
import OldTrackList from "./OldTrackList";
import OldTrack from "./OldTrack";

const OldPlaylist = ({ spotifyPlaylist, deleteTrack, editPlaylistName, editPlaylistDescription, deletePlaylist, setSpotifyPlaylist }) => {
    const [currentEditIndex, setCurrentEditIndex] = useState(null);
    const [tracksByPlaylist, setTracksByPlaylist] = useState({}); // Stores tracks per playlist, allowing efficient lookups and updates without re-fetching unnecessarily

    const toggleEdit = async (playlistName, playlistID, index) => {
        const isCurrentlyEditing = currentEditIndex === index;
        setCurrentEditIndex(isCurrentlyEditing ? null : index);

        if (!isCurrentlyEditing && !tracksByPlaylist[playlistID]) {
            const tracks = await getPlaylistTracks(playlistID, playlistName);
            setTracksByPlaylist(prev => ({ ...prev, [playlistID]: tracks }));
        }
    };

    const getPlaylistTracks = async (playlistID, playlistName) => {
        try {
            const result = await fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`, {
                method: "GET",
                headers: { Authorization: `Bearer ${localStorage.access_token}` },
            });
            const data = await result.json();
            return data.items || [];

        } catch (error) {
            console.error(`Error retrieving tracks for playlist ${playlistName}:`, error);
            return [];
        }
    };

    return (
        <Container disableGutters maxWidth="lg" sx={ { display: "flex", flexDirection: "column", alignItems: "start", gap: 4 } }>
            { spotifyPlaylist.map((item, index) => {
                const isEditing = currentEditIndex === index;
                const handleDeletePlaylist = () => deletePlaylist(item);
                const playlistTracks = tracksByPlaylist[item.id] || [];

                return (
                    <React.Fragment key={ item.id }>
                        <Grow
                            in={ true }
                            style={ { transformOrigin: "left" } }
                            timeout={ index * 500 }
                        >
                            <Box
                                sx={ { width: "100%", minWidth: 460, cursor: 'pointer' } }
                                onClick={ () => toggleEdit(item.name, item.id, index) }
                            >
                                <OldTrack
                                    playListName={ item?.name }
                                    artist={ "Playlist" }
                                    media={ item?.images?.[0]?.url || "https://picsum.photos/200" }
                                    album={ item?.description ? item?.description : `A spotify Playlist by ${item?.owner?.display_name}` }
                                    mediaAlt={ item?.name }
                                    button={ "edit" }
                                    context={ "edit" }
                                    editPlaylistName={ editPlaylistName }
                                    editPlaylistDescription={ editPlaylistDescription }
                                    index={ index }
                                    deletePlaylist={ handleDeletePlaylist }
                                    playlistID={ item?.id }
                                    setSpotifyPlaylist={ setSpotifyPlaylist }
                                />
                            </Box>
                        </Grow>
                        { isEditing && (
                            <Container
                                disableGutters
                                sx={ {
                                    display: "flex",
                                    flexWrap: "wrap",
                                    justifyContent: "start",
                                    gap: 4,
                                    width: "100%",
                                    marginTop: 1,
                                    marginLeft: 6
                                } }
                            >
                                <OldTrackList
                                    tracks={ playlistTracks }
                                    deleteTrack={ deleteTrack }
                                    context="oldPlaylist"
                                    playListIndex={ index }
                                />
                            </Container>
                        ) }
                    </React.Fragment>
                );
            }) }
        </Container >
    );
};

export default OldPlaylist;