import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link, useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/theme-toggle";
import { Calendar, MapPin, Users, DollarSign, Clock } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { GameWithDetails, GamePayment } from "@shared/schema";

export default function GameDetail() {
  const params = useParams();
  const gameId = params.id;
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isJoining, setIsJoining] = useState(false);

  const { data: game, isLoading } = useQuery<GameWithDetails>({
    queryKey: ["/api/games", gameId],
    enabled: !!gameId,
  });

  const joinMutation = useMutation({
    mutationFn: async () => {
      const userId = "e58ca82c-13b7-4731-8616-9aeb56a0ede5"; // Seeded test user
      const idempotencyKey = `game-join-${gameId}-${userId}-${Date.now()}`;
      
      const paymentResponse = await apiRequest("POST", `/api/game-pay/${gameId}/intent`, {
        userId,
        provider: "mock",
        idempotencyKey,
      });

      const payment = (await paymentResponse.json()) as GamePayment;

      // Simulate webhook callback for mock provider - server will handle HMAC
      const webhookPayload = {
        paymentId: payment.id,
        status: "succeeded",
        providerRef: `mock_ref_${Date.now()}`,
      };
      
      await apiRequest("POST", `/api/game-pay/webhook/mock`, webhookPayload);
      
      return payment;
    },
    onSuccess: () => {
      toast({
        title: "Joined Successfully!",
        description: "You've joined the game. Payment confirmed.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/games", gameId] });
      queryClient.invalidateQueries({ queryKey: ["/api/games/search"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to join game",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsJoining(false);
    },
  });

  const handleJoin = () => {
    setIsJoining(true);
    joinMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b p-4">
          <Skeleton className="h-8 w-32" />
        </header>
        <main className="max-w-4xl mx-auto px-4 py-8">
          <Skeleton className="h-64 w-full" />
        </main>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Game not found</p>
          <Button asChild>
            <Link href="/games">Back to Games</Link>
          </Button>
        </div>
      </div>
    );
  }

  const spotsLeft = game.maxPlayers - game.currentPlayers;
  const spotsNeeded = Math.max(0, game.minPlayers - game.currentPlayers);
  const isFull = game.currentPlayers >= game.maxPlayers;
  const isCancelled = game.status === "cancelled";

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <h1 className="text-2xl font-display font-bold">
              P<span className="text-primary">2</span>P
            </h1>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button asChild variant="ghost" data-testid="button-back">
              <Link href="/games">Back to Games</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <Badge
                      variant="outline"
                      className="capitalize mb-2"
                      style={{
                        borderColor: game.sport === "cricket" ? "hsl(32 95% 55%)" :
                                     game.sport === "football" || game.sport === "futsal" ? "hsl(220 90% 56%)" :
                                     "hsl(280 65% 60%)",
                        color: game.sport === "cricket" ? "hsl(32 95% 55%)" :
                               game.sport === "football" || game.sport === "futsal" ? "hsl(220 90% 56%)" :
                               "hsl(280 65% 60%)",
                      }}
                    >
                      {game.sport}
                    </Badge>
                    <CardTitle className="text-2xl">{game.field.venue.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{game.field.name}</p>
                  </div>
                  <Badge
                    variant={isCancelled ? "destructive" : game.status === "confirmed" ? "default" : "secondary"}
                    data-testid="badge-game-status"
                  >
                    {game.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{new Date(game.startTime).toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(game.startTime).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })} - {new Date(game.endTime).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{game.field.venue.city}</p>
                      <p className="text-sm text-muted-foreground">{game.field.venue.address}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">
                        {game.currentPlayers}/{game.maxPlayers} players
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {spotsNeeded > 0
                          ? `${spotsNeeded} more needed to confirm`
                          : spotsLeft > 0
                          ? `${spotsLeft} spots available`
                          : "Game is full"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium text-xl">PKR {game.pricePerPlayerPkr.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">per player</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Players ({game.currentPlayers})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {game.players?.map((player, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {player.user.displayName?.[0] || player.user.email?.[0] || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium">
                          {player.user.displayName || player.user.email || "Anonymous"}
                        </p>
                        {player.isHost && (
                          <Badge variant="outline" className="text-xs">Host</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="sticky top-24">
              <CardContent className="pt-6">
                <Button
                  className="w-full mb-4"
                  size="lg"
                  disabled={isFull || isCancelled || isJoining}
                  onClick={handleJoin}
                  data-testid="button-join-game"
                >
                  {isJoining ? "Joining..." : isFull ? "Game Full" : isCancelled ? "Cancelled" : `Join - PKR ${game.pricePerPlayerPkr}`}
                </Button>
                {spotsNeeded > 0 && (
                  <p className="text-xs text-center text-muted-foreground">
                    Game will auto-cancel if not confirmed 30 mins before start
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
