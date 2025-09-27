// client/src/store/shop/products-slice

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,

  //state container for product list
  productList: [],
  productDetails: null,
};

//async thunk for fetching all products
export const fetchAllFilteredProducts = createAsyncThunk(
  "/products/fetchAllProducts",

  async ({ filterParams, sortParams }) => {
    // console.log(fetchAllFilteredProducts, "fetchAllFilteredProducts");
    //call the API to get all the list of products

    const query = new URLSearchParams({
      ...filterParams,
      sortBy: sortParams,
    });

    // Here we will get all the  products
    const result = await axios.get(
      `http://localhost:3000/api/shop/products/get?${query}`
    );

    // console.log(result, "result");

    return result?.data;
  }
);

//async thunk for fetching product details
export const fetchProductDetails = createAsyncThunk(
  "/products/fetchProductDetails",
  async (id) => {
    const result = await axios.get(
      `http://localhost:3000/api/shop/products/get/${id}`
    );

    return result?.data;
  }
);
const shoppingProductSlice = createSlice({
  name: "shoppingProducts",
  initialState,
  reducers: {
    //reset the product details
    setProductDetails: (state) => {
      state.productDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllFilteredProducts.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchAllFilteredProducts.fulfilled, (state, action) => {
        // console.log(action.payload, "action.payload");
        state.isLoading = false;
        state.productList = action.payload.data;
      })
      .addCase(fetchAllFilteredProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.productList = [];
      })

      .addCase(fetchProductDetails.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productDetails = action.payload.data;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.productDetails = null;
      });
  },
});

export const { setProductDetails } = shoppingProductSlice.actions;
export default shoppingProductSlice.reducer;
