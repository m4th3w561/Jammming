import React, { useState } from "react";
import { Box, Container, Grow, Button, Typography } from '@mui/material';
import OldTrackList from "./OldTrackList";
import OldTrack from "./OldTrack";
import TrackList from "./TrackList";

const OldPlaylist = ({ spotifyPlaylist, deleteTrack, editPlaylistName, editPlaylistDescription, setSpotifyPlaylist, tracks, returnTrack }) => {
    const [currentEditIndex, setCurrentEditIndex] = useState(null);
    const [tracksByPlaylist, setTracksByPlaylist] = useState({});
    const [paginationInfo, setPaginationInfo] = useState({});

    const toggleEdit = async (playlistName, playlistID, index) => {
        const isCurrentlyEditing = currentEditIndex === index;
        setCurrentEditIndex(isCurrentlyEditing ? null : index);

        if (!isCurrentlyEditing && !tracksByPlaylist[playlistID]) {
            const { items, next, previous } = await getPlaylistTracks(playlistID);
            setTracksByPlaylist(prev => ({ ...prev, [playlistID]: items }));
            setPaginationInfo(prev => ({
                ...prev,
                [playlistID]: { next, previous },
            }));
        }
    };

    const getPlaylistTracks = async (playlistID, url = null) => {
        try {
            const apiUrl = url || `https://api.spotify.com/v1/playlists/${playlistID}/tracks?market=US&limit=10`;
            const result = await fetch(apiUrl, {
                method: "GET",
                headers: { Authorization: `Bearer ${localStorage.access_token}` },
            });
            const data = await result.json();
            return { items: data.items || [], next: data.next, previous: data.previous };
        } catch (error) {
            console.error(`Error retrieving tracks for playlist ${playlistID}:`, error);
            return { items: [], next: null, previous: null };
        }
    };

    const fetchMoreTracks = async (playlistID, direction) => {
        const pageUrl = paginationInfo[playlistID]?.[direction];
        if (!pageUrl) return;

        try {
            const { items, next, previous } = await getPlaylistTracks(playlistID, pageUrl);
            setTracksByPlaylist(prev => ({
                ...prev,
                [playlistID]: items,
            }));
            setPaginationInfo(prev => ({
                ...prev,
                [playlistID]: { next, previous },
            }));
        } catch (error) {
            console.error(`Error fetching ${direction} tracks for playlist ${playlistID}:`, error);
        }
    };

    const refreshPlaylistTracks = async (playlistID) => {
        const { items, next, previous } = await getPlaylistTracks(playlistID);
        setTracksByPlaylist(prev => ({ ...prev, [playlistID]: items }));
        setPaginationInfo(prev => ({ ...prev, [playlistID]: { next, previous } }));
    };

    return (
        <Container disableGutters maxWidth="lg" sx={ { display: "flex", flexDirection: "column", alignItems: "start", gap: 4, marginBottom: 10 } }>
            { spotifyPlaylist.map((item, index) => {
                const isEditing = currentEditIndex === index;
                const playlistTracks = tracksByPlaylist[item.id] || [];

                return (
                    <Container maxWidth="lg" key={ item.id }>
                        <Grow
                            in={ true }
                            style={ { transformOrigin: "left" } }
                            timeout={ index * 800 }
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
                                    marginTop: 4,
                                    marginLeft: 6,
                                } }
                            >
                                { tracks.length > 0 ? (
                                    <TrackList
                                        playListName={ item?.name }
                                        playlistID={ item.id }
                                        tracks={ tracks }
                                        deleteTrack={ deleteTrack }
                                        returnTrack={ returnTrack }
                                        context={ "playList" }
                                        button={ "delete" }
                                        refreshPlaylistTracks={ refreshPlaylistTracks }
                                    />
                                ) : (
                                    <Box
                                        sx={ {
                                            display: "flex",
                                            flexWrap: "wrap",
                                            justifyContent: "start",
                                            gap: 2,
                                            width: "100%",
                                        } }>
                                        <Typography component="div" variant="p" noWrap color="#616161">
                                            You can add tracks from the search results
                                        </Typography>
                                        <OldTrackList
                                            tracks={ playlistTracks }
                                            context="oldPlaylist"
                                            playListIndex={ index }
                                            playlistID={ item.id }
                                            playListName={ item?.name }
                                            refreshPlaylistTracks={ refreshPlaylistTracks }
                                        />
                                        { (playlistTracks.length > 9 || paginationInfo[item.id]?.previous) && (
                                            <Box sx={ { display: "flex", gap: 1, marginTop: 2} }>
                                                <Button
                                                    variant="outlined"
                                                    color="primary"
                                                    onClick={ () => fetchMoreTracks(item.id, "previous") }
                                                    disabled={ !paginationInfo[item.id]?.previous }
                                                >
                                                    Back
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    color="primary"
                                                    onClick={ () => fetchMoreTracks(item.id, "next") }
                                                    disabled={ !paginationInfo[item.id]?.next }
                                                >
                                                    Next
                                                </Button>
                                            </Box>
                                        ) }
                                    </Box>
                                )
                                }


                            </Container>
                        ) }
                    </Container>
                );
            }) }
        </Container >
    );
};

export default OldPlaylist;
