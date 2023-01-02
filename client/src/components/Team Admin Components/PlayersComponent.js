import {
    Alert,
    Avatar,
    Button,
    CssBaseline,
    TextField,
    Box,
    Container,
    Typography,
    Grid,
    Paper,
  } from "@mui/material";
  import { createTheme, ThemeProvider } from "@mui/material/styles";
  import { useEffect, useState, useContext } from "react";
  import FFP_API from "../../app/api";
  import { UserContext } from "../../contexts/userContext";
  import CircularProgressComponent from "../Public Components/CircularProgressComponent";
  import { client } from "filestack-react";
  import {Snackbar} from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import SendIcon from "@mui/icons-material/Send";
import { Fragment } from "react";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import React from "react";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";


  
  export default function PlayersComponent() {
    const { user } = useContext(UserContext);
    const theme = createTheme();
    const [e, setE] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [team, setTeam] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
     
        const fetchTeam = async () => {
            const response = await FFP_API.get(`/teams/${user.team}`);
            setTeam(response.data);
            };
          const fetchPlayers = async () => {
            const response = await FFP_API.get(`/players`);
            setPlayers(response.data);
          };
            fetchTeam();
            fetchPlayers();
    }, [setTeam, setPlayers]);

    // get the number of players in the team
    const getNumberOfPlayers = () => {
        return players.filter((player) => player.team === user.team).length;
    };




    // create a template for displaying a player, including name, number, position, nationality, wage and birthdate
    const displayPlayer = (player) => {
        return (
            <ListItem
                key={player._id}
                secondaryAction={
                    <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => deletePlayer(player._id)}
                    >
                        <DeleteIcon />
                    </IconButton>
                }
            >
                <ListItemText
                    primary={player.name}
                    secondary={
                        <React.Fragment>
                            <Typography
                                sx={{ display: "inline" }}
                                component="span"
                                variant="body2"
                                color="text.primary"
                            >
                                {player.number} - {player.position} - { player.nationality} - {player.wage} - {player.birthDate}
                            </Typography>
                        </React.Fragment>
                    }
                />
            </ListItem>
        );
    };

    // delete a player by id
    const deletePlayer = async (id) => {
        try {
            await FFP_API.delete(`/players/${id}`);
            setPlayers(players.filter((player) => player._id !== id));
        } catch (error) {
            console.log(error);
        }
    };

    // display all players withe the same team id as the user
    const displayPlayers = () => {
        return (
            <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
                {players
                    .filter((player) => player.team === user.team)
                    .map((player) => displayPlayer(player))}
            </List>
        );
    };

    // create player function
    async function createPlayer(name, team, number, position, wage, nationality, birthDate) {
        try {
            const response = await FFP_API.post("/players", {
                name,
                team,
                number,
                position,
                wage,
                nationality,
                birthDate,
            });
            setPlayers([...players, response.data]);
        } catch (error) {
            console.log(error);
        }
    }

    // handle create player function
    const handleCreatePlayer = async (e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        try{
            const name = data.get("name");
            const team = user.team;
            const number = data.get("number");
            const position = data.get("position");
            const wage = data.get("wage");
            const nationality = data.get("nationality");
            const birthDate = data.get("birthDate");
            await createPlayer(name, team, number, position, wage, nationality, birthDate);
            if(!e) alert ("Player created successfully");
        } catch (error) {
            setE(true);
            setErrorMessage(error.response.data.message); 
        }
    };

    // form for creating a player
    const createPlayerForm = () => {
        return (
            <Box
                sx={{
                    marginTop: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Typography component="h1" variant="h5">
                    Add Player
                </Typography>
                <Box component="form" onSubmit={handleCreatePlayer} noValidate sx={{ mt: 1 }}>
                    <TextField margin="normal" required fullWidth id="name" label="Name" name="name" autoFocus />
                    <TextField margin="normal" required fullWidth id="number" label="Number" name="number" />
                    <TextField margin="normal" required fullWidth id="position" label="Position" name="position" />
                    <TextField margin="normal" required fullWidth id="wage" label="Wage" name="wage" />
                    <TextField margin="normal" required fullWidth id="nationality" label="Nationality" name="nationality" />
                    <TextField margin="normal" required fullWidth id="birthDate" label="Birth Date" name="birthDate" />
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                        Add Player
                    </Button>
                </Box>
            </Box>
        );
    };

                    
    

    

    return !team ? (
        <CircularProgressComponent />
      ) : (
        <Fragment>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2, display: "flex", flexDirection: "column", height: (60 + getNumberOfPlayers) }}>
                        <Typography variant="h6" gutterBottom component="div">
                            <SportsSoccerIcon /> Players
                        </Typography>
                        {displayPlayers()}
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2, display: "flex", flexDirection: "column", height: 750 }}>
                        <Typography variant="h6" gutterBottom component="div">
                            <SportsSoccerIcon /> Add Player
                        </Typography>
                        {createPlayerForm()}
                    </Paper>
                </Grid>
            </Grid>
        </Fragment>

    );

  }