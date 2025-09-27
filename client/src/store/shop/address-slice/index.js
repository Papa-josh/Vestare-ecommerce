// client/src/store/shop/address-slice/index.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  addressList: [],
};

export const addNewAddress = createAsyncThunk(
  "/addresses/addNewAddress",
  async (formData, { rejectWithValue }) => {
    try {
      // console.log("Sending request to API with data:", formData); // ✅ Check if this logs
      const response = await axios.post(
        "http://localhost:3000/api/shop/address/add",
        formData
      );
      // console.log("API response:", response.data); // ✅ Check response
      return response.data;
    } catch (error) {
      console.error("API request failed:", error); // ✅ Check if an error occurs
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchAllAddressess = createAsyncThunk(
  "/addresses/fetchAllAddressess",
  async (userId) => {
    const response = await axios.get(
      `http://localhost:3000/api/shop/address/get/${userId}`
    );

    return response.data;
  }
);
export const editaAddress = createAsyncThunk(
  "/addresses/editaAddress",
  async ({ userId, addressId, formData }) => {
    const response = await axios.put(
      `http://localhost:3000/api/shop/address/update/${userId}/${addressId}`,
      formData
    );

    return response.data;
  }
);
export const deleteAddress = createAsyncThunk(
  "/addresses/deleteAddress",
  async ({ userId, addressId }) => {
    const response = await axios.delete(
      `http://localhost:3000/api/shop/address/delete/${userId}/${addressId}`
    );

    return response.data;
  }
);

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addNewAddress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addNewAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        // state.addressList = action.payload.data;
      })
      .addCase(addNewAddress.rejected, (state) => {
        state.isLoading = false;
        // state.addressList = [];
      })
      .addCase(fetchAllAddressess.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllAddressess.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addressList = action.payload.data;
      })
      .addCase(fetchAllAddressess.rejected, (state) => {
        state.isLoading = true;
        state.addressList = [];
      });
  },
});

export default addressSlice.reducer;
