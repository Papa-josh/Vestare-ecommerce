//client/src/components/shopping-view/orders.jsx

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import ShoppingOrderDetailsView from "./order-details";
import { Dialog } from "../ui/dialog";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersByUserId } from "@/store/shop/order-slice";

function ShoppingOrders() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const dispatch = useDispatch();
  const {user} = useSelector((state) => state.auth);
  const {orderList} = useSelector((state) => state.shopOrder);

  useEffect(() => {

      dispatch(getAllOrdersByUserId(user?.id));
    
  }, [dispatch]);

  console.log("order List", orderList);

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Order Status</TableHead>
                <TableHead>Order Price</TableHead>
                <TableHead>
                  <span className="sr-only">Details</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>123456</TableCell>
                <TableCell>02/06/2024</TableCell>
                <TableCell>In Process</TableCell>
                <TableCell>$1000</TableCell>
                <TableCell>
                  <Dialog
                    open={openDetailsDialog}
                    setOpenChange={setOpenDetailsDialog}
                  >
                    <Button onClick={() => setOpenDetailsDialog(true)}>
                      View Details
                    </Button>
                    <ShoppingOrderDetailsView />
                  </Dialog>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default ShoppingOrders;
