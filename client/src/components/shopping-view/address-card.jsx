// client/src/components/shopping-view/address-card.jsx

import React from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Label } from "../ui/label";
import { Button } from "../ui/button";

function AddressCard({
  addressInfo,
  handleDeleteAddress,
  handleEditAddress,
  setCurrentSelectedAddress,
  selectedId 
}) {
  console.log(selectedId, addressInfo?._id, "selected id and address info id")
  return (
    <Card
      onClick={
        setCurrentSelectedAddress
          ? () => setCurrentSelectedAddress(addressInfo)
          : null
      }
      className={`cursor-pointer border-red-700 ${selectedId?._id === addressInfo?._id ? 'border-red-900 border-[3px]' : 'border-black'}`}  
    >
      <CardContent className={`${selectedId === addressInfo?._id ? 'border-black' : ""} grid p-4 gap-4`}>
        <Label>Address: {addressInfo?.address}</Label>
        <Label>City: {addressInfo?.city}</Label>
        <Label>pincode: {addressInfo?.pincode}</Label>
        <Label>Phone: {addressInfo?.phone}</Label>
        <Label>Notes: {addressInfo?.notes}</Label>
      </CardContent>
      <CardFooter className="p-3 flex justify-between">
        <Button onClick={() => handleEditAddress(addressInfo)}>Edit</Button>
        <Button onClick={() => handleDeleteAddress(addressInfo)}>Delete</Button>
      </CardFooter>
    </Card>
  );
}

export default AddressCard;
