import { Container } from "@mui/material";
import React from "react";
import TrackList from "./TrackList";


const SearchResults = ({ resultList, selectTracks, deleteTrack }) => {

  return (
    <Container maxWidth="lg" sx={ { display: "flex", flexDirection: "column", alignItems: "start", gap: 1 } }>
      <h4>Search Result</h4>
      <TrackList resultList={ resultList } selectTracks={ selectTracks } deleteTrack={ deleteTrack } context={ "search" } />
    </Container >

  );
};

export default SearchResults;
