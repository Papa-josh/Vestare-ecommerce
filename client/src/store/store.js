// client/src/store/store.js
//
// Purpose of This File
// ✅ Creates and manages the global Redux store.
// ✅ Combines all slices into a single state management system.
// ✅ Provides a central place where React components can access and update the state.
//
// This will create a store that manages the global state of your React application.
//
//
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import adminProductsSlice from "./admin/products-slice";
import shopProductsSlice from "./shop/products-slice";
import shopCartSlice from "./shop/cart-slice";
import shopAddressSlice from "./shop/address-slice";
import shopOrderSlice from "./shop/order-slice";
import adminOrderSlice from "./admin/order-slice";

//We need to combine all the slice into one slice and that will create a global reducer so we are going to create :
//This will be stored and here we don't need to manually combine all the reducer ReduxToolkit. It will do it for us
const store = configureStore({
  reducer: {
    auth: authReducer,
    adminProducts: adminProductsSlice,
    shopProducts: shopProductsSlice,
    shopCart: shopCartSlice,
    shopAddress: shopAddressSlice,
    shopOrder: shopOrderSlice,
    adminOrder: adminOrderSlice,
  },
});

export default store;
