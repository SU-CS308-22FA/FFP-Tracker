import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const appURL =
  process.env.NODE_ENV === "production"
    ? "https://ffp-tracker.herokuapp.com/"
    : "http://localhost:3500";

export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: appURL,
  }),
  endpoints: (builder) => ({}),
});
