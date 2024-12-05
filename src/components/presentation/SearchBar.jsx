import React, { useState } from "react";
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { Button, Container } from "@mui/material";


const SearchBar = ({ retrieveResult }) => {
  const [userInput, setUserInput] = useState("");

  const handleChange = (event) => {
    const input = event.target.value;
    setUserInput(input);
  };

  const handleClick = async (event) => {
    try {
      const result = await fetch(`https://api.spotify.com/v1/search?q=${userInput}&type=track&market=US&limit=20`, {
        method: "GET",
        headers: { Authorization: `Bearer ${localStorage.access_token}` }
      });
      if (!result.ok) {
        throw new Error("Failed to fetch search result");
      }
      const data = await result.json();
      retrieveResult(data.tracks.items)
      
    } catch (error) {
      console.error("Error in search fetch:", error);
    }
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent form submission
      handleClick(); // Trigger the search
    }
  };
  const handleClear = () => {
    setUserInput("");
    retrieveResult([]);
  };
  return (
    <Container maxWidth="md" >
      <Box
        component="form"
        sx={ { display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" } }
      >
        <TextField
          id="outlined-search"
          label="Search"
          value={ userInput }
          onChange={ handleChange }
          onKeyDown={ handleKeyDown }
          type="search"
          fullWidth
          placeholder="Search for a song" />
        <Box sx={ { display: "flex", alignItems: "center", gap: "1rem" } }>
          <Button
            variant="contained"
            sx={ { fontFamily: "Lexend" } }
            disabled={ !userInput }
            onClick={ handleClick }
            size='large'
            color="primary"
          >
            Search
          </Button>
          <Button
            variant="contained"
            sx={ { fontFamily: "Lexend" } }
            disabled={ !userInput }
            onClick={ handleClear }
            size='large'
            color="primary"
          >
            Clear
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default SearchBar;
