import { Box, Alert } from "@mui/material";
import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import LinearProgress from "@mui/material/LinearProgress";
import { useTheme } from "@mui/material/styles";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Button, CardActionArea, CardActions } from "@mui/material";
import { useState, useEffect } from "react";
import FFP_API from "../../app/api";
import { UserContext } from "../../contexts/userContext";
import { useContext } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Container } from "@mui/system";
import CircularProgressComponent from "../Public Components/CircularProgressComponent";

export default function MultiActionAreaCard() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const theme = useTheme();
  const [e, setE] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [team, setTeam] = useState(null);
  useEffect(() => {
    const fetchTeamInfo = async () => {
      await FFP_API.get(`/teams/${user.team}`)
        .then((res) => {
          setTeam(res.data);
        })
        .catch((err) => {
          setE(true);
          setErrorMessage(err.message);
        });
    };
    fetchTeamInfo();
  }, [user]);

  const handleUpdateTeam = async () => {
    //e.preventDefault();
    const options = {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    };
    await FFP_API.patch(
      `/teams/${team._id}`,
      {
        sponsorBudget: 0,
      },
      options
    ).catch((err) => {
      setE(true);
      setErrorMessage(err.message);
    });
  };

  const handleCancelRequest = async () => {
    handleUpdateTeam();
    try {
      await FFP_API.patch(
        `/users/${user._id}`,
        {
          team: null,
        }
        // options
      );
      alert(
        "You have successfully cancelled the request! The page will be refreshed."
      );
      window.location.reload();
    } catch (error) {
      setE(true);
      setErrorMessage(error.response.data);
    }
  };

  if (team) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Card sx={{ maxWidth: 345 }}>
          <Box
            sx={{
              width: "100%",
            }}
          >
            <LinearProgress />
          </Box>
          <CardActionArea>
            <CardMedia
              component="img"
              height="140"
              image={team.logoURL}
              alt="green iguana"
              sx={{ ml: 8, maxWidth: 200 }}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {team.teamName}
              </Typography>
              <Typography variant="body2">
                Your request to join our team as a supporter is being reviewed
                by the team admin. Thank you for your interest in supporting our
                cause.
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions>
            <Button
              variant="outlined"
              size="small"
              color="primary"
              onClick={() => navigate(`/teams/${team._id}`)}
            >
              Team Page
            </Button>
            <Button
              onClick={handleCancelRequest}
              size="small"
              color="error"
              variant="outlined"
            >
              Cancel request
            </Button>
            {e && (
              <Alert variant="outlined" severity="error">
                {errorMessage}
              </Alert>
            )}
          </CardActions>
        </Card>
      </Box>
    );
  } else {
    <Container sx={{ ml: 10 }}>
      <CircularProgressComponent></CircularProgressComponent>
    </Container>;
  }
}
