import Button from "@mui/material/Button";
import { client } from "filestack-react";

export default function FileUploadComponent() {
  /*
  const [selectedFile, setSelectedFile] = useState();
  const [isSelected, setIsSelected] = useState(false);

  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
    setIsSelected(true);
  };

  const handleSubmission = async () => {
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
  */

  const handleFilePicker = () => {
    const filestackApikey = "AJ72c4DJLSPqnTctAvQ0wz"; //insert here with your own api key
    const filestack = client.init(filestackApikey);
    const picker = filestack.picker();
    picker.open();
  };

  return (
    <Button
      onClick={handleFilePicker}
      fullWidth
      variant="contained"
      sx={{ mb: 3, mt: -5 }}
    >
      Pick a file to Upload
    </Button>
  );
}
