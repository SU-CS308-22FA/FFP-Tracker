import emailjs from "@emailjs/browser";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";

const EMAIL_REGEX = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

export default function NotificationForm() {
  const navigate = useNavigate();
  async function sendEmail(e) {
    e.preventDefault();
    if (!EMAIL_REGEX.test(e.target.to_email.value)) {
      alert("Invalid recipient email address.");
      return;
    }
    if (!EMAIL_REGEX.test(e.target.from_email.value)) {
      alert("Invalid sender email address.");
      return;
    }
    await emailjs
      .sendForm("gmail", "template_46kzdyk", e.target, "vHB_tCaBZcPIUtpPO")
      .then(
        (result) => {
          console.log(result.text);
          alert("Email sent successfully!");
          navigate("/my/profile");
        },
        (error) => {
          console.log(error.text);
        }
      );
    e.target.reset();
  }

  return (
    <>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Typography component="h1" mt={4} variant="h4" align="center">
          Send Email
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
          component="form"
          onSubmit={sendEmail}
        >
          <TextField
            required
            fullWidth
            id="outlined-required"
            label="To Email"
            defaultValue=""
            placeholder="To Email"
            variant="outlined"
            name="to_email"
            sx={{ mt: 4 }}
          />
          <TextField
            required
            fullWidth
            id="outlined-required"
            label="To Name"
            defaultValue=""
            placeholder="To Name"
            variant="outlined"
            name="to_name"
            sx={{ mt: 2 }}
          />
          <TextField
            required
            fullWidth
            id="outlined-required"
            label="From Email"
            defaultValue=""
            placeholder="From EMail"
            variant="outlined"
            name="from_email"
            sx={{ mt: 2 }}
          />
          <TextField
            required
            fullWidth
            id="outlined-required"
            label="From Name"
            defaultValue=""
            placeholder="From Name"
            variant="outlined"
            name="from_name"
            sx={{ mt: 2 }}
          />
          <TextField
            required
            fullWidth
            id="outlined-required"
            label="Subject"
            defaultValue=""
            placeholder="Subject"
            variant="outlined"
            name="subject"
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            id="outlined-multiline-static"
            label="Message"
            multiline
            required
            rows={10}
            defaultValue=""
            placeholder="Message"
            variant="outlined"
            name="message"
            sx={{ mt: 2 }}
          />
          <Button
            variant="contained"
            type="submit"
            value="Send Notification"
            color="success"
            sx={{ mt: 2 }}
          >
            Send Email
          </Button>
        </Box>
      </Container>
    </>
  );
}
