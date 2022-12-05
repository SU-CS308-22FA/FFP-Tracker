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
import { useEffect } from "react";

export default function FileStatusComponent() {
  const mockData = [
    {
      id: 1,
      submitDate: "2021-10-01",
      currentStatus: "In Review",
      lastUpdated: "2021-10-01",
    },
    {
      id: 2,
      submitDate: "2021-10-01",
      currentStatus: "Submitted",
      lastUpdated: "2021-10-01",
    },
    {
      id: 3,
      submitDate: "2022-10-01",
      currentStatus: "Review Complete - Approved",
      lastUpdated: "20212-10-12",
    },
    {
      id: 4,
      submitDate: "2021-10-01",
      currentStatus: "Review Complete - Rejected",
      lastUpdated: "2021-10-01",
    },
  ];

  function displayRows(row) {
    return (
      <TableRow
        key={row.name}
        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
      >
        <TableCell component="th" scope="row">
          {row.id}
        </TableCell>
        <TableCell align="right">{row.submitDate}</TableCell>
        <TableCell align="right">{row.currentStatus}</TableCell>
        <TableCell align="right">{row.lastUpdated}</TableCell>
      </TableRow>
    );
  }

  const content = (
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
                  <TableCell>ID</TableCell>
                  <TableCell align="right">Submit Date</TableCell>
                  <TableCell align="right">Current Status</TableCell>
                  <TableCell align="right">Last Updated</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{mockData.map((row) => displayRows(row))}</TableBody>
            </Table>
          </TableContainer>
        </Container>
      </Box>
    </>
  );
  return content;
}
