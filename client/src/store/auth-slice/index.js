// client/src/store/auth-slice/index.js

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Initial state
const initialState = {
  isAuthenticated: false, //if user is authenticated or not
  isLoading: true, // Whether an async operation is in progress
  user: null, //User information
};

// REGISTER user thunk action
export const registerUser = createAsyncThunk(
  "/auth/register", //Name of the action
  //
  //received data
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/register", //// pass the url
        formData,
        {
          withCredentials: true, //is a configuration setting that determines whether or not cross-site Access-Control requests (CORS) should include credentials, such as cookies, authorization headers, or TLS client certificates.
        }
      );
      return response.data; // Return response data on success
    } catch (error) {
      // Return a rejected value with the error message
      return rejectWithValue(error.response.data || "Registration failed");
    }
  }
);

// LOGIN user thunk action
export const loginUser = createAsyncThunk(
  "/auth/login", //Name of the action
  //
  //received data
  async (formData, { rejectWithValue }) => {
    try {
      //simply as axios.post(url, data, config)
      const response = await axios.post(
        "http://localhost:3000/api/auth/login", //// pass the url
        formData, //data
        {
          withCredentials: true, //is a configuration setting that determines whether or not cross-site Access-Control requests (CORS) should include credentials, such as cookies, authorization headers, or TLS client certificates.
        }
      );
      return response.data; // Return response data on success
    } catch (error) {
      // Return a rejected value with the error message
      return rejectWithValue(error.response.data || "Registration failed");
    }
  }
);

export const logoutUser = createAsyncThunk(
  "/auth/logout", //Name of the action
  //
  //received data
  async (_, { rejectWithValue }) => {
    try {
      //simply as axios.post(url, data, config)
      const response = await axios.post(
        "http://localhost:3000/api/auth/logout",
        {},
        //// pass the url
        {
          withCredentials: true, //is a configuration setting that determines whether or not cross-site Access-Control requests (CORS) should include credentials, such as cookies, authorization headers, or TLS client certificates.
        }
      );
      return response.data; // Return response data on success
    } catch (error) {
      // Return a rejected value with the error message
      return rejectWithValue(error.response.data);
    }
  }
);

// middleware async thunk
export const checkAuth = createAsyncThunk(
  "/auth/checkauth", //Name of the action
  //
  //received data
  async () => {
    const response = await axios.get(
      "http://localhost:3000/api/auth/check-auth", //// pass the url
      {
        withCredentials: true, //is a configuration setting that determines whether or not cross-site Access-Control requests (CORS) should include credentials, such as cookies, authorization headers, or TLS client certificates.
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
    return response.data; // Return response data on success
  }
);

// Auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      // state.user = action.payload;
      // state.isAuthenticated = !!action.payload;
    },
  },

  //
  //here is What will happen whenever you call the registerUser
  extraReducers: (builder) => {
    builder
      //
      //pending: When the async operation starts.
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null; // Clear previous errors
      })
      //
      //fulfilled: When the async operation completes successfully.
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false; //false as they need to login first
      })
      //
      //rejected: When the async operation fails.
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null; //This is the data returned by the asynchronous operation (registerUser thunk).
        state.isAuthenticated = false; //false as they need to login first
        state.error = action.payload; //Set error message
      })

      //LOGIN
      //
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null; // Clear previous errors
      })
      //
      //fulfilled: When the async operation completes successfully.
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null; //This is the data returned by the asynchronous operation (registerUser thunk).
        state.isAuthenticated = action.payload.success ? true : false; //false as they need to login first
      })
      //
      //rejected: When the async operation fails.
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false; //false as they need to login first
        state.error = action.payload; //Set error message
      })

      //
      //checkAuth (MIDDLEWARE)
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      //
      //fulfilled: When the async operation completes successfully.
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null; //This is the data returned by the asynchronous operation (registerUser thunk).
        state.isAuthenticated = action.payload.success; //false as they need to login first
      })
      //
      //rejected: When the async operation fails.
      .addCase(checkAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false; //false as they need to login first
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = null; // Clear the user data upon logout
        state.isAuthenticated = false; // Set isAuthenticated to false
      });
  },
});

// Export actions and reducer
export const { setUser } = authSlice.actions;
export default authSlice.reducer;
