import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import type { Payout } from "@shared/schema"; // Assuming Payout type is available

interface VenuePayoutsSectionProps {
  venueId: string;
}

export function VenuePayoutsSection({ venueId }: VenuePayoutsSectionProps) {
  const { user } = useAuth();
  const userId = user?.uid; // This is the partnerId

  const { data: payouts = [], isLoading } = useQuery<Payout[]>({
    queryKey: ["/api/dashboard/payouts", venueId],
    enabled: !!userId && !!venueId, // Only fetch if userId and venueId are available
  });

  if (!userId) {
    return (
      <div>
        <h2 className="text-3xl font-display font-bold mb-2">Venue Payouts</h2>
        <p className="text-muted-foreground mb-8">
          Please log in as a venue owner to view payouts.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div>
        <h2 className="text-3xl font-display font-bold mb-2">Venue Payouts</h2>
        <p className="text-muted-foreground mb-8">Loading venue payouts...</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-display font-bold mb-2">Venue Payouts</h2>
      <p className="text-muted-foreground mb-8">
        View all payouts for this venue.
      </p>

      {payouts.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Payout History</CardTitle>
            <CardDescription>A list of all payouts for this venue.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payout Date</TableHead>
                  <TableHead>Created At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payouts.map((payout) => (
                  <TableRow key={payout.id}>
                    <TableCell>{payout.amountPkr} PKR</TableCell>
                    <TableCell>{payout.status}</TableCell>
                    <TableCell>{payout.payoutDate ? format(new Date(payout.payoutDate), "PPP") : "N/A"}</TableCell>
                    <TableCell>{format(new Date(payout.createdAt), "PPP")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <p className="text-muted-foreground">No payouts found for this venue.</p>
      )}
    </div>
  );
}