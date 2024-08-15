import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import axios from 'axios';

const PaymentForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
  
    const handleSubmit = async (event) => {
      event.preventDefault();
      setLoading(true);
  
      if (!stripe || !elements) {
        return;
      }
  
      const cardElement = elements.getElement(CardElement);
  
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });
  
      if (error) {
        console.error(error);
        setLoading(false);
      } else {
        const { id } = paymentMethod;
  
        try {
          const response = await axios.post('http://localhost:3001/create-payment-intent', {
            amount: 1000, // Example amount in cents
            payment_method: id,
          });
  
          const { clientSecret } = response.data;
  
          const confirmResult = await stripe.confirmCardPayment(clientSecret);
  
          if (confirmResult.error) {
            console.error(confirmResult.error);
          } else {
            console.log('Payment successful:', confirmResult.paymentIntent);
          }
        } catch (err) {
          console.error('Payment error:', err);
        }
  
        setLoading(false);
      }
    };
  
    return (
      <form onSubmit={handleSubmit}>
        <CardElement />
        <button type="submit" disabled={!stripe || loading}>
          {loading ? 'Processing...' : 'Pay'}
        </button>
      </form>
    );
  };
  
  export default PaymentForm;
  