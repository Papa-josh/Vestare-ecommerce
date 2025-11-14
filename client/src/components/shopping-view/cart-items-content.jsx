// client/src/components/shopping-view/cart-items-content.jsx

import React from "react";
import { Button } from "../ui/button";
import { Minus, Plus, Trash } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartItem, updateCartQuantity } from "@/store/shop/cart-slice";
import { useToast } from "@/hooks/use-toast";

function UserCartItemsContent({ cartItem }) {
  const { user } = useSelector((state) => state.auth);
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  const { cartItems } = useSelector((state) => state.shopCart); 
  const dispatch = useDispatch();
  const { toast } = useToast();
    

  //logic for Minus and Plus
  function handleUpdateQuantity(getCartItem, typeOfAction) {  
    if(typeOfAction == "plus"){
        let getCartItems = cartItems.items || [];

        if (getCartItems.length) {
          const indexOfCurrentCartItem = getCartItems.findIndex(
            (item) => item.productId === getCartItem?.productId
          );

          const getCurrentProductIndex = productList.findIndex(
            (product) => product._id === getCartItem?.productId
          )
          const getTotalStock  = productList[getCurrentProductIndex]?.totalStock;
          console.log(getCurrentProductIndex, getTotalStock, "getTotalStock, getCurrentProductIndex");
          if (indexOfCurrentCartItem > -1) {
            const getQuantity = getCartItems[indexOfCurrentCartItem]?.quantity;
            if (getQuantity + 1 > getTotalStock) {
              toast({
                title: `Only ${getQuantity} quantity can be added for this item`,
                variant: "destructive",
              });
              return;
            }
          }
        }
    }
    dispatch(
      updateCartQuantity({
        userId: user?.id,
        productId: getCartItem?.productId,
        quantity:
          typeOfAction === "plus"
            ? getCartItem?.quantity + 1
            : getCartItem?.quantity - 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        // here we are showing the toast
        toast({
          title: typeOfAction === "plus" ? "Added" : "Removed",

          description:
            // Know if the type of action is plus or minus
            `${getCartItem?.name || "Item"} ${
              typeOfAction === "plus" ? "increased" : "decreased"
            }.`,
          duration: 1500,
          className: "font-semibold",
        });
      }
    });
  }

  //logic for delete icon
  function handleCartItemDelete(getCartItem) {
    const isConfirmed = window.confirm(
      "Are you sure you want to remove this item from your cart?"
    );
    if (isConfirmed) {
      dispatch(
        deleteCartItem({ userId: user?.id, productId: getCartItem?.productId })
      ).then((data) => {
        if (data?.payload?.success) {
          toast({
            title: "Item removed from your cart!",
          });
        }
      });
    }
  }
  return (
    <div className="flex items-center space-x-4">
      <img
        src={cartItem?.image}
        alt={cartItem?.title}
        className="w-20 h-20 rounded object-cover"
      />

      {/* product details */}
      <div className="flex-1">
        <h3 className="font-extrabold">{cartItem?.title}</h3>
        <div className="flex items-center gap-2 mt-1">
          <Button
            variant="outline"
            className="w-8 h-8 rounded-full"
            size="icon"
            disabled={cartItem?.quantity === 1}
            onClick={() => handleUpdateQuantity(cartItem, "minus")}
          >
            <Minus className="w-4 h-4" />
            <span className="sr-only">Decrease</span>
          </Button>
          <span className="font-semibold">{cartItem?.quantity}</span>
          <Button
            variant="outline"
            className="w-8 h-8 rounded-full"
            size="icon"
            onClick={() => handleUpdateQuantity(cartItem, "plus")}
          >
            <Plus className="w-4 h-4" />
            <span className="sr-only">Decrease</span>
          </Button>
        </div>
      </div>

      {/* price */}
      <div className="flex flex-col items-end">
        <p className="font-semibold">
          $
          {(
            (cartItem?.salePrice > 0 ? cartItem?.salePrice : cartItem?.price) *
            cartItem?.quantity
          ).toFixed(2)}
        </p>

        {/* delete icon */}
        <Trash
          onClick={() => handleCartItemDelete(cartItem)}
          className="cursor-pointer mt-1"
          size={20}
        />
      </div>
    </div>
  );
}

export default UserCartItemsContent;
