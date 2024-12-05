import React from "react";
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { CardActionArea, Paper } from "@mui/material";

const Track = ({ name, artist, media, album, mediaAlt, button }) => {

  return (
    <Paper elevation={ 1 } sx={ { display: 'flex', width: "100%", minWidth: 200, overflow: "visible", boxShadow: 2, borderRadius: 2 } }>
      <CardActionArea sx={ { display: 'flex', justifyContent: "space-between" } } >
        <CardMedia
          component="img"
          sx={ {
            width: 100,
            height: 100,
            float: "left",
            position: "relative",
            top: 16,
            left: 30,
            zIndex: 10,
            boxShadow: 4,
            borderRadius: "8px",
          } }
          image={ media }
          alt={ mediaAlt }
        />
        <Box sx={ { display: 'flex', justifyContent: "space-between", padding: "0 2rem ", width: "100%", minWidth: 200 } }>
          <CardContent sx={ { justifyContent: "space-between", textAlign: "left", width: "100%" } }>
            <Typography component="div" variant="h5" noWrap sx={ { width: "100%", minWidth: "100%", maxWidth: 100 } }>
              { name }
            </Typography>
            <Typography
              variant="subtitle1"
              component="div"
              noWrap
              sx={ { color: 'text.secondary', width: "100%", minWidth: "100%", maxWidth: 100 } }
            >
              { artist }
            </Typography>
            <Typography component="div" variant="subtitle2" color="grey" noWrap sx={ { minWidth: "100%", maxWidth: 100 } }>
              { album }
            </Typography>
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
                } }>
                  { button === "add" ? (
                    <AddIcon sx={ { height: 30, width: 30 } } />
                  ) : button === "delete" ? (
                    <DeleteIcon sx={ { height: 30, width: 30 } } />
                  ) : button === "edit" ? (
                    <EditIcon sx={ { height: 30, width: 30 } } />
                  ) : (
                    <></>
                  )
                  }
                </Box>
              </Paper>
            </Paper>
          </Box>
        </Box>
      </CardActionArea>
    </Paper>
  );
};

export default Track;
