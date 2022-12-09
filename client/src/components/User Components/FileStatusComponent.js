import {
  Alert,
  Button,
  CssBaseline,
  TextField,
  Box,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { UserContext } from "../../contexts/userContext";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import FFP_API from "../../app/api";
import CircularProgressComponent from "../Public Components/CircularProgressComponent";
import { useEffect } from "react";

export default function FileStatusComponent() {
  const { user } = useContext(UserContext);
  const [e, setE] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fileStatus, setFileStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatusData = async () => {
      if (user.role === "Team Admin") {
        await FFP_API.get(`/files/team/${user.teamId}`).then((res) => {
          console.log(res.data);
          setFileStatus(res.data);
        });
      } else {
        await FFP_API.get(`/files`).then((res) => {
          setFileStatus(res.data);
        });
      }
    };
    fetchStatusData();
    setLoading(false);
  }, [user.role, user.teamId, setFileStatus]);

  function displayRows(row) {
    console.log(row);
    return (
      <TableRow
        key={row._id}
        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
      >
        <TableCell component="th" scope="row">
          {row.teamName}
        </TableCell>
        <TableCell align="center">{row.submitDate}</TableCell>
        <TableCell align="center">{row.currentStatus}</TableCell>
        <TableCell align="center">{row.lastUpdated}</TableCell>
        <TableCell align="center">
          <Button href={row.url} target="_blank" variant="contained">
            View
          </Button>
        </TableCell>
      </TableRow>
    );
  }

  const content = fileStatus ? (
    <>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h3" component="h1" gutterBottom sx={{ mt: 4 }}>
          File Status
        </Typography>
        <Container component="main" maxWidth="lg">
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell align="center">Submit Date</TableCell>
                  <TableCell align="center">Current Status</TableCell>
                  <TableCell align="center">Last Updated</TableCell>
                  <TableCell align="center">File</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fileStatus.map((file) => displayRows(file))}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      </Box>
    </>
  ) : (
    <CircularProgressComponent />
  );
  return content;
}
