import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import type { Booking } from "@shared/schema"; // Assuming Booking type is available

interface VenueBookingsSectionProps {
  venueId: string;
}

export function VenueBookingsSection({ venueId }: VenueBookingsSectionProps) {
  const { user } = useAuth();
  const userId = user?.uid; // This is the partnerId

  const { data: bookings = [], isLoading } = useQuery<Booking[]>({
    queryKey: ["/api/dashboard/bookings", venueId],
    enabled: !!userId && !!venueId, // Only fetch if userId and venueId are available
  });

  if (!userId) {
    return (
      <div>
        <h2 className="text-3xl font-display font-bold mb-2">Venue Bookings</h2>
        <p className="text-muted-foreground mb-8">
          Please log in as a venue owner to view bookings.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div>
        <h2 className="text-3xl font-display font-bold mb-2">Venue Bookings</h2>
        <p className="text-muted-foreground mb-8">Loading venue bookings...</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-display font-bold mb-2">Venue Bookings</h2>
      <p className="text-muted-foreground mb-8">
        View all bookings for this venue.
      </p>

      {bookings.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Bookings for Venue</CardTitle>
            <CardDescription>A list of all bookings for this venue.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Field</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* @ts-ignore */}
                {bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    {/* @ts-ignore */}
                    <TableCell>{booking.user.displayName || booking.user.email}</TableCell>
                    {/* @ts-ignore */}
                    <TableCell>{booking.slot.field.name}</TableCell>
                    {/* @ts-ignore */}
                    <TableCell>{format(new Date(booking.slot.startTime), "PPP")}</TableCell>
                    {/* @ts-ignore */}
                    <TableCell>{format(new Date(booking.slot.startTime), "p")} - {format(new Date(booking.slot.endTime), "p")}</TableCell>
                    <TableCell>{booking.amountPkr} PKR</TableCell>
                    <TableCell>{booking.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <p className="text-muted-foreground">No bookings found for this venue.</p>
      )}
    </div>
  );
}