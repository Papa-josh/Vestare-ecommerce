// client/src/pages/shopping-view/checkout.jsx

import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import img from "../../assets/account.jpg";
import Address from "@/components/shopping-view/address";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { data } from "autoprefixer";
import { createNewOrder } from "@/store/shop/order-slice";
import { useToast } from "@/hooks/use-toast";


function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const { approvalURL } = useSelector((state) => state.shopOrder);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isPaymentStart, setIsPaymentStart] = useState(false);
  const dispatch = useDispatch();
  const { toast } = useToast();

  console.log(currentSelectedAddress, "address");
  // console.log(cartItems, "cartItems");

  // console.log(cartItems.items, "cartItesssm");
  const totalCartAmount =
    cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

  function handleInitiatePaypalPayment() {
    if (cartItems.length === 0) {
      toast({
        title: "Your cart is empty. Please add items to proceed. ",
        variant: "destructive",
      });
      return;
    } 
  

    const orderData = {
      userId: user?.id,
      cartId: cartItems?._id,
      cartItems: cartItems.items.map((singleCartItem) => ({
        productId: singleCartItem?.productId,
        title: singleCartItem?.title,
        image: singleCartItem?.image,
        price:
          singleCartItem?.salePrice > 0
            ? singleCartItem?.salePrice
            : singleCartItem?.price,
        quantity: singleCartItem?.quantity,
      })),
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        pincode: currentSelectedAddress?.pincode,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes,
      },
      orderStatus: "pending",
      paymentMethod: "paypal",
      paymentStatus: "pending",
      totalAmount: totalCartAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: "",
      payerId: "",
    };

    console.log(orderData, "orderData");


    // here we are dispatching the createNewOrder action
    // and passing the orderData
    dispatch(createNewOrder(orderData)).then((data) => {
      console.log(data, "data");
      if (data?.payload?.success) {
        setIsPaymentStart(true);
      } else {
        setIsPaymentStart(false);
      }
    });
  }

  // here we are checking if the approvalURL is not null
  if (approvalURL) {
    window.location.href = approvalURL;
  }

  const formattedTotal = new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 0,
  }).format(totalCartAmount);

  return (
    <div className="flex flex-col">
      <div className="relative h-[300px] w-full overflow-hidden">
        <img src={img} className="h-full w-full object-cover object-center" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5 p-5">
        <Address setCurrentSelectedAddress={setCurrentSelectedAddress} />
        <div className="flex flex-col gap-4">
          {cartItems && cartItems.items && cartItems.items.length > 0
            ? cartItems.items.map((item, indx) => (
                <UserCartItemsContent key={indx} cartItem={item} />
              ))
            : null}
          <div className="mt-8 space-y-4">
            <div className="flex justify-between">
              <span className="font-bold">Total amount</span>
              <span className="font-bold">{formattedTotal}</span>
            </div>
          </div>
          <div className="mt-4 w-full">
            <Button onClick={handleInitiatePaypalPayment} className="w-full ">
              Checkout with Paypal
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ShoppingCheckout;
