import {
  Button,
  Box,
  Typography,
  Paper,
  IconButton,
  Stack,
  Container,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import DoneIcon from "@mui/icons-material/Done";
import BlockIcon from "@mui/icons-material/Block";
import { UserContext } from "../../contexts/userContext";
import { useContext, useState, useEffect } from "react";
import FFP_API from "../../app/api";

export default function FileStatusComponent() {
  const { user } = useContext(UserContext);
  const [fileStatus, setFileStatus] = useState([]);

  useEffect(() => {
    const fetchStatusData = async () => {
      if (user.role === "Team Admin") {
        await FFP_API.get(`/files/team/${user.team}`).then((res) => {
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
  }, [user.role, user.team, setFileStatus]);

  async function handleViewFile(process, doc_id) {
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
  }

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

  const columns = [
    {
      field: "teamName",
      headerName: "Team Name",
      width: 200,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "submitDate",
      headerName: "Submit Date",
      headerAlign: "center",
      align: "center",
      width: 100,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Typography variant="body2">
            {params.row.submitDate.substring(0, 10)}
          </Typography>
        );
      },
    },
    {
      field: "currentStatus",
      headerName: "Current Status",
      headerAlign: "center",
      align: "center",
      width: 250,
    },
    {
      field: "lastUpdated",
      headerName: "Last Updated",
      width: 120,
      align: "center",
      headerAlign: "center",
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Typography variant="body2">
            {params.row.lastUpdated.substring(0, 10)}
          </Typography>
        );
      },
    },
    {
      field: "view",
      headerName: "File",
      width: 100,
      align: "center",
      headerAlign: "center",
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Button
            href={params.row.url}
            target="_blank"
            variant="contained"
            onClick={function () {
              if (
                params.row.currentStatus === "Submitted" &&
                user.role === "Lawyer"
              ) {
                handleViewFile(`In review by ${user.fullname}`, params.row._id);
              }
            }}
          >
            View
          </Button>
        );
      },
    },
    {
      field: "decision",
      headerName: "Decision",
      width: 100,
      headerAlign: "center",
      renderCell: (params) => {
        if (
          params.row.currentStatus.indexOf("Approved") === -1 &&
          params.row.currentStatus.indexOf("Disapproved") === -1
        ) {
          return (
            <Stack direction="row" spacing={1}>
              <IconButton
                aria-label="approve"
                color="success"
                onClick={() =>
                  processDocument(
                    `Approved by ${user.fullname}`,
                    params.row._id
                  )
                }
              >
                <DoneIcon />
              </IconButton>
              <IconButton
                aria-label="reject"
                color="error"
                onClick={() =>
                  processDocument(
                    `Disapproved by ${user.fullname}`,
                    params.row._id
                  )
                }
              >
                <BlockIcon />
              </IconButton>
            </Stack>
          );
        } else {
          return <Typography variant="body2">Decision done</Typography>;
        }
      },
    },
  ];
  return (
    <>
      <Container maxWidth="lg" disableGutters>
        <Typography variant="h3" align="center" sx={{ mt: 2 }}>
          File Status
        </Typography>
        <Box
          sx={{
            mt: 4,
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
          }}
        >
          <Paper
            component={Box}
            width={user.role === "Lawyer" ? 900 : 800}
            height={630.5}
          >
            <DataGrid
              initialState={{
                columns: {
                  columnVisibilityModel: {
                    decision: user.role === "Lawyer" ? true : false,
                  },
                },
              }}
              rows={fileStatus}
              columns={columns}
              getRowId={(row) => row._id}
              pageSize={10}
              disableSelectionOnClick
              experimentalFeatures={{ newEditingApi: true }}
            />
          </Paper>
        </Box>
      </Container>
    </>
  );
}
