// client/src/components/admin-view/order-details.jsx

import React, { useState } from "react";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import CommonForm from "../common/form";
import { getOrderDetailsForAdmin } from "@/store/admin/order-slice";
import { useDispatch, useSelector } from "react-redux";
import { Badge } from "../ui/badge";
import {
  getAllOrdersForAdmin,
  updateOrderStatus,
} from "@/store/admin/order-slice";
import { useToast } from "@/hooks/use-toast";

const initialFormData = { status: "" };

function AdminOrderDetailsView({ orderDetails }) {
  const [formData, setFormData] = useState(initialFormData);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { toast } = useToast();

  const isBtnDisabled = formData.status === "";
  
  console.log(orderDetails, "order dEtails admin");

  function handleUpdateStatus(event) {
    event.preventDefault();
    // console.log(formData , "form data");
    const { status } = formData;
  
    dispatch(
      updateOrderStatus({ id: orderDetails._id, orderStatus: status })
    ).then((data) => {
      // console.log("Order status updated", data);
      if (data.payload.success) {
        dispatch(getOrderDetailsForAdmin(orderDetails?._id));
        dispatch(getAllOrdersForAdmin());
        setFormData(initialFormData);
        toast({
          title: data.payload.message,
        });
      }
    });
  }

  return (
    <DialogContent className="sm:max-w-[540px] max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Order Details</DialogTitle>
        <DialogDescription>
          Here you can view details about your selected order.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <div className="flex mt-6 items-center justify-between">
            <p className="font-medium">Order ID</p>
            <Label>{orderDetails?._id}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Date</p>
            <Label>{orderDetails?.orderDate.split("T")[0]}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Price</p>
            <Label>
              {orderDetails?.totalAmount?.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Payment method</p>
            <Label>{orderDetails?.paymentM}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Status</p>
            <Badge
              className={`py-1 px-3 ${
                orderDetails?.orderStatus === "confirmed"
                  ? "bg-green-500"
                  : orderDetails?.orderStatus === "rejected"
                  ? "bg-red-500"
                  : "bg-black"
              }`}
            >
              {orderDetails?.orderStatus}
            </Badge>
          </div>
        </div>
        <Separator />
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Order Details</div>
            <ul className="grid gap-3">
              {orderDetails?.cartItems && orderDetails.cartItems.length > 0
                ? orderDetails.cartItems.map((item) => (
                    <li
                      key={item._id}
                      className="flex items-center justify-between"
                    >
                      <span>Title: {item.title}</span>
                      <span>Quantity: {item.quantity}</span>
                      <span>
                        Price:{" "}
                        {item.price?.toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })}
                      </span>
                    </li>
                  ))
                : null}
            </ul>
          </div>
        </div>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Shipping Info</div>
            <div className="grid gap-0.5 text-muted-foreground">
              <span>{user?.userName}</span>
              <span>{orderDetails?.addressInfo?.address}</span>
              <span>{orderDetails?.addressInfo?.city}</span>
              <span>{orderDetails?.addressInfo?.pincode}</span>
              <span>{orderDetails?.addressInfo?.phone}</span>
              <span>{orderDetails?.addressInfo?.notes}</span>
            </div>
          </div>
        </div>
        <div>
          {
            <CommonForm
              formControls={[
                {
                  label: "Order Status",
                  name: "status",
                  componentType: "select",
                  options: [
                    { id: "pending", label: "Pending" },
                    { id: "inProcess", label: "In Process" },
                    { id: "inShipping", label: "In Shipping" },
                    { id: "delivered", label: "Delivered" },
                    { id: "rejected", label: "Rejected" },
                  ],
                },
              ]}
              formData={formData}
              setFormData={setFormData}
              buttonText={"Update Order Status"}
              onSubmit={handleUpdateStatus}
              isBtnDisabled={isBtnDisabled}
            />
          }
        </div>
      </div>
    </DialogContent>
  );
}

export default AdminOrderDetailsView;
