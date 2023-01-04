import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { UserContext } from "../../contexts/userContext";
import { useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { client } from "filestack-react";
import FFP_API from "../../app/api";
import emailjs from "@emailjs/browser";
import SimpleLinearRegression from "ml-regression-simple-linear";

const theme = createTheme();

export default function FileSubmitComponent() {
  const { user } = useContext(UserContext);
  const [e, setE] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [date, setDate] = useState("");
  const [users, setUsers] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [revenues, setRevenues] = useState(null);
  const [expenses, setExpenses] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await FFP_API.get(`/users`);
      setUsers(response.data);
    };
    const fetchRevenues = async () => {
      const response = await FFP_API.get(`/revenues`);
      setRevenues(response.data);
    };
    const fetchExpenses = async () => {
      const response = await FFP_API.get(`/expenses`);
      setExpenses(response.data);
    };
    fetchExpenses();
    fetchRevenues();
    fetchUsers();
  }, [setUsers, setRevenues, setExpenses]);

  const navigate = useNavigate();

  // takes an integer input and returns sequence of integers from 0 to input
  function getSequence(input) {
    let sequence = [];
    for (let i = 1; i < input + 1; i++) {
      sequence.push(i);
    }
    return sequence;
  }

  /**
   * This function takes in the parameters of the email
   * to be sent and sends the email to the receiver with
   * the provided mail template code on emailjs.com
   *
   *
   * @function sendEmail
   * @param {Object} parameters consists of the following:
   * 1. to_name: name of the receiver
   * 2. to_email: email of the receiver
   * 3. from_email: email of the sender
   * 4. message: message to be sent
   * 5. subject: subject of the email
   */
  function sendEmail(parameters) {
    emailjs
      .send("gmail", "template_46kzdyk", parameters, "vHB_tCaBZcPIUtpPO")
      .then(
        function (response) {
          console.log("SUCCESS!", response.status, response.text);
        },
        function (error) {
          console.log("FAILED...", error);
        }
      );
  }

  // get list of all users with role of TFF Admin
  const getTFFAdmins = () => {
    if (users) {
      let tffAdmins = [];
      for (let i = 0; i < users.length; i++) {
        if (users[i].role === "TFF Admin") {
          tffAdmins.push(users[i]);
        }
      }
      return tffAdmins;
    }
  };

  const getLawyers = () => {
    if (users) {
      let lawyers = [];
      for (let i = 0; i < users.length; i++) {
        if (users[i].role === "Lawyer") {
          lawyers.push(users[i]);
        }
      }
      return lawyers;
    }
  };

  // create notification function
  async function createNotification(sender, receiver, subject, message) {
    await FFP_API.post(`/notifications`, {
      sender: sender,
      receiver: receiver,
      subject: subject,
      message: message,
    }).catch((error) => {
      setE(true);
      setErrorMessage("Error creating notification Error:" + error);
    });
  }

  // send notification about submitted file, to all TFF Admins
  function sendNotificationToTFFAdmins() {
    //console.log("sendNotificationToTFFAdmins");
    const tffAdmins = getTFFAdmins();
    try {
      for (let i = 0; i < tffAdmins.length; i++) {
        createNotification(
          user._id,
          tffAdmins[i]._id,
          "File Submission",
          "A file has been submitted for review by " + user.fullname
        );
      }
      console.log("succesfully send Notification To TFFAdmins");
    } catch (error) {
      console.log(error);
      setE(true);
      setErrorMessage(
        "Error sending notification to TFF Admins Error:" + error
      );
    }
  }

  // send notification to all Lawyers
  function sendNotificationToLawyers() {
    const lawyers = getLawyers();
    try {
      for (let i = 0; i < lawyers.length; i++) {
        createNotification(
          user._id,
          lawyers[i]._id,
          "File Submission",
          "A file has been submitted for review by " + user.fullname
        );
      }
      console.log("succesfully send Notification To Lawyers");
    } catch (error) {
      console.log(error);
      setE(true);
      setErrorMessage("Error sending notification to lawyers Error:" + error);
    }
  }

  // send notification to user about submitted file
  function sendNotificationToUser() {
    try {
      createNotification(
        user._id,
        user._id,
        "File Submission",
        "Your file has been submitted for review."
      );
      console.log("succesfully submitted file notification is sent");
    } catch (error) {
      console.log(error);
      setE(true);
      setErrorMessage("Error sending notification to user Error:" + error);
    }
  }

  // return total of each value of an object
  function returnTotalOfObject(obj) {
    let total = 0;
    for (let i = 0; i < Object.keys(obj).length; i++) {
      total += obj[Object.keys(obj)[i]];
    }

    return total;
  }

  // get all expenses for users team
  const getExpenses = () => {
    if (expenses) {
      let teamExpenses = [];
      for (let i = 0; i < expenses.length; i++) {
        if (expenses[i].teamId === user.team) {
          teamExpenses.push(expenses[i]);
        }
      }
      return teamExpenses;
    }
  };

  // get total of all expenses for users team
  const TotalExpenses = (data) => {
    var total = 0;
    const teamExpenses = getExpenses();
    for (let i = 0; i < teamExpenses.length; i++) {
      total += returnTotalOfObject(teamExpenses[i].salaries);
      total += returnTotalOfObject(teamExpenses[i].amortization);
      total += returnTotalOfObject(teamExpenses[i].operational);
    }

    total += Number(data.get("Salaries"));
    total += Number(data.get("Amortization"));
    total += Number(data.get("Operational"));

    //console.log("Total Expenses are: " + total);
    return total;
  };

  // get all revenues for users team
  const getRevenues = () => {
    if (revenues) {
      let teamRevenues = [];
      for (let i = 0; i < revenues.length; i++) {
        if (revenues[i].teamId === user.team) {
          teamRevenues.push(revenues[i]);
        }
      }
      return teamRevenues;
    }
  };

  // get total of all revenues for users team
  const TotalRevenues = (data) => {
    var total = 0;
    const teamRevenues = getRevenues();
    for (let i = 0; i < teamRevenues.length; i++) {
      total += returnTotalOfObject(teamRevenues[i].ticketing);
      total += returnTotalOfObject(teamRevenues[i].marketing);
      total += returnTotalOfObject(teamRevenues[i].broadcasting);
    }
    total += Number(data.get("Ticketing"));
    total += Number(data.get("Marketing"));
    total += Number(data.get("Broadcasting"));

    //console.log("Total Revenues are:" + total);
    return total;
  };

  const NetSpend = (data) => {
    //const TotalExpense = TotalExpenses(data);
    //const TotalRevenue = TotalRevenues(data);
    // console.log("Total Expenses are: " + TotalExpenses(data));
    // console.log("Total Revenues are:" + TotalRevenues(data));
    // set net spend to a variable
    //const netSpend = TotalExpenses(data) - TotalRevenues(data);
    console.log("Net Spend is:" + Number(TotalExpenses(data) - TotalRevenues(data)));
    return TotalExpenses(data) - TotalRevenues(data);
  };

  // get all users with role of Team Admin and team of users team
  const getTeamAdmins = () => {
    if (users) {
      let teamAdmins = [];
      for (let i = 0; i < users.length; i++) {
        if (users[i].role === "Team Admin" && users[i].team === user.team) {
          teamAdmins.push(users[i]);
        }
      }
      return teamAdmins;
    }
  };

  // send notification to user if net spend is positive
  function sendNotificationToUserIfNetSpendIsPositive(data) {
    if (NetSpend(data) > 0) {
      try {
        // send notification to all team admins of users team
        const teamAdmins = getTeamAdmins();
        for (let i = 0; i < teamAdmins.length; i++) {
          createNotification(
            user._id,
            teamAdmins[i]._id,
            "Net Spend",
            "Your net spend is: " +
              NetSpend(data) +
              "Mil. TL. " +
              "Please check your expenses"
          );
        }
        console.log("succesfully sent positive net spend notification to user");
      } catch (error) {
        console.log(error);
        setE(true);
        setErrorMessage(
          "Error sending positive net spend notification to user Error:" + error
        );
      }
    }
  }

  // write a linear regression prediction function for revenues
  function predictRevenue(data, date) {
    //console.log("IN PREDICT REVENUE");
    const teamRevenues = getRevenues();
    let x = getSequence(Object.keys(teamRevenues[0].ticketing).length + 1);
    let y = [];

    
    // get revenues by considering key values as month-year and sorting them
    let revenuesByMonth = {};
    for (let i = 0; i < teamRevenues.length; i++) {
      for (const [key, value] of Object.entries(teamRevenues[i].ticketing)) {
        revenuesByMonth[key] = value;
      }
    }
    for (let i = 0; i < teamRevenues.length; i++) {
      for (const [key, value] of Object.entries(teamRevenues[i].marketing)) {
        revenuesByMonth[key] += value;
      }
    }
    for (let i = 0; i < teamRevenues.length; i++) {
      for (const [key, value] of Object.entries(teamRevenues[i].broadcasting)) {
        revenuesByMonth[key] += value;
      }
    }
    // add new expense to expensesByMonth
    revenuesByMonth[date.substring(0, 7)] = Number(data.get("Ticketing")) + Number(data.get("Marketing")) + Number(data.get("Broadcasting"));


    let months = [];
    for (const [key, value] of Object.entries(revenuesByMonth)) {
      months.push(key);
    }
    months.sort((a, b) => {
      const aYear = Number(a.slice(0, 4));
      const bYear = Number(b.slice(0, 4));
      const aMonth = Number(a.slice(5, 7));
      const bMonth = Number(b.slice(5, 7));
      if (aYear === bYear) {
        return aMonth - bMonth;
      } else {
        return aYear - bYear;
      }
    });

    // console.log("Months:",months);
    // console.log("RevenuesByMonth:",revenuesByMonth);

    for (let i = 0; i < months.length; i++) {
      y.push(revenuesByMonth[months[i]]);
    }

    // console.log("Predict Revenue X:",x);
    // console.log("Predict Revenue Y:",y);
    // revert the order of the y array
    //y = y.reverse();

    // if only 1 data, return that data
    if (x.length === 1) {
      return y[0];
    }

    // create a linear regression model
    const model = new SimpleLinearRegression(x, y);

    // predict the next revenue
    let prediction = model.predict(x.length + 1);
    //console.log("Revenue prediction for next month is:" + prediction);
    //console.log("OUT OF PREDICT REVENUE");
    return prediction;
  }

  // write a linear regression prediction function for expenses
  function predictExpense(data, date) {
    //console.log("IN PREDICT EXPENSE");
    const teamExpenses = getExpenses();
    let x = getSequence(Object.keys(teamExpenses[0].salaries).length + 1);
    let y = [];

    // get revenues by considering key values as month-year and sorting them
    let expensesByMonth = {};
    for (let i = 0; i < teamExpenses.length; i++) {
      for (const [key, value] of Object.entries(teamExpenses[i].salaries)) {
        expensesByMonth[key] = value;
      }
    }
    for (let i = 0; i < teamExpenses.length; i++) {
      for (const [key, value] of Object.entries(teamExpenses[i].amortization)) {
        expensesByMonth[key] += value;
      }
    }
    for (let i = 0; i < teamExpenses.length; i++) {
      for (const [key, value] of Object.entries(teamExpenses[i].operational)) {
        expensesByMonth[key] += value;
      }
    }
    // add new expense to expensesByMonth
    expensesByMonth[date.substring(0, 7)] = Number(data.get("Salaries")) + Number(data.get("Amortization")) + Number(data.get("Operational"));

    let months = [];
    for (const [key, value] of Object.entries(expensesByMonth)) {
      months.push(key);
    }

    months.sort((a, b) => {
      const aYear = Number(a.slice(0, 4));
      const bYear = Number(b.slice(0, 4));
      const aMonth = Number(a.slice(5, 7));
      const bMonth = Number(b.slice(5, 7));
      if (aYear === bYear) {
        return aMonth - bMonth;
      } else {
        return aYear - bYear;
      }
    });

    // console.log("Months:",months);
    // console.log("ExpensesByMonth:",expensesByMonth);

    for (let i = 0; i < months.length; i++) {
      y.push(expensesByMonth[months[i]]);
    }

    // console.log("Predict Expense X:",x);
    // console.log("Predict Expense Y:",y);

    // if only 1 data, return that data
    if (x.length === 1) {
      return y[0];
    }

    // create a linear regression model
    const model = new SimpleLinearRegression(x, y);

    // predict the next expense
    let prediction = model.predict(x.length + 1);
    //console.log("Expense prediction for next month is:" + prediction);

    //console.log("OUT OF PREDICT EXPENSE");
    return prediction;
  }

  // predict Net Spend
  function predictNetSpend(data, date) {
    let netSpend = predictRevenue(data, date) - predictExpense(data, date);
    //console.log("Net Spend prediction for next month is:" + netSpend);
    return netSpend;
  }

  // send notification to team admins if predicted net spend is negative
  function sendNotificationToTeamAdminsIfPredictedNetSpendIsNegative(data, date) {
    let PredictedNetSpend = predictNetSpend(data, date);
    console.log("Predicted Net Spend is:" + PredictedNetSpend);
    if (PredictedNetSpend < 0) {
      try {
        // send notification to all team admins of users team
        const teamAdmins = getTeamAdmins();

        for (let i = 0; i < teamAdmins.length; i++) {
          createNotification(
            user._id,
            teamAdmins[i]._id,
            "Predicted Net Spend",
            "Your predicted net spend is: " +
              (PredictedNetSpend*-1) +
              "Mil. TL for the next month. " +
              "Please check your expenses."
          );
        }
        console.log(
          "succesfully sent predicted negative net spend notification to team admins"
        );
      } catch (error) {
        console.log(error);
        setE(true);
        setErrorMessage(
          "Error sending predicted negative net spend notification to team admins Error:" +
            error
        );
      }
    }
  }

  // send email to team admins if predicted net spend is negative
  function sendEmailToTeamAdminsIfPredictedNetSpendIsNegative(data, date) {
    let PredictedNetSpend = predictNetSpend(data, date);
    if (PredictedNetSpend < 0) {
      try {
        // send email to all team admins of users team
        const teamAdmins = getTeamAdmins();
        for (let i = 0; i < teamAdmins.length; i++) {
          var parameters = {
            to_email: teamAdmins[i].email,
            to_name: teamAdmins[i].fullname,
            from_email: "retsim75@gmail.com",
            subject: "Financial Risk is Predicted in Net Spend for Next Month",
            message:
              "Your predicted net spend is: " +
              (PredictedNetSpend * -1) +
              "Mil. TL for the next month. Please check your expenses.",
          };
          sendEmail(parameters);
        }
        console.log(
          "succesfully sent predicted net spend email to team admins"
        );
      } catch (error) {
        console.log(error);
        setE(true);
        setErrorMessage(
          "Error sending predicted net spend email to team admins Error:" +
            error
        );
      }
    }
  }

  // send email to team admins if net spend is positive
  function sendEmailToTeamAdminsIfNetSpendIsPositive(data) {
    if (NetSpend(data) > 0) {
      try {
        // send email to all team admins of users team
        const teamAdmins = getTeamAdmins();
        for (let i = 0; i < teamAdmins.length; i++) {
          var parameters = {
            to_email: teamAdmins[i].email,
            to_name: teamAdmins[i].fullname,
            from_email: "retsim75@gmail.com",
            subject: "Net Spend is Positive",
            message:
              "Your net spend is: " +
              NetSpend(data) +
              "Mil. TL. " +
              "Please check your expenses",
          };
          sendEmail(parameters);
        }
        console.log("succesfully sent positive net spend email to team admins");
      } catch (error) {
        console.log(error);
        setE(true);
        setErrorMessage(
          "Error sending positive net spend email to team admins Error:" + error
        );
      }
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setE(false);
    setErrorMessage("");
    const data = new FormData(event.currentTarget);
    if (!user?.team) {
      setE(true);
      setErrorMessage("You are not part of a team");
    } else if (selectedFile === null) {
      setE(true);
      setErrorMessage("You have to upload a file!");
    } else if (date > new Date().toISOString().substring(0, 10)) {
      setE(true);
      setErrorMessage("Date cannot be in the future!");
    } else {
      try {
        const options = {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        };
        await FFP_API.patch(
          `/revenues/${user.team}`,
          {
            ticketing: data.get("Ticketing"),
            marketing: data.get("Marketing"),
            broadcasting: data.get("Broadcasting"),
            month: date.substring(0, 7),
          },
          options
        );
        await FFP_API.patch(
          `/expenses/${user.team}`,
          {
            salaries: data.get("Salaries"),
            amortization: data.get("Amortization"),
            operational: data.get("Operational"),
            month: date.substring(0, 7),
          },
          options
        );
        await FFP_API.post(`/files/team/${user.team}`, {
          file: selectedFile,
          submitDate: date,
        });
        alert("Successfully submitted!");
        sendNotificationToTFFAdmins();
        sendNotificationToLawyers();
        sendNotificationToUser();
        sendNotificationToUserIfNetSpendIsPositive(data);
        sendEmailToTeamAdminsIfNetSpendIsPositive(data);
        sendNotificationToTeamAdminsIfPredictedNetSpendIsNegative(data, date);
        sendEmailToTeamAdminsIfPredictedNetSpendIsNegative(data, date);
        navigate(`/my/profile/`);
      } catch (error) {
        console.log(error);
        setE(true);
        setErrorMessage(error.response.data.error);
      }
    }
  };

  const handleFilePicker = () => {
    const filestackApikey = "AJ72c4DJLSPqnTctAvQ0wz"; //insert here with your own api key
    const filestack = client.init(filestackApikey);
    const options = {
      onFileUploadFinished(file) {
        setSelectedFile(file.url);
      },
    };
    const picker = filestack.picker(options);
    picker.open();
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="sm">
          <CssBaseline />
          <Box
            sx={{
              mt: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography component="h1" variant="h3" sx={{}}>
              File Submission
            </Typography>
            <Box component="form" onSubmit={handleSubmit}>
              {selectedFile ? (
                <>
                  <Typography component="h2" variant="h5" sx={{ mt: 2, mb: 2 }}>
                    Uploaded File:{" "}
                    <Button href={selectedFile} target="_blank">
                      Click here to view file
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      sx={{ ml: 2 }}
                      onClick={handleRemoveFile}
                    >
                      Remove File
                    </Button>
                  </Typography>
                  <Container maxWidth="sm"></Container>
                </>
              ) : (
                <Button
                  onClick={handleFilePicker}
                  fullWidth
                  variant="contained"
                  sx={{ mt: 2, mb: 2 }}
                >
                  Pick a file to Upload
                </Button>
              )}

              <Typography component="h2" variant="h5">
                Revenues
              </Typography>
              <TextField
                inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                margin="normal"
                fullWidth
                id="Ticketing"
                label="Ticketing"
                name="Ticketing"
                required
              />
              <TextField
                inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                margin="normal"
                fullWidth
                id="Marketing"
                label="Marketing"
                name="Marketing"
                required
              />
              <TextField
                inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                margin="normal"
                fullWidth
                id="Broadcasting"
                label="Broadcasting"
                name="Broadcasting"
                required
              />
              <Box
                sx={{
                  marginTop: 3,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              ></Box>
              <Typography component="h1" variant="h5">
                Expenses
              </Typography>
              <TextField
                inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                margin="normal"
                fullWidth
                id="Salaries"
                label="Salaries"
                name="Salaries"
                required
              />
              <TextField
                inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                margin="normal"
                fullWidth
                id="Amortization"
                label="Amortization"
                name="Amortization"
                required
              />
              <TextField
                inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                margin="normal"
                fullWidth
                name="Operational"
                label="Operational"
                id="Operational"
                required
              />
              <Box
                sx={{
                  marginTop: 3,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              ></Box>
              <Typography component="h1" variant="h5">
                Date of Submission
              </Typography>
              <TextField
                margin="normal"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                fullWidth
                id="date"
                name="date"
                className="form-control"
                type="date"
              />
              {e && (
                <Alert variant="outlined" severity="error" sx={{ mt: 2 }}>
                  {errorMessage}
                </Alert>
              )}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 4 }}
              >
                Submit
              </Button>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </>
  );
}
