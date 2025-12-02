import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { StripeCheckoutForm } from '@/components/StripeCheckoutForm';
import { apiRequest, queryClient } from '@/lib/queryClient';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_YOUR_STRIPE_PUBLISHABLE_KEY');

export function WalletSection() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [addFundsAmount, setAddFundsAmount] = useState<number | ''>('');
  const [withdrawFundsAmount, setWithdrawFundsAmount] = useState<number | ''>('');
  const [showAddFundsModal, setShowAddFundsModal] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const { data: wallet, isLoading: isLoadingWallet } = useQuery<{ balancePkr: number }>({
    queryKey: ["/api/wallet", user?.uid],
    enabled: !!user?.uid,
  });

  const addFundsMutation = useMutation({
    mutationFn: async (amount: number) => {
      if (!user) throw new Error("User not authenticated.");
      const idempotencyKey = `wallet-topup-${user.uid}-${Date.now()}`;
      
      const response = await apiRequest("POST", "/api/wallet/add-funds/intent", {
        userId: user.uid,
        amountPkr: amount,
        provider: "stripe",
        idempotencyKey,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to create wallet payment intent.");
      }
      setClientSecret(data.providerRef);
      setShowAddFundsModal(true);
      return data;
    },
    onSuccess: () => {
      // Payment intent created, now show modal
    },
    onError: (error: Error) => {
      toast({
        title: "Error adding funds.",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const withdrawFundsMutation = useMutation({
    mutationFn: async (amount: number) => {
      if (!user) throw new Error("User not authenticated.");
      
      const response = await apiRequest("POST", "/api/wallet/withdraw-funds", {
        amountPkr: amount,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to withdraw funds.");
      }
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Withdrawal successful!",
        description: "Your funds have been withdrawn.",
      });
      setWithdrawFundsAmount('');
      queryClient.invalidateQueries({ queryKey: ["/api/wallet", user?.uid] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error withdrawing funds.",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleAddFundsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof addFundsAmount === 'number' && addFundsAmount > 0) {
      addFundsMutation.mutate(addFundsAmount);
    } else {
      toast({
        title: "Invalid amount.",
        description: "Please enter a positive number.",
        variant: "destructive",
      });
    }
  };

  const handleWithdrawFundsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof withdrawFundsAmount === 'number' && withdrawFundsAmount > 0) {
      withdrawFundsMutation.mutate(withdrawFundsAmount);
    } else {
      toast({
        title: "Invalid amount.",
        description: "Please enter a positive number.",
        variant: "destructive",
      });
    }
  };

  const handlePaymentSuccess = () => {
    setShowAddFundsModal(false);
    setAddFundsAmount('');
    toast({
      title: "Funds added successfully!",
      description: "Your wallet balance has been updated.",
    });
    queryClient.invalidateQueries({ queryKey: ["/api/wallet", user?.uid] });
  };

  const handlePaymentCancel = () => {
    setShowAddFundsModal(false);
    toast({
      title: "Payment cancelled.",
      description: "No funds were added to your wallet.",
      variant: "destructive",
    });
  };

  if (isLoadingWallet) {
    return (
      <div>
        <h2 className="text-3xl font-display font-bold mb-2">My Wallet</h2>
        <p className="text-muted-foreground mb-8">Loading wallet details...</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-display font-bold mb-2">My Wallet</h2>
      <p className="text-muted-foreground mb-8">
        Manage your Pay2Play wallet balance.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Current Balance</CardTitle>
            <CardDescription>Your available funds for bookings and games.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">PKR {wallet?.balancePkr?.toLocaleString() || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Add Funds</CardTitle>
            <CardDescription>Top up your wallet using Stripe.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddFundsSubmit} className="space-y-4">
              <div>
                <Label htmlFor="add-amount">Amount (PKR)</Label>
                <Input
                  id="add-amount"
                  type="number"
                  value={addFundsAmount}
                  onChange={(e) => setAddFundsAmount(Number(e.target.value))}
                  min="1"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={addFundsMutation.isPending}>
                {addFundsMutation.isPending ? "Processing..." : "Add Funds"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Withdraw Funds</CardTitle>
            <CardDescription>Transfer funds from your wallet.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleWithdrawFundsSubmit} className="space-y-4">
              <div>
                <Label htmlFor="withdraw-amount">Amount (PKR)</Label>
                <Input
                  id="withdraw-amount"
                  type="number"
                  value={withdrawFundsAmount}
                  onChange={(e) => setWithdrawFundsAmount(Number(e.target.value))}
                  min="1"
                  required
                />
              </div>
              <Button type="submit" className="w-full" variant="outline" disabled={withdrawFundsMutation.isPending}>
                {withdrawFundsMutation.isPending ? "Processing..." : "Withdraw Funds"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showAddFundsModal} onOpenChange={setShowAddFundsModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Wallet Top-up</DialogTitle>
            <DialogDescription>
              Enter your payment details to add funds to your wallet.
            </DialogDescription>
          </DialogHeader>
          {clientSecret && stripePromise ? (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <StripeCheckoutForm onSuccess={handlePaymentSuccess} onCancel={handlePaymentCancel} />
            </Elements>
          ) : (
            <p>Loading payment form...</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}