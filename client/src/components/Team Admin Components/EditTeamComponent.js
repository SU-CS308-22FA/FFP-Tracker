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
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import FFP_API from "../../app/api";
import { useContext } from "react";
import { UserContext } from "../../contexts/userContext";
import CircularProgressComponent from "../Public Components/CircularProgressComponent";
import { client } from "filestack-react";

export default function EditTeamComponent() {
  const { user } = useContext(UserContext);
  const theme = createTheme();
  const [e, setE] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [team, setTeam] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [wikiLink, setWikiLink] = useState("");
  const [manager, setManager] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (
      team.wikiLink !== wikiLink ||
      team.manager !== manager ||
      selectedFile
    ) {
      await FFP_API.patch(`/teams/${team._id}`, {
        wikiLink: data.get("wikiLink"),
        manager: data.get("manager"),
        logoURL: selectedFile ? selectedFile : team.logoURL,
      }).then((res) => {
        alert("Team updated successfully!");
        navigate("/my/profile");
      });
    }
  };

  const handleFilePicker = () => {
    const filestackApikey = "AJ72c4DJLSPqnTctAvQ0wz"; //insert here with your own api key
    const filestack = client.init(filestackApikey);
    const options = {
      accept: ["image/*"],
      onFileUploadFinished(file) {
        setSelectedFile(file.url);
      },
    };
    const picker = filestack.picker(options);
    picker.open();
  };

  useEffect(() => {
    const fetchTeamInfo = async () => {
      await FFP_API.get(`/teams/${user.team}`)
        .then((res) => {
          setTeam(res.data);
          setWikiLink(res.data.wikiLink);
          setManager(res.data.manager);
        })
        .catch((err) => {
          setE(true);
          setErrorMessage(err.message);
        });
    };
    fetchTeamInfo();
  }, [user]);

  return !team ? (
    <CircularProgressComponent />
  ) : (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container maxWidth="md">
          <Box
            sx={{
              m: 6,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography component="h1" variant="h4" sx={{ mb: 4 }}>
              Update Your Team's Information
            </Typography>
            <Typography variant="h6">Your Team is {team.teamName} </Typography>
            <Avatar src={team.logoURL} sx={{ mt: 2, width: 56, height: 56 }} />
            {selectedFile && (
              <>
                <Box
                  sx={{
                    mt: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h7" sx={{}}>
                    This will be your new team logo:
                  </Typography>
                  <Avatar src={selectedFile} sx={{ width: 56, height: 56 }} />
                </Box>
              </>
            )}
            <Box
              component="form"
              onSubmit={handleSubmit}
              alignItems="center"
              sx={{ mt: 4 }}
            >
              <Button
                onClick={handleFilePicker}
                fullWidth
                variant="contained"
                sx={{ mt: -2, mb: 4 }}
              >
                Pick an Image to Upload
              </Button>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    autoFocus
                    fullWidth
                    value={wikiLink}
                    onChange={(e) => setWikiLink(e.target.value)}
                    id="wikiLink"
                    label="Wikipedia Link"
                    name="wikiLink"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    value={manager}
                    onChange={(e) => setManager(e.target.value)}
                    id="manager"
                    label="Manager Name"
                    name="manager"
                  />
                </Grid>
              </Grid>
              <Box sx={{ mt: 2 }} />
              {e && (
                <Alert variant="outlined" severity="error">
                  {errorMessage}
                </Alert>
              )}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 2,
                  mb: 4,
                  bgcolor: "#51087E",
                  "&:hover": {
                    backgroundColor: "#51087E",
                  },
                }}
              >
                Update Team
              </Button>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </>
  );
}
