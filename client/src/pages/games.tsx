import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ThemeToggle } from "@/components/theme-toggle";
import { Users, Calendar, MapPin, DollarSign, Plus } from "lucide-react";
import type { GameWithDetails } from "@shared/schema";

export default function Games() {
  const [sportFilter, setSportFilter] = useState<string>("all");

  const { data: games, isLoading } = useQuery<GameWithDetails[]>({
    queryKey: ["/api/games/search", sportFilter],
  });

  const getStatusColor = (status: string, currentPlayers: number, maxPlayers: number) => {
    if (status === "cancelled") return "destructive";
    if (status === "filled" || currentPlayers >= maxPlayers) return "secondary";
    if (status === "confirmed") return "success";
    return "warning";
  };

  const getSpotsText = (current: number, max: number, min: number) => {
    const spotsLeft = max - current;
    const spotsNeeded = Math.max(0, min - current);
    if (spotsNeeded > 0) return `${spotsNeeded} spots needed to confirm`;
    if (spotsLeft > 0) return `${spotsLeft} spots left`;
    return "Full";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <h1 className="text-2xl font-display font-bold">
              P<span className="text-primary">2</span>P
            </h1>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button asChild data-testid="button-dashboard">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-2">Pickup Games</h2>
            <p className="text-muted-foreground">Join a game happening near you</p>
          </div>
          <Button asChild size="lg" data-testid="button-create-game">
            <Link href="/games/create">
              <Plus className="w-5 h-5 mr-2" />
              Host a Game
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          <Select value={sportFilter} onValueChange={setSportFilter}>
            <SelectTrigger className="w-48" data-testid="select-sport-filter">
              <SelectValue placeholder="All Sports" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sports</SelectItem>
              <SelectItem value="cricket">Cricket</SelectItem>
              <SelectItem value="football">Football</SelectItem>
              <SelectItem value="futsal">Futsal</SelectItem>
              <SelectItem value="padel">Padel</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Games Grid */}
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-24 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : games && games.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {games.map((game) => (
              <Card key={game.id} className="hover-elevate" data-testid={`card-game-${game.id}`}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <Badge
                      variant="outline"
                      className="capitalize"
                      style={{
                        borderColor:
                          game.sport === "cricket"
                            ? "hsl(32 95% 55%)"
                            : game.sport === "football" || game.sport === "futsal"
                            ? "hsl(220 90% 56%)"
                            : "hsl(280 65% 60%)",
                        color:
                          game.sport === "cricket"
                            ? "hsl(32 95% 55%)"
                            : game.sport === "football" || game.sport === "futsal"
                            ? "hsl(220 90% 56%)"
                            : "hsl(280 65% 60%)",
                      }}
                      data-testid={`badge-sport-${game.sport}`}
                    >
                      {game.sport}
                    </Badge>
                    <Badge
                      variant={getStatusColor(game.status, game.currentPlayers, game.maxPlayers) as any}
                      data-testid={`badge-status-${game.status}`}
                    >
                      {game.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{game.field.venue.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{game.field.name}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>{new Date(game.startTime).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{game.field.venue.city}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>
                      {game.currentPlayers}/{game.maxPlayers} players
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({getSpotsText(game.currentPlayers, game.maxPlayers, game.minPlayers)})
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <DollarSign className="w-4 h-4 text-primary" />
                    <span>PKR {game.pricePerPlayerPkr.toLocaleString()} / player</span>
                  </div>
                  <Button
                    asChild
                    className="w-full mt-4"
                    disabled={game.status === "cancelled" || game.currentPlayers >= game.maxPlayers}
                    data-testid={`button-join-game-${game.id}`}
                  >
                    <Link href={`/games/${game.id}`}>
                      {game.currentPlayers >= game.maxPlayers ? "Game Full" : "Join Game"}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No games found. Be the first to create one!</p>
            <Button asChild data-testid="button-create-first-game">
              <Link href="/games/create">
                <Plus className="w-5 h-5 mr-2" />
                Create Game
              </Link>
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
