import React, { useState } from "react";
import { product } from "@/app/libs/product";
import Link from "next/link";

const Checkout = () => {
  const [quantity, setQuantity] = useState(1);
  const [paymentUrl, setPaymentUrl] = useState("");

  const decreaseQuantity = () => {
    setQuantity((prevState) => (quantity > 1 ? prevState - 1 : null));
  };

  const increaseQuantity = () => {
    setQuantity((prevState) => prevState + 1);
  };

  const checkout = async () => {
    const data = {
      id: product.id,
      productName: product.name,
      price: product.price,
      quantity: quantity,
    };

    const req = await fetch(`/api/midtrans`, {
      method: "POST",
      body: JSON.stringify(data),
    });

    const res = await req.json();

    window.snap.pay(res.token);
  };

  const generatePaymentLink = async () => {
    const secret = process.env.NEXT_PUBLIC_MIDTRANS_SERVER_KEY;
    const encodeSecret = Buffer.from(secret).toString("base64");

    let data = {
      item_details: [
        {
          price: product.price,
          quantity: quantity,
          name: product.name,
        },
      ],
      transaction_details: {
        order_id: product.id,
        gross_amount: product.price * quantity,
      },
    };

    const req = await fetch(
      `${process.env.NEXT_PUBLIC_MIDTRANS_API}/v1/payment-links`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${encodeSecret}`,
        },
        body: JSON.stringify(data),
      }
    );

    const res = await req.json();

    if (req.ok) {
      setPaymentUrl(res.payment_url);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex sm:gap-4">
          <button
            className="transition-all hover:opacity-75"
            onClick={decreaseQuantity}
          >
            ➖
          </button>

          <input
            type="number"
            id="quantity"
            value={quantity}
            className="h-10 w-16 text-black border-transparent text-center"
            onChange={quantity}
          />

          <button
            className="transition-all hover:opacity-75"
            onClick={increaseQuantity}
          >
            ➕
          </button>
        </div>
        <button
          className="rounded bg-indigo-500 p-4 text-sm font-medium transition hover:scale-105"
          onClick={checkout}
        >
          Checkout
        </button>
      </div>
      <button
        className="text-indigo-500 py-4 text-sm font-medium transition hover:scale-105"
        onClick={generatePaymentLink}
      >
        Create Payment Link
      </button>

      {paymentUrl && (
        <div className="text-black text-sm italic">
          <Link href={paymentUrl} target="_blank">
            Klik disini untuk melakukan pembayaran!
          </Link>
        </div>
      )}
    </>
  );
};

export default Checkout;
