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

export default function EditTeamComponent() {
  const { user } = useContext(UserContext);
  const theme = createTheme();
  const [e, setE] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [team, setTeam] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [wikiLink, setWikiLink] = useState("");
  const [manager, setManager] = useState("");
  const [lawyers, setLawyers] = useState([]);
  const [boardMembers, setBoardMembers] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (
      team.wikiLink !== wikiLink ||
      team.manager !== manager ||
      selectedFile ||
      lawyers !== team.lawyers ||
      boardMembers !== team.boardMembers
    ) {
      const options = {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      };
      await FFP_API.patch(
        `/teams/${team._id}`,
        {
          wikiLink: data.get("wikiLink") ?? "",
          manager: data.get("manager") ?? "",
          logoURL: selectedFile ? selectedFile : team.logoURL,
          lawyers: lawyers,
          boardMembers: boardMembers,
        },
        options
      )
        .then((res) => {
          alert("Team updated successfully!");
          window.location.reload();
        })
        .catch((err) => {
          setE(true);
          setErrorMessage(err.message);
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


  


  const handleAddLawyer = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setLawyers([...lawyers, data.get("lname")]);
  };

  const handleAddBoardMember = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setBoardMembers([...boardMembers, data.get("bname")]);
  };

  useEffect(() => {
    const fetchTeamInfo = async () => {
      await FFP_API.get(`/teams/${user.team}`)
        .then((res) => {
          setTeam(res.data);
          setWikiLink(res.data.wikiLink);
          setManager(res.data.manager);
          setLawyers(res.data.lawyers);
          setBoardMembers(res.data.boardMembers);
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
        <Typography
          component="h1"
          variant="h3"
          align="center"
          sx={{ mt: 4, mb: 4 }}
        >
          Update Your Team's Information
        </Typography>
        <Grid container>
          <Grid item xs={7}>
            <Container maxWidth="sm">
              <Box
                sx={{
                  mt: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6">
                  Your Team is {team.teamName}{" "}
                </Typography>
                <Avatar
                  src={team.logoURL}
                  sx={{ mt: 2, mb: 2, width: "auto" }}
                />
                {selectedFile ? (
                  <>
                    <Box
                      sx={{
                        mt: 2,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="h7" sx={{ mb: 1 }}>
                        This will be your new team logo:
                      </Typography>
                      <Avatar
                        variant="square"
                        src={selectedFile}
                        sx={{ width: "15%", height: "15%" }}
                      />
                    </Box>
                  </>
                ) : (
                  <Button
                    onClick={handleFilePicker}
                    variant="contained"
                    sx={{
                      bgcolor: "#51087E",
                      "&:hover": {
                        backgroundColor: "#51087E",
                      },
                    }}
                  >
                    Change Team Logo
                  </Button>
                )}
                <Box
                  component="form"
                  onSubmit={handleSubmit}
                  sx={{
                    mt: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
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
                        fullWidth
                        value={manager}
                        onChange={(e) => setManager(e.target.value)}
                        id="manager"
                        label="Manager Name"
                        name="manager"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="h5" align="center" sx={{ mb: 2 }}>
                        Your Lawyers:
                      </Typography>
                      {lawyers.length !== 0 ? (
                        lawyers.map((lawyer) => {
                          return (
                            <>
                              <Typography
                                key={lawyer}
                                variant="h6"
                                sx={{ mb: 1 }}
                              >
                                {lawyer}
                                <Button
                                  key={lawyer}
                                  variant="contained"
                                  sx={{ ml: 2, bgcolor: "#51087E" }}
                                  onClick={() => {
                                    const newLawyers = lawyers.filter(
                                      (l) => l !== lawyer
                                    );
                                    setLawyers(newLawyers);
                                  }}
                                >
                                  Remove Lawyer
                                </Button>
                              </Typography>
                            </>
                          );
                        })
                      ) : (
                        <Typography variant="h7" sx={{ mb: 1 }}>
                          You have no lawyers!
                        </Typography>
                      )}
                    </Grid>

                    <Grid item xs={12}>
                      <Typography variant="h5" align="center" sx={{ mb: 2 }}>
                        Your Board:
                      </Typography>
                      {boardMembers.length !== 0 ? (
                        boardMembers.map((boardMember) => {
                          return (
                            <>
                              <Typography
                                key={boardMember}
                                variant="h6"
                                sx={{ mb: 1 }}
                              >
                                {boardMember}
                                <Button
                                  key={boardMember}
                                  variant="contained"
                                  sx={{ ml: 2, bgcolor: "#51087E" }}
                                  onClick={() => {
                                    const newBoard = boardMembers.filter(
                                      (b) => b !== boardMember
                                    );
                                    setBoardMembers(newBoard);
                                  }}
                                >
                                  Remove Board Member
                                </Button>
                              </Typography>
                            </>
                          );
                        })
                      ) : (
                        <Typography variant="h7" sx={{ mb: 1 }}>
                          You have no board members!
                        </Typography>
                      )}
                    </Grid>
                  </Grid>
                  {e && (
                    <Alert variant="outlined" severity="error">
                      {errorMessage}
                    </Alert>
                  )}
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      mt: 4,
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
          </Grid>
          <Grid item xs={5}>
            <Box
              sx={{
                mt: 2,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
                alignContent: "center",
              }}
            >
              <Box>
                <Typography variant="h4" align="center" sx={{ mt: 2 }}>
                  Add a Lawyer
                </Typography>
                <Box
                  onSubmit={handleAddLawyer}
                  component="form"
                  sx={{
                    mt: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        required
                        id="lname"
                        label="Lawyer Name"
                        name="lname"
                      />
                    </Grid>
                    <Button
                      type="submit"
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
                      Add Lawyer
                    </Button>
                  </Grid>
                </Box>
              </Box>
              <Box>
                <Typography variant="h4" align="center" sx={{ mt: 2 }}>
                  Add a Board Member
                </Typography>
                <Box
                  onSubmit={handleAddBoardMember}
                  component="form"
                  sx={{
                    mt: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        required
                        id="bname"
                        label="Board Member Name"
                        name="bname"
                      />
                    </Grid>
                    <Button
                      type="submit"
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
                      Add Board Member
                    </Button>
                  </Grid>
                  <Typography variant="body1" align="center">
                      <Button
                        variant="contained"
                        sx={{
                          mt: 2,
                          mb: 4,
                          bgcolor: "#51087E",
                          "&:hover": {
                            backgroundColor: "#51087E",
                          },
                        }}
                        href="/edit/team/players"
                      >
                        Players Page
                      </Button>
                    </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </ThemeProvider>
    </>
  );

  // return !team ? (
  //   <CircularProgressComponent />
  // ) : (
  //   <ThemeProvider theme={theme}>
  //     <Box
  //       display="flex"
  //       flexDirection="column"
  //       alignItems="center"
  //       mt={5}
  //       mb={5}
  //     >
  //       <Typography variant="h3" align="center" mb={5}>
  //         Update Your Team's Information
  //       </Typography>
  //       <Box
  //         display="flex"
  //         flexDirection="column"
  //         alignItems="center"
  //         mb={5}
  //       >
  //         <Typography variant="h6" mb={2}>
  //           Your Team is {team.teamName}{" "}
  //         </Typography>
  //         <Avatar src={team.logoURL} mb={2} />
  //         {selectedFile ? (
  //           <>
  //             <Box
  //               display="flex"
  //               flexDirection="column"
  //               alignItems="center"
  //               mb={2}
  //             >
  //               <Typography variant="h7" mb={1}>
  //                 This will be your new team logo:
  //               </Typography>
  //               <Avatar
  //                 variant="square"
  //                 src={selectedFile}
  //                 width={100}
  //                 height={100}
  //               />
  //             </Box>
  //           </>
  //         ) : (
  //           <Button
  //             onClick={handleFilePicker}
  //             variant="contained"
  //             color="primary"
  //             mb={2}
  //           >
  //             Change Team Logo
  //           </Button>
  //         )}
  //       </Box>
  //       <Box
  //         display="flex"
  //         flexDirection="column"
  //         alignItems="center"
  //         mb={5}
  //       >
  //         <form onSubmit={handleSubmit}>
  //           <Grid container spacing={2}>
  //             <Grid item xs={12}>
  //               <TextField
  //                 fullWidth
  //                 value={wikiLink}
  //                 onChange={(e) => setWikiLink(e.target.value)}
  //                 id="wikiLink"
  //                 label="Wikipedia Link"
  //                 name="wikiLink"
  //                 required
  //               />
  //             </Grid>
  //             <Grid item xs={12}>
  //               <TextField
  //                 fullWidth
  //                 value={manager}
  //                 onChange={(e) => setManager(e.target.value)}
  //                 id="manager"
  //                 label="Manager Name"
  //                 name="manager"
  //                 required
  //               />
  //             </Grid>
  //             <Grid item xs={12}>
  //               <Typography variant="h5" align="center" mb={2}>
  //                 Your Lawyers:
  //               </Typography>
  //               {lawyers.length !== 0 ? (
  //                 lawyers.map((lawyer) => (
  //                   <Box display="flex" alignItems="center" mb={1}>
  //                     <Typography variant="h6" mb={0}>
  //                       {lawyer}
  //                     </Typography>
  //                     <Button
  //                       variant="contained"
  //                       color="secondary"
  //                       ml={2}
  //                       onClick={() => setLawyers(lawyers.filter((l) => l !== lawyer))}
  //                     >
  //                       Remove
  //                     </Button>
  //                   </Box>
  //                 ))
  //               ) : (
  //                 <Typography variant="h6" color="textSecondary">
  //                   No lawyers added yet
  //                 </Typography>
  //               )}
  //               <Box mt={2}>
  //                 <form onSubmit={handleAddLawyer}>
  //                   <TextField
  //                     fullWidth
  //                     id="lname"
  //                     label="Add a lawyer"
  //                     name="lname"
  //                     required
  //                   />
  //                   <Button
  //                     type="submit"
  //                     variant="contained"
  //                     color="primary"
  //                     mt={2}
  //                   >
  //                     Add Lawyer
  //                   </Button>
  //                 </form>
  //               </Box>
  //             </Grid>
  //             <Grid item xs={12}>
  //               <Typography variant="h5" align="center" mb={2}>
  //                 Your Board Members:
  //               </Typography>
  //               {boardMembers.length !== 0 ? (
  //                 boardMembers.map((boardMember) => (
  //                   <Box display="flex" alignItems="center" mb={1}>
  //                     <Typography variant="h6" mb={0}>
  //                       {boardMember}
  //                     </Typography>
  //                     <Button
  //                       variant="contained"
  //                       color="secondary"
  //                       ml={2}
  //                       onClick={() =>
  //                         setBoardMembers(boardMembers.filter((b) => b !== boardMember))
  //                       }
  //                     >
  //                       Remove
  //                     </Button>
  //                   </Box>
  //                 ))
  //               ) : (
  //                 <Typography variant="h6" color="textSecondary">
  //                   No board members added yet
  //                 </Typography>
  //               )}
  //               <Box mt={2}>
  //                 <form onSubmit={handleAddBoardMember}>
  //                   <TextField
  //                     fullWidth
  //                     id="bname"
  //                     label="Add a board member"
  //                     name="bname"
  //                     required
  //                   />
  //                   <Button type="submit" variant="contained" color="primary" mt={2}>
  //                     Add Board Member
  //                   </Button>
  //                 </form>
  //               </Box>
  //             </Grid>
  //             <Grid item xs={12}>
  //               <Button type="submit" variant="contained" color="primary" mt={2}>
  //                 Update Team
  //               </Button>
  //             </Grid>
  //           </Grid>
  //         </form>
  //       </Box>
  //     </Box>
  //   </ThemeProvider>
  // );

                  
}
