import { createSlice } from "@reduxjs/toolkit";
import { getPendingForms } from "./thunk";

export const initialState = {
  pendingForms: [],
  updatedForms: [],
  error: "",
};

const centersSlice = createSlice({
  name: "pendingForms",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getPendingForms.fulfilled, (state, action) => {
      if (action.payload.status === "failure") {
        state.error = action.payload.message;
      } else {
        state.pendingForms = action.payload?.data.pendingForms;
        state.updatedForms = action.payload?.data.updatedForms;
        state.error = "";
      }
    });
  },
});

export default centersSlice.reducer;
