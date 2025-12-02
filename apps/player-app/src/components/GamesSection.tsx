import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import type { GameWithDetails } from "@shared/schema"; // Assuming GameWithDetails type is available

export function GamesSection() {
  const { user } = useAuth();
  const userId = user?.uid;

  const { data: games = [], isLoading } = useQuery<GameWithDetails[]>({
    queryKey: ["/api/games/search", userId],
    enabled: !!userId, // Only fetch if userId is available
  });

  if (!userId) {
    return (
      <div>
        <h2 className="text-3xl font-display font-bold mb-2">My Games</h2>
        <p className="text-muted-foreground mb-8">
          Please log in to view your games.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div>
        <h2 className="text-3xl font-display font-bold mb-2">My Games</h2>
        <p className="text-muted-foreground mb-8">Loading your games...</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-display font-bold mb-2">My Games</h2>
      <p className="text-muted-foreground mb-8">
        View your joined and hosted games.
      </p>

      {games.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Game History</CardTitle>
            <CardDescription>A list of all your games.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sport</TableHead>
                  <TableHead>Venue</TableHead>
                  <TableHead>Field</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Players</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {games.map((game) => (
                  <TableRow key={game.id}>
                    <TableCell>{game.sport.name}</TableCell>
                    <TableCell>{game.field.venue.name}</TableCell>
                    <TableCell>{game.field.name}</TableCell>
                    <TableCell>{format(new Date(game.startTime), "PPP")}</TableCell>
                    <TableCell>{format(new Date(game.startTime), "p")} - {format(new Date(game.endTime), "p")}</TableCell>
                    <TableCell>{game.status}</TableCell>
                    <TableCell>{game.currentPlayers}/{game.maxPlayers}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <p className="text-muted-foreground">No games found.</p>
      )}
    </div>
  );
}