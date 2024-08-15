import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from '../PaymentForm/PaymentForm';
import { Paper, Box } from '@mui/material';

const stripePromise = loadStripe('your-publishable-key-here');

const Checkout = () => {
  return (
    <Paper elevation={3}>
      <Box p={3}>
        <Elements stripe={stripePromise}>
          <PaymentForm />
        </Elements>
      </Box>
    </Paper>
  );
};

export default Checkout;

