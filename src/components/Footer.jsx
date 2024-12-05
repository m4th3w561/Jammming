// src/components/Footer.js
import React from "react";
import { Button, Paper } from "@mui/material";

const Footer = ({ logData, handleLogout }) => (
    <Paper
        elevation={ 2 }
        sx={ {
            boxShadow: 3,
            display: "flex",
            justifyContent: "center",
            gap: 4,
            position: "fixed",
            bottom: 0,
            width: "100vw",
            padding: 1,
            zIndex: 1000,
        } }
    >
        <Button
            variant="outlined"
            sx={ { fontFamily: "Lexend" } }
            size="large"
            color="primary"
            onClick={ logData }
        >
            Log Data
        </Button>
        <Button
            variant="contained"
            sx={ { fontFamily: "Lexend" } }
            size="large"
            color="primary"
            onClick={ handleLogout }
        >
            Log Out
        </Button>
    </Paper>
);

export default Footer;
