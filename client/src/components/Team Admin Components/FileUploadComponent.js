import Button from "@mui/material/Button";
import { client } from "filestack-react";

export default function FileUploadComponent() {
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
