import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import axios from 'axios';
import { Box, Button, CircularProgress, Typography, Paper } from '@mui/material';
import { styled } from '@mui/system';

// Custom styling for the CardElement
const StyledCardElement = styled(CardElement)({
  padding: '16px',
  border: '1px solid #ccc',
  borderRadius: '4px',
  marginBottom: '20px',
  backgroundColor: '#fafafa',
});

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
    <Paper elevation={3} sx={{ padding: 4, maxWidth: 400, margin: '0 auto' }}>
      <Typography variant="h6" gutterBottom>
        Enter your payment details
      </Typography>
      <form onSubmit={handleSubmit}>
        <StyledCardElement />
        <Box mt={2}>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={!stripe || loading}
            fullWidth
          >
            {loading ? <CircularProgress size={24} /> : 'Pay'}
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default PaymentForm;
