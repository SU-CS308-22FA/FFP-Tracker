import React, { useState } from "react";
import Button from "@mui/material/Button";
import { Dropdown } from "semantic-ui-react";
import { client } from "filestack-react";
import TextField from "@mui/material/TextField";

export default function FileUploadPage() {
  const [selectedFile, setSelectedFile] = useState();
  const [isSelected, setIsSelected] = useState(false);

  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
    setIsSelected(true);
  };

  const handleFilePicker = () => {
    const filestackApikey = "AJ72c4DJLSPqnTctAvQ0wz"; //insert here with your own api key
    const filestack = client.init(filestackApikey);
    const picker = filestack.picker();
    picker.open();
  };

  const handleSubmission = () => {
    const formData = new FormData();

    formData.append("File", selectedFile);

    fetch(
      "http://freeimage.host/api/1/upload/?key=6d207e02198a847aa98d0a2a901485a5",
      {
        method: "POST",
        body: formData,
      }
    )
      .then((response) => response.json())
      .then((result) => {
        console.log("Success:", result);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  const options = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const defaultOption = "MONTH";
  return (
    <Button
      onClick={handleFilePicker}
      fullWidth
      variant="contained"
      sx={{ mb: 3, mt: -5 }}
    >
      FILE PICKER
    </Button>
  );
}
