import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const BillingPage = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 mt-24">
      <h2 className="text-2xl font-bold mb-4">Billing Details</h2>
      <div className="grid grid-cols-1 gap-4 mb-6">
        <div>
          <Label htmlFor="full-name">Full Name</Label>
          <Input id="full-name" placeholder="Enter your full name" />
        </div>
        <div>
          <Label htmlFor="street-address">Street Address</Label>
          <Input id="street-address" placeholder="House number and street name" />
        </div>
        <div>
          <Label htmlFor="city">Town / City</Label>
          <Input id="city" placeholder="Enter your city" />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" placeholder="Enter your phone number" />
        </div>
        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" type="email" placeholder="Enter your email" />
        </div>
      </div>
      
      <h2 className="text-2xl font-bold mb-4">Your Order</h2>
      <Card className="mb-6">
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Plain White Shirt</TableCell>
                <TableCell className="text-right">$59.00</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-bold">Subtotal</TableCell>
                <TableCell className="text-right">$59.00</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-bold">Total</TableCell>
                <TableCell className="text-right font-bold">$59.00</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <div className="p-4 border rounded-md mb-4">
        <p>Cash on delivery. Please contact us if you require assistance or wish to make alternate arrangements.</p>
      </div>
      
      <Button className="w-full">Place Order</Button>
    </div>
  );
};

export default BillingPage;
