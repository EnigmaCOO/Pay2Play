import React, { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface StripeCheckoutFormProps {
  clientSecret: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export const StripeCheckoutForm: React.FC<StripeCheckoutFormProps> = ({ clientSecret, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: window.location.origin + '/payment-success', // This URL should handle success/failure
      },
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`.
    if (error.type === "card_error" || error.type === "validation_error") {
      toast({
        title: "Payment failed.",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "An unexpected error occurred.",
        description: error.message,
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" />
      <Button disabled={isLoading || !stripe || !elements} id="submit" className="w-full mt-4">
        <span id="button-text">
          {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
        </span>
      </Button>
      <Button variant="outline" onClick={onCancel} className="w-full mt-2">
        Cancel
      </Button>
    </form>
  );
};
