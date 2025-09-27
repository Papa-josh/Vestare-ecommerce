// client/src/components/shopping-view/address.jsx

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import CommonForm from "../common/form";
import { addressFormControls } from "@/config";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewAddress,
  deleteAddress,
  editaAddress,
  fetchAllAddressess,
} from "@/store/shop/address-slice";
import { use } from "react";
import AddressCard from "./address-card";
import { useToast } from "@/hooks/use-toast";

const initialAddressFormData = {
  address: "",
  city: "",
  phone: "",
  pincode: "",
  notes: "",
};

function Address({ setCurrentSelectedAddress }) {
  const [formData, setFormData] = useState(initialAddressFormData);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { addressList } = useSelector((state) => state.shopAddress);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const { toast } = useToast();
  const [originalFormData, setOriginalFormData] = useState(
    initialAddressFormData
  );

  function handleManageAddress(event) {
    event.preventDefault();

    // Check address limit ONLY when adding a new address
    if (currentEditedId === null && addressList.length >= 3) {
      toast({
        title: "You can not add more than 3 address",
        variant: "destructive",
      });
      return;
    }

    //editing the address
    if (currentEditedId !== null) {
      dispatch(
        editaAddress({
          //primary key
          userId: user?.id,
          //secondary key
          addressId: currentEditedId,
          //data
          formData,
        })
      ).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllAddressess(user?.id));
          setFormData(initialAddressFormData);
          setCurrentEditedId(null);
          setOriginalFormData(initialAddressFormData);
          toast({
            message: "Address updated successfully",
          });
        }
      });
      return; // Ensure we stop execution here to prevent falling into the add flow
    }

    //adding new address
    dispatch(
      addNewAddress({
        ...formData,
        userId: user?.id,
      })
    ).then((data) => {
      // console.log(data, "addressData");

      if (data?.payload?.success) {
        //fetching the address
        dispatch(fetchAllAddressess(user?.id));

        //reset the form
        setFormData(initialAddressFormData);
        setOriginalFormData(initialAddressFormData);
        toast({
          message: "Address  added successfully",
        });
      }
    });
  }
  // console.log(addressList, "addressList");

  function handleEditAddress(getCurrentAddress) {
    // console.log(getCurrentAddress, "getCurrentAddress");
    setCurrentEditedId(getCurrentAddress._id);

    // here we are setting the form data
    setFormData({
      address: String(getCurrentAddress.address || ""),
      city: String(getCurrentAddress.city || ""),
      phone: String(getCurrentAddress.phone || ""),
      pincode: String(getCurrentAddress.pincode || ""),
      notes: String(getCurrentAddress.notes || ""),
    });

    // here we are setting the original form data
    setOriginalFormData({
      address: String(getCurrentAddress.address || ""),
      city: String(getCurrentAddress.city || ""),
      phone: String(getCurrentAddress.phone || ""),
      pincode: String(getCurrentAddress.pincode || ""),
      notes: String(getCurrentAddress.notes || ""),
    });
  }

  function handleDeleteAddress(getCurrentAddress) {
    // console.log(getCurrentAddress, "getCurrentAddress");
    dispatch(
      deleteAddress({ userId: user?.id, addressId: getCurrentAddress._id })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllAddressess(user?.id));
      }
    });
  }

  // checking if the form is valid (not empty or touched)
  function isFormValid() {
    return (
      Object.values(formData)
        .map((value) =>
          typeof value === "string"
            ? value.trim() !== ""
            : value !== null && value !== undefined
        )

        // here it checks if all the values are true
        .every((item) => item)
    );
  }

  function hasFormChanged() {
    // Check if the form data has changed
    // if identical then return false but if different then return true
    return JSON.stringify(formData) !== JSON.stringify(originalFormData);
  }

  useEffect(() => {
    dispatch(fetchAllAddressess(user?.id));
  }, [dispatch]);

  return (
    <Card>
      <div className="mb-5 p-3 grid grid-cols-1 sm:grid-cols-2  gap-2">
        {/* Here we are rendering the address cards */}
        {addressList && addressList.length > 0
          ? addressList.map((singleAddressItem, indx) => (
              <AddressCard
                handleDeleteAddress={handleDeleteAddress}
                handleEditAddress={handleEditAddress}
                key={indx}
                addressInfo={singleAddressItem}
                setCurrentSelectedAddress={setCurrentSelectedAddress}
              />
            ))
          : null}
      </div>
      <CardHeader>
        <CardTitle>
          {currentEditedId !== null ? "Edit Address" : "Add Address"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <CommonForm
          formControls={addressFormControls}
          formData={formData}
          setFormData={setFormData}
          // buttonText={currentEditedId !== null ? "Edit" : "Add"}
          buttonText={
            currentEditedId !== null
              ? hasFormChanged()
                ? "Save"
                : "Edit"
              : "Add"
          }
          onSubmit={handleManageAddress}
          //if the form is not valid the button will be disabled
          isBtnDisabled={
            !isFormValid() || (currentEditedId !== null && !hasFormChanged())
          }
        />
      </CardContent>
    </Card>
  );
}

export default Address;
