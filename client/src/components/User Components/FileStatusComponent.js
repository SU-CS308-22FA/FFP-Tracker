import {
  Alert,
  Button,
  CssBaseline,
  TextField,
  Box,
  Container,
  Typography,
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
        {/* 
        Use the table from MUI
        Maybe add a new component to display the table
        */}
      </Box>
    </>
  );
  return content;
}
