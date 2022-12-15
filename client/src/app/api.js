import axios from "axios";

export default axios.create({
  baseURL:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3500/api"
      : "https://ffp-tracker.herokuapp.com/api",
});
