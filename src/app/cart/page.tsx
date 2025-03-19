import React from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

const CartPage = () => {
  return (
    <div className="container mx-auto p-6 mt-24">
      <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
      
      <div className="bg-white p-4 shadow-md rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                <div className="w-16 h-16 relative">
                  <Image src="/p1.webp" alt="Plain White Shirt" fill style={{ objectFit: "cover" }} />
                </div>
              </TableCell>
              <TableCell>Plain White Shirt</TableCell>
              <TableCell>$59.00</TableCell>
              <TableCell>
                <input
                  type="number"
                  className="w-16 border p-1 rounded-md text-center"
                  defaultValue={1}
                  min={1}
                />
              </TableCell>
              <TableCell>$59.00</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      
      <div className="mt-6 flex justify-end">
        <Card className="w-full max-w-sm p-4 shadow-md">
          <CardContent>
            <h2 className="text-lg font-semibold mb-2">Cart Totals</h2>
            <div className="flex justify-between mb-1">
              <span>Subtotal:</span>
              <span>$59.00</span>
            </div>
            <div className="flex justify-between mb-1">
              <span>Shipping:</span>
              <span>FREE</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>$59.00</span>
            </div>
            <Button className="mt-4 w-full">Proceed to Checkout</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CartPage;
