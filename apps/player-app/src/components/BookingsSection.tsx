import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import type { Booking } from "@shared/schema"; // Assuming Booking type is available
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

export function BookingsSection() {
  const { user } = useAuth();
  const userId = user?.uid;
  const { toast } = useToast();

  const { data: bookings = [], isLoading } = useQuery<Booking[]>({
    queryKey: ["/api/bookings", userId],
    enabled: !!userId, // Only fetch if userId is available
  });

  const cancelBookingMutation = useMutation({
    mutationFn: async (bookingId: string) => {
      if (!user) {
        throw new Error("User not authenticated.");
      }
      const response = await apiRequest("POST", `/api/bookings/${bookingId}/cancel`, {}, user.uid);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to cancel booking.");
      }
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Booking cancelled!",
        description: "Your booking has been successfully cancelled and a refund initiated.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/bookings", userId] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error cancelling booking.",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (!userId) {
    return (
      <div>
        <h2 className="text-3xl font-display font-bold mb-2">My Bookings</h2>
        <p className="text-muted-foreground mb-8">
          Please log in to view your booking history.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div>
        <h2 className="text-3xl font-display font-bold mb-2">My Bookings</h2>
        <p className="text-muted-foreground mb-8">Loading your bookings...</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-display font-bold mb-2">My Bookings</h2>
      <p className="text-muted-foreground mb-8">
        View your past and upcoming pitch bookings.
      </p>

      {bookings.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Booking History</CardTitle>
            <CardDescription>A list of all your bookings.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Venue</TableHead>
                  <TableHead>Field</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* @ts-ignore */}
                {bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    {/* @ts-ignore */}
                    <TableCell>{booking.slot.field.venue.name}</TableCell>
                    {/* @ts-ignore */}
                    <TableCell>{booking.slot.field.name}</TableCell>
                    {/* @ts-ignore */}
                    <TableCell>{format(new Date(booking.slot.startTime), "PPP")}</TableCell>
                    {/* @ts-ignore */}
                    <TableCell>{format(new Date(booking.slot.startTime), "p")} - {format(new Date(booking.slot.endTime), "p")}</TableCell>
                    <TableCell>{booking.amountPkr} PKR</TableCell>
                    <TableCell>{booking.status}</TableCell>
                    <TableCell>
                      {booking.status !== "cancelled" && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">Cancel</Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will cancel your booking and initiate a refund.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>No, keep booking</AlertDialogCancel>
                              <AlertDialogAction onClick={() => cancelBookingMutation.mutate(booking.id)}>Yes, cancel booking</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <p className="text-muted-foreground">No bookings found.</p>
      )}
    </div>
  );
}