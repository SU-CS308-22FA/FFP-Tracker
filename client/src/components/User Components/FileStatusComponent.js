import {
  Button,
  CssBaseline,
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
  IconButton,
  Stack,
} from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import BlockIcon from "@mui/icons-material/Block";
import { UserContext } from "../../contexts/userContext";
import { useContext, useState } from "react";
import FFP_API from "../../app/api";
import CircularProgressComponent from "../Public Components/CircularProgressComponent";
import { useEffect } from "react";

export default function FileStatusComponent() {
  const { user } = useContext(UserContext);
  const [fileStatus, setFileStatus] = useState(null);

  useEffect(() => {
    const fetchStatusData = async () => {
      if (user.role === "Team Admin") {
        await FFP_API.get(`/files/team/${user.teamId}`).then((res) => {
          const files = res.data;
          files.sort(function (a, b) {
            return new Date(b.submitDate) - new Date(a.submitDate);
          });
          setFileStatus(files);
        });
      } else {
        await FFP_API.get(`/files`).then((res) => {
          const files = res.data;
          files.sort(function (a, b) {
            return new Date(b.submitDate) - new Date(a.submitDate);
          });
          setFileStatus(files);
        });
      }
    };
    fetchStatusData();
  }, [user.role, user.teamId, setFileStatus]);

  const processDocument = async (process, doc_id) => {
    try {
      const options = {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      };
      await FFP_API.patch(
        `/files/${doc_id}`,
        {
          process: process,
          lastUpdated: new Date().toISOString().slice(0, 10),
        },
        options
      );
      const newFileStatus = fileStatus.map((doc) => {
        if (doc._id === doc_id) {
          doc.currentStatus = process;
          doc.lastUpdated = new Date().toISOString().slice(0, 10);
        }
        return doc;
      });
      setFileStatus(newFileStatus);
    } catch (e) {
      console.log(e);
    }
  };

  function displayRows(row) {
    return (
      <TableRow
        key={row._id}
        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
      >
        <TableCell component="th" scope="row">
          {row.teamName}
        </TableCell>
        <TableCell align="center">{row.submitDate.substring(0, 10)}</TableCell>
        <TableCell align="center">{row.currentStatus}</TableCell>
        <TableCell align="center">{row.lastUpdated.substring(0, 10)}</TableCell>
        <TableCell align="center">
          <Button href={row.url} target="_blank" variant="contained">
            View
          </Button>
        </TableCell>
        <TableCell align="right">
          {user.role === "Lawyer" ? (
            row.currentStatus === "Submitted" ? (
              <Stack direction="row" spacing={1}>
                <IconButton
                  aria-label="approve"
                  color="success"
                  onClick={() =>
                    processDocument(`Approved by ${user.fullname}`, row._id)
                  }
                >
                  <DoneIcon />
                </IconButton>
                <IconButton
                  aria-label="reject"
                  color="error"
                  onClick={() =>
                    processDocument(`Disapproved by ${user.fullname}`, row._id)
                  }
                >
                  <BlockIcon />
                </IconButton>
              </Stack>
            ) : (
              <>Decision Done</>
            )
          ) : null}
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
                  <TableCell>Team</TableCell>
                  <TableCell align="center">Submit Date</TableCell>
                  <TableCell align="center">Current Status</TableCell>
                  <TableCell align="center">Last Updated</TableCell>
                  <TableCell align="center">File</TableCell>
                  {user.role === "Lawyer" ? (
                    <TableCell align="center">Decision</TableCell>
                  ) : null}
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
