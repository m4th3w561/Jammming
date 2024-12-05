import React, { useState } from 'react';
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import { Card, IconButton, Paper, TextField, Button } from "@mui/material";

const OldTrack = ({
    playListName,
    name,
    artist,
    media,
    album,
    mediaAlt,
    button,
    context,
    deleteOldTrack,
    deletePlaylist,
    playlistID,
    setSpotifyPlaylist
}) => {
    const [editName, setEditName] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editToggle, setEditToggle] = useState(false);

    const handleChange = (event, item) => {
        event.stopPropagation();
        if (item === "title") {
            setEditName(event.target.value);
        } else if (item === "description") {
            setEditDescription(event.target.value);
        }
    };
    const handleCancel = (event) => {
        event.stopPropagation();
        setEditName("");
        setEditToggle(false);
    };
    const handleEdit = (event) => {
        event.stopPropagation();
        setEditToggle(true);
    };
    const handleSubmit = async (event) => {
        event.stopPropagation();
        event.preventDefault();
        const currentName = editName;
        const currentDescription = editDescription;
        
        try {
            const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistID}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${localStorage.access_token}`,
                    'Content-Type': " application/json"
                },
                body: JSON.stringify({
                    name: currentName,
                    description: currentDescription,
                    public: true,
                    collaborative: false,
                }),
            });
            if (!response.ok) {
                throw new Error(`Failed to update playlist: ${response.status} ${response.statusText}`);
            }

            setEditToggle(false)

            setSpotifyPlaylist((prevPlaylists) =>
                prevPlaylists.map((playlist) =>
                    playlist.id === playlistID
                        ? { ...playlist, name: currentName, description: currentDescription }
                        : playlist
                )
            );

        } catch (error) {
            console.error("Error in updating playlist:", error);
        }
    };


    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            handleSubmit(event);
        }
    };

    return (
        <Paper elevation={ 1 } sx={ { display: 'flex', width: "100%", overflow: "visible", boxShadow: 2, borderRadius: 2 } }>
            <Card sx={ { width: "100%", display: 'flex', justifyContent: "space-between", alignItems: "center", overflow: "visible" } }  >
                <CardMedia
                    component="img"
                    sx={ {
                        width: 100,
                        height: 100,
                        float: "left",
                        position: "relative",
                        ...(!editToggle
                            ? {
                                top: 16,
                                left: 30,
                            }
                            : {
                                left: 30
                            }),
                        zIndex: 10,
                        boxShadow: 4,
                        borderRadius: "8px",
                    } }
                    image={ media }
                    alt={ mediaAlt }
                />
                <Box sx={ { display: 'flex', justifyContent: "space-between", padding: "0 2rem ", width: "100%", } }>
                    <CardContent sx={ { justifyContent: "space-between", textAlign: "left", width: "100%" } }>
                        { context === "edit" ?
                            editToggle ? (
                                <Box sx={ { display: "flex", flexDirection: "column", gap: 1, } }>
                                    <TextField
                                        id="outlined-search"
                                        label={ "Enter New Title" }
                                        value={ editName }
                                        onChange={ event => handleChange(event, "title") }
                                        type="text"
                                        fullWidth
                                        placeholder={ playListName ? playListName : "Edit Playlist" }
                                        onKeyDown={ handleKeyDown }
                                        onClick={ (event) => event.stopPropagation() }
                                    />
                                    <TextField
                                        id="outlined-search"
                                        label={ "Enter New Description" }
                                        value={ editDescription }
                                        onChange={ event => handleChange(event, "description") }
                                        type="text"
                                        fullWidth
                                        placeholder={ album ? album : "Edit Description" }
                                        onKeyDown={ handleKeyDown }
                                        onClick={ (event) => event.stopPropagation() }
                                    />
                                    <Box sx={ { display: "flex", gap: 2 } }>
                                        <Button
                                            variant="contained"
                                            sx={ { fontFamily: "Lexend" } }
                                            onClick={ handleSubmit }
                                            size='large'
                                            color="primary"
                                        >
                                            update
                                        </Button>
                                        <Button
                                            variant="contained"
                                            sx={ { fontFamily: "Lexend" } }
                                            onClick={ deletePlaylist }
                                            size='large'
                                            color="primary"
                                        >
                                            Delete
                                        </Button>
                                    </Box>
                                </Box>) :
                                <>
                                    <Typography component="div" variant="h5" noWrap sx={ { width: "100%", minWidth: "100%", maxWidth: 100, } }>
                                        { playListName }
                                    </Typography>
                                    <Typography
                                        variant="subtitle1"
                                        component="div"
                                        sx={ { color: 'text.secondary' } }
                                    >
                                        { artist }
                                    </Typography>
                                    <Typography component="div" variant="subtitle2" color="grey">
                                        { album }
                                    </Typography>
                                </>
                            :
                            context === "trackName" ?
                                <>
                                    <Typography component="div" variant="h5" noWrap sx={ { width: "100%", minWidth: "100%", maxWidth: 100, } }>
                                        { name }
                                    </Typography>
                                    <Typography
                                        variant="subtitle1"
                                        component="div"
                                        sx={ { color: 'text.secondary' } }
                                    >
                                        { artist }
                                    </Typography>
                                    <Typography component="div" variant="subtitle2" color="grey">
                                        { album }
                                    </Typography>
                                </>
                                : null
                        }
                    </CardContent>
                    <Box sx={ { display: 'flex', alignItems: 'center' } }>
                        <Paper elevation={ 0 } sx={ { width: 72, height: 72, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 50 } }>
                            <Paper elevation={ 3 } sx={ { borderRadius: 50 } }>
                                <Box sx={ {
                                    width: 48,
                                    height: 48,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: '50%',
                                } }> { !editToggle ? (
                                    button === "delete" ? (
                                        <IconButton aria-label="delete" onClick={ deleteOldTrack } >
                                            <DeleteIcon sx={ { height: 30, width: 30 } } />
                                        </IconButton>
                                    ) : button === "edit" ? (
                                        <IconButton aria-label="edit" onClick={ handleEdit }>
                                            <EditIcon sx={ { height: 30, width: 30 } } />
                                        </IconButton>
                                    ) : null
                                ) : (
                                    <IconButton aria-label="submit" onClick={ handleCancel }>
                                        <ClearIcon sx={ { height: 30, width: 30 } } />
                                    </IconButton>)
                                    }
                                </Box>
                            </Paper>
                        </Paper>
                    </Box>
                </Box>
            </Card>
        </Paper>
    );
};

export default OldTrack;
