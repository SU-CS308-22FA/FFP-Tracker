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
    ListItemSecondaryAction,
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
import Select from "@mui/material/Select";
// import form control and input label
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";

import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";



  export default function PlayersComponent() {
    const { user } = useContext(UserContext);
    const theme = createTheme();
    const [e, setE] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [team, setTeam] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);
    

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

    const getTeamsPlayers = () => {
        return players.filter((player) => player.team === user.team);
    };

    const getTotalWageOfTeam = () => {
        let totalWage = 0;
        getTeamsPlayers().forEach((player) => {
            totalWage += Number(player.wage);
        });
        return totalWage;
    };

    // check if the number is already taken by another player
    const isNumberTaken = (number) => {
        let isTaken = false;
        getTeamsPlayers().forEach((player) => {
            if (player.number === Number(number)) {
                isTaken = true;
                return isTaken;
            }
        });
        return isTaken;
    };

    // check if date is in the past
    const isDateInTheFuture = (date) => {
        if (date > new Date().toISOString().substring(0, 10)) {
            return true;
        }
        return false;
    };



    const handleEditClick = (player) => {
        if(!editMode)
            setEditMode(true);
        else
            setEditMode(false);
    };

    const handleCancelClick = () => {
        setEditMode(false);
    };


    function EditPlayerForm(props){
        const [name, setName] = useState(props.player.name);
        const [number, setNumber] = useState(props.player.number);
        const [position, setPosition] = useState(props.player.position);
        const [nationality, setNationality] = useState(props.player.nationality);
        const [wage, setWage] = useState(props.player.wage);
        const [birthDate, setBirthDate] = useState(props.player.birthDate);
        const { user } = useContext(UserContext);
        const team = user.team;

        const numbers = Array.from(Array(100).keys()).map((n) => n + 1); // create an array of numbers from 1 to 99
        const positions = ["GK", "DEF", "MF", "FW"]; // array of possible positions
        const countries = ["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua &amp; Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia &amp; Herzegovina","Botswana","Brazil","British Virgin Islands","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Cape Verde","Cayman Islands","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica","Cote D Ivoire","Croatia","Cruise Ship","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","French West Indies","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kuwait","Kyrgyz Republic","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Mauritania","Mauritius","Mexico","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Namibia","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","Norway","Oman","Pakistan","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre &amp; Miquelon","Samoa","San Marino","Satellite","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","South Africa","South Korea","Spain","Sri Lanka","St Kitts &amp; Nevis","St Lucia","St Vincent","St. Lucia","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor L'Este","Togo","Tonga","Trinidad &amp; Tobago","Tunisia","Turkiye","Turkmenistan","Turks &amp; Caicos","Uganda","Ukraine","United Arab Emirates","United Kingdom","Uruguay","Uzbekistan","Venezuela","Vietnam","Virgin Islands (US)","Yemen","Zambia","Zimbabwe"]; // array of possible countries


        const handleSubmit = (event) => {
            event.preventDefault();


            const updatedPlayer = { name, team, number, position, nationality, wage, birthDate };
            console.log(updatedPlayer);
            console.log("Player ID:",props.player._id);
            // buraya bi bak
            //FFP_API.put(`/players/${props.player._id}`, updatedPlayer)
            FFP_API.patch(`/players/${props.player._id}`, {
                name: name,
                team: user.team,
                number: number,
                position: position,
                nationality: nationality,
                wage: wage,
                birthDate: birthDate,
            })
            .then((response) => {
                console.log(response);
                setEditMode(false);
                // reload the page
                window.location.reload();
            })
            .catch((error) => {
                console.log(error);
            }
            );
        };

        return (
            <form onSubmit={handleSubmit}>
                <TextField label="Name" value={name} onChange={(event) => setName(event.target.value)} />
                <TextField label="Number" value={number} onChange={(event) => setNumber(event.target.value)} />
                <TextField label="Position" value={position} onChange={(event) => setPosition(event.target.value)} />
                <TextField label="Nationality" value={nationality} onChange={(event) => setNationality(event.target.value)} />
                <TextField label="Wage" value={wage} onChange={(event) => setWage(event.target.value)} />
                <TextField label="Birth Date" value={birthDate} onChange={(event) => setBirthDate(event.target.value)} />
                <Button type="submit">Save Changes</Button>
            </form>
        );
    }



    // create a template for displaying a player, including name, number, position, nationality, wage and birthdate
    const displayPlayer = (player) => {
        
        return (
            <Fragment>
            <ListItem
                key={player._id}
                
            >   
                <ListItemSecondaryAction >
                <IconButton
                    edge="end"
                    aria-label="edit"
                    onClick={() => handleEditClick(player)}
                    style={{ marginLeft: "-35px" }}
                >
                    <EditIcon/>
                </IconButton>
                
                <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => deletePlayer(player._id)}
                    style={{ marginRight: "-45px" }}
                >
                    <DeleteIcon />
                </IconButton>
                

            </ListItemSecondaryAction>
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
                                {player.number} - {player.position} - { player.nationality} - {player.wage} TL/yr - {player.birthDate}
                            </Typography>
                            <br />
                            <Typography variant="body2" color="text.secondary">
                                {((player.wage/ getTotalWageOfTeam())*100).toFixed(2)}% of total wage
                            </Typography>
                        </React.Fragment>
                    }
                    
            />
            

            </ListItem>
            {editMode && <EditPlayerForm player={player}  />}
            </Fragment>
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
            <Paper style={{ maxHeight: 680, overflowY: "scroll" }}>
                <List sx={{ width: "100%", maxWidth: 400, bgcolor: "background.paper" }}>
                    {players
                        .filter((player) => player.team === user.team)
                        .map((player) => displayPlayer(player))}
                </List>
            </Paper>
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
        setE(false);
        setErrorMessage("");
        const data = new FormData(e.currentTarget);
        const name = data.get("name");
        const team = user.team;
        const number = data.get("number");
        const position = data.get("position");
        const wage = data.get("wage");
        const nationality = data.get("nationality");
        const birthDate = data.get("birthDate");

        if(isNumberTaken(number)) {
            setE(true);
            setErrorMessage("Number is already taken");
            alert("Number is already taken");
        } else if (isDateInTheFuture(birthDate)) {
            setE(true);
            setErrorMessage("Birth date cannot be in the future");
            alert("Birth date cannot be in the future");
        } else if (wage < 0) {
            setE(true);
            setErrorMessage("Wage cannot be negative");
            alert("Wage cannot be negative");
        } else if (getTeamsPlayers().length > 34) {
            setE(true);
            setErrorMessage("You cannot have more than 35 players");
            alert("You cannot have more than 35 players");
        } else if (getNumberOfGoalkeepers() > 2 && position === "GK") {
            setE(true);
            setErrorMessage("You cannot have more than 3 goalkeepers");
            alert("You cannot have more than 3 goalkeepers");
        } else if (getNumberOfForeignPlayers() > 13 && nationality !== "Turkiye") {
            setE(true);
            setErrorMessage("You cannot have more than 14 foreign players");
            alert("You cannot have more than 14 foreign players");
        } else {
            try{
            
                await createPlayer(name, team, number, position, wage, nationality, birthDate);
                if(!e) alert ("Player created successfully");
            } catch (error) {
                setE(true);
                setErrorMessage(error.response.data.message); 
            }
        }

    };

    // form for creating a player
    const createPlayerForm = () => {
        const numbers = Array.from(Array(100).keys()).map((n) => n + 1); // create an array of numbers from 1 to 99
        const positions = ["GK", "DEF", "MF", "FW"]; // array of possible positions
        const countries = ["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua &amp; Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia &amp; Herzegovina","Botswana","Brazil","British Virgin Islands","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Cape Verde","Cayman Islands","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica","Cote D Ivoire","Croatia","Cruise Ship","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","French West Indies","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kuwait","Kyrgyz Republic","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Mauritania","Mauritius","Mexico","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Namibia","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","Norway","Oman","Pakistan","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre &amp; Miquelon","Samoa","San Marino","Satellite","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","South Africa","South Korea","Spain","Sri Lanka","St Kitts &amp; Nevis","St Lucia","St Vincent","St. Lucia","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor L'Este","Togo","Tonga","Trinidad &amp; Tobago","Tunisia","Turkiye","Turkmenistan","Turks &amp; Caicos","Uganda","Ukraine","United Arab Emirates","United Kingdom","Uruguay","Uzbekistan","Venezuela","Vietnam","Virgin Islands (US)","Yemen","Zambia","Zimbabwe"]; // array of possible countries

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
                    <FormControl fullWidth required sx={{ mt: 2 }}>
                        <InputLabel id="number-label">Shirt Number</InputLabel>
                        <Select native labelId="number-label" id="number" name="number">
                            {numbers.map((number) => (
                                <option key={number} value={number}>
                                    {number}
                                </option>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth required sx={{ mt: 2 }}>
                        <InputLabel id="position-label">Position</InputLabel>
                        <Select native labelId="position-label" id="position" name="position">
                            {positions.map((position) => (
                                <option key={position} value={position}>
                                    {position}
                                </option>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField margin="normal" required fullWidth id="wage" label="Wage" name="wage" />
                    <FormControl fullWidth required sx={{ mt: 2 }}>
                        <InputLabel id="nationality-label">Nationality</InputLabel>
                        <Select native labelId="nationality-label" id="nationality" name="nationality">
                            {countries.map((nationality) => (
                                <option key={nationality} value={nationality}>
                                    {nationality}
                                </option>
                            ))}
                        </Select>
                    </FormControl>
                    <Box sx={{ mt: 2 }}>
                        <TextField
                            type="date"
                            id="birthDate"
                            name="birthDate"
                            label="Birth Date"
                            required
                            fullWidth
                        />
                    </Box>

                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                        Add Player
                    </Button>
                </Box>
            </Box>
        );
    };

    

    // get number of turkish players in the team using getTeamsPlayers
    const getNumberOfTurkishPlayers = () => {
        let count = 0;
        getTeamsPlayers().forEach((player) => {
            if (player.nationality === "Turkiye") {
                count += 1;
            }
        });
        return count;
    };

    // get number of young turkish players in the team using getTeamsPlayers
    const getNumberOfYoungTurkishPlayers = () => {
        return getTeamsPlayers().filter(
            (player) => player.nationality === "Turkiye" && player.birthDate > "1997-01-01").length;
    };

    // get number of goalkeepers in the team using getTeamsPlayers
    const getNumberOfGoalkeepers = () => {
        return getTeamsPlayers().filter((player) => player.position === "GK").length;
    };

    // get number of foreign players in the team using getTeamsPlayers
    const getNumberOfForeignPlayers = () => {
        return getTeamsPlayers().filter((player) => player.nationality !== "Turkiye").length;
    };

// display rules for the players page
const displayRules = () => {
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
                Rules
            </Typography>
            <Box sx={{ mt: 1 }}>
                <Box sx={{ mb: 1, display: "flex", alignItems: "center" }}>
                    <Typography component="h1" variant="h6" style={{ fontWeight: "bold" }}>
                        1.
                    </Typography>
                    <Typography component="h1" variant="h6">
                        You can add maxiumum of 35 players to your team.
                    </Typography>
                    {getNumberOfPlayers() <= 35 && <CheckIcon style={{ color: "green" }} />}
                    {getNumberOfPlayers() > 35 && <CloseIcon style={{ color: "red" }} />}
                    <Typography component="h1" variant="h6">
                        ({getNumberOfPlayers()}/35)
                    </Typography>
                </Box>
                <Box sx={{ mb: 1, display: "flex", alignItems: "center" }}>
                    <Typography component="h1" variant="h6" style={{ fontWeight: "bold" }}>
                        2. 
                    </Typography>
                    <Typography component="h1" variant="h6">
                        You must have at least 14 Turkish players in your team.
                    </Typography>
                    {getNumberOfTurkishPlayers() >= 14 && <CheckIcon style={{ color: "green" }} />}
                    {getNumberOfTurkishPlayers() < 14 && <CloseIcon style={{ color: "red" }} />}
                    <Typography component="h1" variant="h6">
                        ({getNumberOfTurkishPlayers()}/14)
                    </Typography>
                </Box>
                <Box sx={{ mb: 1, display: "flex", alignItems: "center" }}>
                    <Typography component="h1" variant="h6" style={{ fontWeight: "bold" }}>
                        3. 
                    </Typography>
                    <Typography component="h1" variant="h6">
                        You must have at least 6 Turkish players who are born after 01/01/1997 in your team.
                    </Typography>
                    {getNumberOfYoungTurkishPlayers() >= 6 && <CheckIcon style={{ color: "green" }} />}
                    {getNumberOfYoungTurkishPlayers() < 6 && <CloseIcon style={{ color: "red" }} />}
                    <Typography component="h1" variant="h6">
                        ({getNumberOfYoungTurkishPlayers()}/6)
                    </Typography>
                </Box>
                <Box sx={{ mb: 1, display: "flex", alignItems: "center" }}>
                    <Typography component="h1" variant="h6" style={{ fontWeight: "bold" }}>
                        4. 
                    </Typography>
                    <Typography component="h1" variant="h6">
                        You must have 3 or less goalkeepers in your team.
                    </Typography>
                    {getNumberOfGoalkeepers() <= 3 && <CheckIcon style={{ color: "green" }} />}
                    {getNumberOfGoalkeepers() > 3 && <CloseIcon style={{ color: "red" }} />}
                    <Typography component="h1" variant="h6">
                        ({getNumberOfGoalkeepers()}/3)
                    </Typography>
                </Box>
                <Box sx={{ mb: 1, display: "flex", alignItems: "center" }}>
                    <Typography component="h1" variant="h6" style={{ fontWeight: "bold" }}>
                        5. 
                    </Typography>
                    <Typography component="h1" variant="h6">
                        You must have 14 or less foreigner players in your team.
                    </Typography>
                    {getNumberOfForeignPlayers() <= 14 && <CheckIcon style={{ color: "green" }} />}
                    {getNumberOfForeignPlayers() > 14 && <CloseIcon style={{ color: "red" }} />}
                    <Typography component="h1" variant="h6">
                        ({getNumberOfForeignPlayers()}/14)
                    </Typography>
                </Box>
                <Box sx={{ mb: 1, display: "flex", alignItems: "center" }}>
                    <Typography component="h1" variant="h6" style={{ fontWeight: "bold" }}>
                        6. 
                    </Typography>
                    <Typography component="h1" variant="h6">
                        You must have at least 18 players in your team.
                    </Typography>
                    {getNumberOfPlayers() > 17 && <CheckIcon style={{ color: "green" }} />}
                    {getNumberOfPlayers() < 18 && <CloseIcon style={{ color: "red" }} />}
                    <Typography component="h1" variant="h6">
                        ({getNumberOfPlayers()}/18)
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

    // check rules
    const checkRules = () => {
        if (getNumberOfPlayers() > 35) {
            return false;
        }
        if (getNumberOfTurkishPlayers() < 14) {
            return false;
        }
        if (getNumberOfYoungTurkishPlayers() < 6) {
            return false;
        }
        if (getNumberOfGoalkeepers() > 3) {
            return false;
        }
        if (getNumberOfForeignPlayers() > 14) {
            return false;
        }
        if (getNumberOfPlayers() < 18) {
            return false;
        }
        return true;
    };


    

    return !team ? (
        <CircularProgressComponent />
      ) : (
        <Fragment>
            <Grid container spacing={2}>
                <Grid item xs={4}>
                    <Paper sx={{ p: 2, display: "flex", flexDirection: "column", height: (60 + getNumberOfPlayers) }}>
                        <Typography variant="h6" gutterBottom component="div">
                            <SportsSoccerIcon /> Players
                        </Typography>
                        {displayPlayers()}
                    </Paper>
                </Grid>
                <Grid item xs={4}>
                    <Paper sx={{ p: 2, display: "flex", flexDirection: "column", height: 750 }}>
                        <Typography variant="h6" gutterBottom component="div">
                            <SportsSoccerIcon /> Add Player
                        </Typography>
                        {createPlayerForm()}
                    </Paper>
                </Grid>
                <Grid item xs={4}>
                    <Paper sx={{ p: 2, display: "flex", flexDirection: "column", height: 750 }}>
                        <Typography variant="h6" gutterBottom component="div">
                            <SportsSoccerIcon /> Rules
                        </Typography>
                        {displayRules()}
                    </Paper>
                </Grid>
            </Grid>

        </Fragment>

    );


  }