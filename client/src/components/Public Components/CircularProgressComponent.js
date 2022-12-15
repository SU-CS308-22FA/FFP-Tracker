import Container from "@mui/material/Container";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

export default function CircularProgressComponent() {
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          justifyContent: "center",
          minHeight: "75vh",
        }}
      >
        Loading...
        <CircularProgress />
      </Box>
    </Container>
  );
}
