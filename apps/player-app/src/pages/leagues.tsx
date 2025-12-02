import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ThemeToggle } from "@/components/theme-toggle";
import { Trophy, Calendar, Users, Plus } from "lucide-react";
import type { Season } from "@shared/schema";

export default function Leagues() {
  const { data: seasons, isLoading } = useQuery<Season[]>({
    queryKey: ["/api/leagues/season"],
  });

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
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-2">Leagues & Seasons</h2>
            <p className="text-muted-foreground">Organize tournaments and track standings</p>
          </div>
          <Button asChild size="lg" data-testid="button-create-season">
            <Link href="/leagues/create">
              <Plus className="w-5 h-5 mr-2" />
              Create Season
            </Link>
          </Button>
        </div>

        {/* Seasons Grid */}
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
        ) : seasons && seasons.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {seasons.map((season) => (
              <Card key={season.id} className="hover-elevate" data-testid={`card-season-${season.id}`}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <Badge
                      variant="outline"
                      className="capitalize"
                      style={{
                        borderColor:
                          season.sport === "cricket"
                            ? "hsl(32 95% 55%)"
                            : season.sport === "football" || season.sport === "futsal"
                            ? "hsl(220 90% 56%)"
                            : "hsl(280 65% 60%)",
                        color:
                          season.sport === "cricket"
                            ? "hsl(32 95% 55%)"
                            : season.sport === "football" || season.sport === "futsal"
                            ? "hsl(220 90% 56%)"
                            : "hsl(280 65% 60%)",
                      }}
                      data-testid={`badge-sport-${season.sport}`}
                    >
                      {season.sport}
                    </Badge>
                    <Trophy className="w-5 h-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{season.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>
                      {new Date(season.startDate).toLocaleDateString()} -{" "}
                      {new Date(season.endDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button asChild className="flex-1" size="sm" data-testid={`button-standings-${season.id}`}>
                      <Link href={`/leagues/${season.id}/standings`}>Standings</Link>
                    </Button>
                    <Button asChild variant="outline" className="flex-1" size="sm" data-testid={`button-fixtures-${season.id}`}>
                      <Link href={`/leagues/${season.id}/fixtures`}>Fixtures</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">No leagues found. Create your first season!</p>
            <Button asChild data-testid="button-create-first-season">
              <Link href="/leagues/create">
                <Plus className="w-5 h-5 mr-2" />
                Create Season
              </Link>
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
