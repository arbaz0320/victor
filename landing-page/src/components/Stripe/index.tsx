import Image from "next/image";
import { useEffect, useState } from "react";
import { Stripe } from 'stripe';
import {useStripe, useElements, PaymentElement} from '@stripe/react-stripe-js';

type PaymentProps = {
    email: string;
    total: number;
    installment: number;
};

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();


  const handleSubmit = async (event : any) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();
    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }
    
    const result = await stripe.confirmPayment({
      //`Elements` instance that was used to create the Payment Element
      elements,
      confirmParams: {
        return_url: "http://localhost:3000/checkout/success",
      },
    });

    if (result.error) {
      // Show error to your customer (for example, payment details incomplete)
      console.log(result.error.message);
    } else {
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button className="w-full bg-[#001a4e] border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500 disabled:opacity-75 disabled:hover:bg-[#001a4e] relative btn-block mt-2" disabled={!stripe}>Confira</button>
    </form>
  )
};

export default CheckoutForm;