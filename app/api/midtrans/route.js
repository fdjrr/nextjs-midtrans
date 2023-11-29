import Midtrans from "midtrans-client";
import { NextResponse } from "next/server";

let snap = new Midtrans.Snap({
  isProduction: false,
  serverKey: process.env.NEXT_PUBLIC_MIDTRANS_SERVER_KEY,
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
});

export async function POST(request) {
  const { id, productName, price, quantity } = await request.json();

  let parameter = {
    transaction_details: {
      order_id: id,
      gross_amount: price * quantity,
    },
    item_details: [
      {
        price: price,
        quantity: quantity,
        name: productName,
      },
    ],
  };

  const token = await snap.createTransactionToken(parameter);

  console.log(token);

  return NextResponse.json({ token });
}
