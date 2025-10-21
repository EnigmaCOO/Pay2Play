import { Link } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { Calendar, Users, Trophy, Shield, Zap, DollarSign } from "lucide-react";
import heroImage from "@assets/generated_images/Multi-sport_hero_composite_image_262cba99.png";
import cricketImage from "@assets/generated_images/Cricket_action_shot_cdb23fb2.png";
import footballImage from "@assets/generated_images/Football_futsal_action_b2dab30e.png";
import padelImage from "@assets/generated_images/Padel_tennis_action_20f069be.png";

type Sport = "cricket" | "football" | "padel";

const sports = [
  { key: "cricket" as Sport, label: "Cricket", color: "cricket", image: cricketImage },
  { key: "football" as Sport, label: "Football", color: "football", image: footballImage },
  { key: "padel" as Sport, label: "Padel", color: "padel", image: padelImage },
];

export default function Landing() {
  const [selectedSport, setSelectedSport] = useState<Sport>("football");

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
        </div>

        {/* Navigation */}
        <nav className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 md:p-6">
          <div className="flex items-center gap-2">
            <div className="text-2xl font-display font-bold text-white tracking-tight">
              P<span className="text-primary">2</span>P
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="outline"
              asChild
              className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20"
              data-testid="button-dashboard"
            >
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 leading-tight">
            Find Your Game.<br />
            Book Your Slot.<br />
            <span className="text-primary">Play Today.</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
            Lahore's all-in-one platform for Cricket, Football, and Padel. Reserve fields, join pickup games, or compete in leagues.
          </p>
          <div className="flex flex-wrap gap-3 justify-center mb-8">
            <Button
              size="lg"
              variant="default"
              asChild
              className="text-lg px-8 font-semibold"
              data-testid="button-browse-games"
            >
              <Link href="/games">Browse Games</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="text-lg px-8 font-semibold bg-white/10 backdrop-blur-md border-white/30 text-white hover:bg-white/20"
              data-testid="button-book-field"
            >
              <Link href="/venues">Book a Field</Link>
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            <Badge variant="secondary" className="px-4 py-2 text-sm bg-white/10 backdrop-blur-sm text-white border-white/20">
              <Shield className="w-4 h-4 mr-2" />
              Verified Venues
            </Badge>
            <Badge variant="secondary" className="px-4 py-2 text-sm bg-white/10 backdrop-blur-sm text-white border-white/20">
              <Zap className="w-4 h-4 mr-2" />
              Instant Booking
            </Badge>
            <Badge variant="secondary" className="px-4 py-2 text-sm bg-white/10 backdrop-blur-sm text-white border-white/20">
              <DollarSign className="w-4 h-4 mr-2" />
              Secure Payments
            </Badge>
          </div>
        </div>
      </section>

      {/* Sports Selector Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-center mb-4">
            Choose Your Sport
          </h2>
          <p className="text-center text-muted-foreground mb-8 text-lg">
            Multi-sport platform built for athletes and enthusiasts
          </p>

          {/* Sport Tabs */}
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            {sports.map((sport) => (
              <button
                key={sport.key}
                onClick={() => setSelectedSport(sport.key)}
                data-testid={`button-sport-${sport.key}`}
                className={`px-6 py-3 rounded-full font-semibold text-lg transition-all ${
                  selectedSport === sport.key
                    ? `bg-${sport.color} text-white`
                    : "bg-muted text-muted-foreground hover-elevate"
                }`}
                style={
                  selectedSport === sport.key
                    ? {
                        backgroundColor:
                          sport.color === "cricket"
                            ? "hsl(32 95% 55%)"
                            : sport.color === "football"
                            ? "hsl(220 90% 56%)"
                            : "hsl(280 65% 60%)",
                      }
                    : undefined
                }
              >
                {sport.label}
              </button>
            ))}
          </div>

          {/* Sport-Specific Features */}
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <img
                src={sports.find((s) => s.key === selectedSport)?.image}
                alt={`${selectedSport} action`}
                className="rounded-2xl w-full h-auto shadow-2xl"
                data-testid={`img-sport-${selectedSport}`}
              />
            </div>
            <div className="space-y-4">
              <Card className="hover-elevate">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Discover Pickup Games
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    See who's playing {selectedSport} tonight. Join in seconds and pay to reserve your spot.
                  </p>
                </CardContent>
              </Card>
              <Card className="hover-elevate">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    Book the Whole Field
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Lock your preferred time at verified venues across Lahore with transparent pricing.
                  </p>
                </CardContent>
              </Card>
              <Card className="hover-elevate">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-primary" />
                    Leagues & Seasons
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Register teams, auto-generate fixtures, view live standings, and compete for glory.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Venues */}
      <section className="py-16 md:py-24 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-center mb-4">
            Featured Venues
          </h2>
          <p className="text-center text-muted-foreground mb-12 text-lg">
            Verified fields with transparent pricing and real-time availability
          </p>

          <div className="flex flex-wrap gap-3 justify-center">
            {[
              "DHA Sports Complex",
              "Model Town Ground",
              "Cantt Arena",
              "Gulberg Padel Club",
              "Futsal Range",
              "Defense Cricket Stadium",
            ].map((venue) => (
              <Badge
                key={venue}
                variant="outline"
                className="px-4 py-3 text-base font-medium"
                data-testid={`badge-venue-${venue.toLowerCase().replace(/ /g, "-")}`}
              >
                {venue}
              </Badge>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button variant="default" size="lg" asChild data-testid="button-view-all-venues">
              <Link href="/venues">View All Venues</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 px-4 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
            Ready to Play?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of players across Lahore. Book your next game in under 2 minutes.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              asChild
              className="text-lg px-8 font-semibold"
              data-testid="button-get-started"
            >
              <Link href="/games">Get Started</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="text-lg px-8 font-semibold border-white/30 text-white hover:bg-white/20"
              data-testid="button-partner-venue"
            >
              <Link href="/dashboard">Partner with Us</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} P2P — Pay 2 Play. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm">
            <a href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
              Privacy
            </a>
            <a href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
              Terms
            </a>
            <a href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
