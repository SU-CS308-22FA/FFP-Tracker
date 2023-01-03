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


const theme = createTheme();

export default function FileSubmitComponent() {
  const { user } = useContext(UserContext);
  const [e, setE] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [date, setDate] = useState("");
  const [users, setUsers] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [revenues, setRevenues] = useState(null);
  const [expenses, setExpenses] = useState(null);
  const [files, setFiles] = useState(null);
    const [teams, setTeams] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await FFP_API.get(`/users`);
      setUsers(response.data);
    };
    const fetchRevenues = async () => {
      const response = await FFP_API.get(`/revenues`);
      setRevenues(response.data);
    };
    const fetchExpenses = async () => {
      const response = await FFP_API.get(`/expenses`);
      setExpenses(response.data);
    };
    const fetchFiles = async () => {
        const response = await FFP_API.get(`/files`);
        setFiles(response.data);
    };
    const fetchTeams = async () => {
        const response = await FFP_API.get(`/teams`);
        setTeams(response.data);
    };

    fetchExpenses();
    fetchRevenues();
    fetchUsers();
    fetchFiles();
    fetchTeams();
  }, [setUsers, setRevenues, setExpenses, setFiles, setTeams]);


  // find team id by name
    const findTeamId = (teamName) => {
        const team = teams.filter(team => team.name === teamName)[0];
        return team._id;
    }

    const notSubmittedMonths = [];
  // find all the teams that did not submit their files last month
    const findNotSubmittedTeams = () => {
        const notSubmittedTeams = [];
        
        teams.forEach(team => {
            const lastFile = files.filter(file => findTeamId(file.teamName) === team._id).sort((a, b) => new Date(b.date) - new Date(a.date))[0];
            if (lastFile) {
                const lastFileDate = new Date(lastFile.date);
                const currentMonth = new Date().getMonth();
                const lastFileMonth = lastFileDate.getMonth();
                if ((currentMonth - lastFileMonth) > 1) {
                    notSubmittedTeams.push(team);
                    notSubmittedMonths.push(lastFileMonth);
                }
            } else {
                notSubmittedTeams.push(team);
                notSubmittedMonths.push(-1);
            }
        });
        return notSubmittedTeams;
    }

    // display the list of teams that did not submit their files last month
    const displayNotSubmittedTeams = () => {
        const notSubmittedTeams = findNotSubmittedTeams();
        
    }


    return !files ? (
        <CircularProgressComponent />
      ) : ( 
        <Fragment> 
            <Typography variant="h4" component="h1" gutterBottom>
                Teams that did not submit their files last month
            </Typography>
            <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
            {displayNotSubmittedTeams()}
            </List>
        </Fragment>
    );






  




}