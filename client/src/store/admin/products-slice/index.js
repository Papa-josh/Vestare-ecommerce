// client/src/store/admin/products-slice/index.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  productList: [],
  productDetails: null,
};

//async thunk for adding new product
export const addNewProduct = createAsyncThunk(
  "/products/addnewproduct",

  //received data
  async (formData) => {
    //call the API
    const result = await axios.post(
      "http://localhost:3000/api/admin/products/add",
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return result?.data;
  }
);

//async thunk for fetching all products
export const fetchAllProducts = createAsyncThunk(
  "/products/fetchAllProducts",

  //no need to receive data
  async () => {
    //call the API to get all the list of products
    const result = await axios.get(
      "http://localhost:3000/api/admin/products/get"
    );
    return result?.data;
  }
);

//async thunk for edditing product
export const edditProduct = createAsyncThunk(
  "/products/edditProduct",

  //received data but with ID
  async ({ id, formData }) => {
    //call the API
    const result = await axios.put(
      `http://localhost:3000/api/admin/products/edit/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return result?.data;
  }
);

//async thunk for deleting new product
export const deleteProduct = createAsyncThunk(
  "/products/deleteProduct",

  //received id
  async (id) => {
    //call the API
    const result = await axios.delete(
      `http://localhost:3000/api/admin/products/delete/${id}`
    );
    return result?.data;
  }
);

const AdminProductSlice = createSlice({
  name: "adminProducts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProducts.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        console.log(action.payload);
        state.isLoading = false;
        state.productList = action.payload.data;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.productList = [];
      });
  },
});

export default AdminProductSlice.reducer;
