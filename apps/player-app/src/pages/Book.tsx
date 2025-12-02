import React, { useState, useEffect } from 'react';
import { useParams, Link, navigate } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { StripeCheckoutForm } from '@/components/StripeCheckoutForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import type { Slot } from '@shared/schema';
import { ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_YOUR_STRIPE_PUBLISHABLE_KEY');

export default function Book() {
  const params = useParams();
  const fieldId = params.fieldId;
  const { user } = useAuth();
  const { toast } = useToast();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);

  // Fetch slot details (assuming you have a way to select a slot, for now, we'll just use the fieldId)
  // In a real scenario, you'd select a specific slot from the venue-detail page
  const { data: slots, isLoading: isLoadingSlots } = useQuery<Slot[]>({
    queryKey: ["/api/slots/search", fieldId, new Date().toISOString(), new Date(Date.now() + 3600 * 1000).toISOString()],
    enabled: !!fieldId,
  });

  const selectedSlot = slots?.[0]; // For simplicity, just pick the first available slot

  useEffect(() => {
    const createBookingAndPaymentIntent = async () => {
      if (!user || !selectedSlot || !fieldId) return;

      try {
        // 1. Create a booking
        const bookingResponse = await fetch('/api/bookings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await user.getIdToken()}`,
          },
          body: JSON.stringify({
            userId: user.uid,
            slotId: selectedSlot.id,
            amountPkr: selectedSlot.pricePerHourPkr, // Assuming slot has price
          }),
        });
        const bookingData = await bookingResponse.json();
        if (!bookingResponse.ok) {
          throw new Error(bookingData.error || 'Failed to create booking');
        }
        setBookingId(bookingData.id);

        // 2. Create payment intent
        const paymentIntentResponse = await fetch('/api/payments/intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await user.getIdToken()}`,
          },
          body: JSON.stringify({
            bookingId: bookingData.id,
            userId: user.uid,
            amountPkr: selectedSlot.pricePerHourPkr,
            provider: 'stripe',
            idempotencyKey: bookingData.id, // Use booking ID as idempotency key
          }),
        });
        const paymentIntentData = await paymentIntentResponse.json();
        if (!paymentIntentResponse.ok) {
          throw new Error(paymentIntentData.error || 'Failed to create payment intent');
        }
        setClientSecret(paymentIntentData.providerRef); // providerRef holds client_secret
      } catch (error: any) {
        toast({
          title: "Booking failed.",
          description: error.message,
          variant: "destructive",
        });
        console.error("Booking/Payment Intent creation error:", error);
      }
    };

    createBookingAndPaymentIntent();
  }, [user, selectedSlot, fieldId, toast]);

  const handlePaymentSuccess = () => {
    toast({
      title: "Payment successful!",
      description: "Your booking has been confirmed.",
    });
    navigate(`/bookings/${bookingId}/confirm`); // Redirect to a confirmation page
  };

  const handlePaymentCancel = () => {
    toast({
      title: "Payment cancelled.",
      description: "You can try again or choose a different slot.",
    });
    navigate(`/venues/${selectedSlot?.fieldId}`); // Go back to venue detail
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Please log in to book a slot.</p>
      </div>
    );
  }

  if (isLoadingSlots || !selectedSlot) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Skeleton className="h-24 w-96" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto">
        <Button variant="ghost" onClick={() => navigate(`/venues/${selectedSlot.fieldId}`)} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Field
        </Button>
        <Card>
          <CardHeader>
            <CardTitle>Book Slot</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold mb-2">{selectedSlot.field.name} at {selectedSlot.field.venue.name}</p>
            <p className="text-muted-foreground mb-4">
              {format(new Date(selectedSlot.startTime), "PPP")} - {format(new Date(selectedSlot.startTime), "p")} to {format(new Date(selectedSlot.endTime), "p")}
            </p>
            <p className="text-xl font-bold mb-4">Amount: {selectedSlot.pricePerHourPkr} PKR</p>

            {clientSecret ? (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <StripeCheckoutForm onSuccess={handlePaymentSuccess} onCancel={handlePaymentCancel} />
              </Elements>
            ) : (
              <p>Loading payment form...</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}