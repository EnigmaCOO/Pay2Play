import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ThemeToggle } from "@/components/theme-toggle";
import { MapPin, Shield, Calendar } from "lucide-react";
import type { Venue } from "@shared/schema";

export default function Venues() {
  const { data: venues, isLoading } = useQuery<Venue[]>({
    queryKey: ["/api/venues"],
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
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-2">Venues</h2>
          <p className="text-muted-foreground">Book fields at verified venues across Lahore</p>
        </div>

        {/* Venues Grid */}
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
        ) : venues && venues.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {venues.map((venue) => (
              <Card key={venue.id} className="hover-elevate" data-testid={`card-venue-${venue.id}`}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <CardTitle className="text-lg">{venue.name}</CardTitle>
                    {venue.verified && (
                      <Badge variant="success" data-testid="badge-verified">
                        <Shield className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{venue.city}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {venue.description || "Premium sports facility with multiple fields and amenities."}
                  </p>
                  <p className="text-xs text-muted-foreground">{venue.address}</p>
                  <Button asChild className="w-full mt-4" data-testid={`button-view-venue-${venue.id}`}>
                    <Link href={`/venues/${venue.id}`}>
                      <Calendar className="w-4 h-4 mr-2" />
                      View Availability
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No venues found.</p>
          </div>
        )}
      </main>
    </div>
  );
}
