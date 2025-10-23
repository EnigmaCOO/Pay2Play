
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Clock, Users, Share, Navigation, ArrowLeft, MoreVertical } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function GameDetail() {
  const [, params] = useRoute("/games/:id");
  const { toast } = useToast();

  const { data: game, isLoading } = useQuery({
    queryKey: [`/api/games/${params?.id}`],
    enabled: !!params?.id,
  });

  const joinMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/game-pay/${params?.id}/intent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("idToken")}`,
        },
        body: JSON.stringify({ provider: "mock" }),
      });
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Successfully joined game!" });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!game) return <div>Game not found</div>;

  const progress = (game.currentPlayers / game.minPlayers) * 100;
  const spotsLeft = game.maxPlayers - game.currentPlayers;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="icon" onClick={() => window.history.back()}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <span className="font-semibold">Details</span>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon">
              <Navigation className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <MapPin className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Share className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Hero Image */}
      <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 relative">
        {game.distance && (
          <Badge className="absolute top-4 right-4 bg-background/90">
            <MapPin className="w-3 h-3 mr-1" />
            {game.distance} mi away
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 pb-24">
        {/* Venue Info */}
        <div className="flex items-start justify-between py-4 border-b">
          <div className="flex gap-3">
            <Avatar className="w-12 h-12">
              <AvatarFallback>{game.venueName[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-bold text-lg">{game.venueName}</h2>
              <p className="text-sm text-muted-foreground">@{game.fieldName}</p>
            </div>
          </div>
          <span className="text-sm font-semibold text-green-600">
            {spotsLeft} spots left
          </span>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="status" className="mt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="status">STATUS</TabsTrigger>
            <TabsTrigger value="about">ABOUT</TabsTrigger>
            <TabsTrigger value="map">MAP</TabsTrigger>
          </TabsList>

          <TabsContent value="status" className="space-y-6">
            {/* Time */}
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                {new Date(game.start).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "short",
                  day: "numeric"
                })}
              </p>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <span className="font-semibold">
                  {new Date(game.start).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit"
                  })} - {new Date(game.end).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit"
                  })}
                </span>
              </div>
            </div>

            {/* Game Details Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="relative w-24 h-24">
                    <svg className="w-24 h-24 -rotate-90">
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-muted"
                      />
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 40}`}
                        strokeDashoffset={`${2 * Math.PI * 40 * (1 - progress / 100)}`}
                        className="text-primary transition-all"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold">{game.currentPlayers}/{game.minPlayers}</span>
                      <span className="text-xs text-muted-foreground">spots filled</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      {game.currentPlayers} Players ({game.minPlayers}v{game.minPlayers})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {game.skillLevel || "Friendly"}
                    </Badge>
                    <span className="text-sm">{game.sport}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{game.venueName}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-6">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">PROGRESS</span>
                    <span className="font-semibold">{game.currentPlayers} players</span>
                  </div>
                  <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 bg-primary transition-all"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs mt-1">
                    <span className="text-muted-foreground">Scheduled</span>
                    <span className="font-semibold text-green-600">
                      {game.status === "confirmed" ? "Confirmed" : "Pending"}
                    </span>
                    <span className="text-muted-foreground">Game Full</span>
                  </div>
                </div>

                {game.status !== "confirmed" && (
                  <p className="text-sm text-center mt-4 text-muted-foreground">
                    We'll let you know by{" "}
                    <span className="font-semibold">
                      {new Date(new Date(game.start).getTime() - 30 * 60000).toLocaleTimeString(
                        "en-US",
                        { hour: "numeric", minute: "2-digit" }
                      )}
                    </span>{" "}
                    if the game is confirmed.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Roster */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">GAME ROSTER</h3>
                <Button variant="ghost" size="sm" className="text-primary">
                  + Invite Friends
                </Button>
              </div>

              <Card>
                <CardContent className="p-4 space-y-3">
                  {game.players?.map((player: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>{player.name?.[0] || "?"}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-sm">{player.name || "Anonymous"}</p>
                          <p className="text-xs text-muted-foreground">
                            {player.skillLevel || "Intermediate"}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  )) || (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No players yet. Be the first to join!
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="about">
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground">
                  Join us for a {game.sport} game at {game.venueName}. Perfect for players of all
                  levels looking for a fun, competitive match!
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="map">
            <Card>
              <CardContent className="p-6">
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <MapPin className="w-12 h-12 text-muted-foreground" />
                </div>
                <div className="mt-4">
                  <p className="font-semibold">{game.venueName}</p>
                  <p className="text-sm text-muted-foreground">{game.fieldName}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Price</p>
            <p className="text-2xl font-bold">Rs. {game.pricePkr}</p>
          </div>
          <Button
            size="lg"
            className="px-8"
            onClick={() => joinMutation.mutate()}
            disabled={joinMutation.isPending || game.status === "filled"}
          >
            {joinMutation.isPending ? "Joining..." : "Join Game"}
          </Button>
        </div>
      </div>
    </div>
  );
}
