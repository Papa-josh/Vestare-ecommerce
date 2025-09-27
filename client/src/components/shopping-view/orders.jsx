//client/src/components/shopping-view/orders.jsx

import React, { useState } from "react";
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

function ShoppingOrders() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
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
