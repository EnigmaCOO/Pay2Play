import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ThemeToggle } from "@/components/theme-toggle";
import { MapPin, Shield, Calendar, ArrowLeft } from "lucide-react";
import type { Venue } from "@shared/schema";

export default function VenueDetail() {
  const params = useParams();
  const { data: venue, isLoading } = useQuery<Venue>({
    queryKey: ["/api/venues", params.id],
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/venues">
            <Button variant="ghost">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Venues
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-4 w-1/3" />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-16 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : venue ? (
          <div>
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-2">{venue.name}</h2>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{venue.city}</span>
                {venue.verified && (
                  <Badge
                    variant="outline"
                    className="border-green-500 text-green-600 bg-green-500/10"
                  >
                    <Shield className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-2">{venue.address}</p>
            </div>

            {/* Fields Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* @ts-ignore */}
              {venue.fields && venue.fields.length > 0 ? (
                // @ts-ignore
                venue.fields.map((field) => (
                  <Card key={field.id}>
                    <CardHeader>
                      <CardTitle>{field.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        Price: {field.pricePerHourPkr} PKR/hour
                      </p>
                      <Button asChild className="w-full mt-4">
                        <Link href={`/book/${field.id}`}>
                          <Calendar className="w-4 h-4 mr-2" />
                          Book Now
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p>No fields available for this venue.</p>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Venue not found.</p>
          </div>
        )}
      </main>
    </div>
  );
}
