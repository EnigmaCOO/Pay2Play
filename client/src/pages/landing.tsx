import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { Calendar, Users, Trophy, ChevronDown } from "lucide-react";
import heroImage from "@assets/generated_images/Multi-sport_hero_composite_image_262cba99.png";

export default function Landing() {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col">
        {/* Navigation */}
        <nav className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-6">
          <div className="text-3xl font-display font-bold text-white">
            P<span className="text-primary">2</span>P
          </div>
          <ThemeToggle />
        </nav>

        {/* Hero Content */}
        <div className="flex-1 relative flex items-center justify-center">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroImage})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 leading-tight">
              Play Sports Anywhere,<br />Anytime
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto">
              Find games near you, book fields, and connect with players across Lahore.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="text-lg px-10 h-14 font-semibold"
                data-testid="button-download-app"
              >
                Download App
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-10 h-14 font-semibold bg-white/10 backdrop-blur-md border-white/30 text-white hover:bg-white/20"
                onClick={() => scrollToSection("how-it-works")}
                data-testid="button-learn-more"
              >
                Learn More
              </Button>
            </div>
            <p className="text-white/70 mt-8 text-sm">
              Join 500+ players across Cricket, Football, and Padel
            </p>
          </div>

          {/* Scroll Indicator */}
          <button
            onClick={() => scrollToSection("how-it-works")}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-white/60 hover:text-white/90 transition-colors animate-bounce"
            aria-label="Scroll down"
          >
            <ChevronDown className="w-8 h-8" />
          </button>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground">
              From download to kickoff in 3 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 hover-elevate">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <Calendar className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Find Your Game</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Explore games at top facilities with convenient times and skill levels that fit your schedule.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover-elevate">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Reserve Your Spot</h3>
                <p className="text-muted-foreground leading-relaxed">
                  View game details, secure your spot with instant booking, and connect with other players.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover-elevate">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <Trophy className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Show Up & Play</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Check in at the venue, play the beautiful game, and make connections with fellow athletes.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-muted-foreground">
              One platform for all your sporting needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold mb-2">For Players</h3>
                <p className="text-muted-foreground text-lg">
                  Discover pickup games, book fields, join leagues, and connect with your sports community.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">For Venues</h3>
                <p className="text-muted-foreground text-lg">
                  Fill your facilities with motivated players. Manage bookings and grow your business.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Multi-Sport</h3>
                <p className="text-muted-foreground text-lg">
                  Cricket, Football, and Padel all in one place. More sports coming soon.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <h4 className="font-semibold text-lg mb-2">Verified Venues</h4>
                  <p className="text-muted-foreground">
                    All facilities are verified with transparent pricing and quality standards.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h4 className="font-semibold text-lg mb-2">Instant Booking</h4>
                  <p className="text-muted-foreground">
                    Real-time availability and instant confirmations. No waiting, no hassle.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h4 className="font-semibold text-lg mb-2">Secure Payments</h4>
                  <p className="text-muted-foreground">
                    Safe, secure transactions with automatic refunds for cancelled games.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Ready to Play?
          </h2>
          <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto">
            Join hundreds of players across Lahore. Book your next game in under 2 minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="text-lg px-10 h-14 font-semibold"
              data-testid="button-get-started"
            >
              Get Started
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-10 h-14 font-semibold border-white/30 text-white hover:bg-white/20"
              data-testid="button-partner-venue"
            >
              Partner with Us
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <div className="text-2xl font-display font-bold mb-2">
                P<span className="text-primary">2</span>P
              </div>
              <p className="text-sm text-muted-foreground">
                Pay 2 Play — Lahore's Sports Platform
              </p>
            </div>
            <div className="flex gap-8 text-sm">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Privacy
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Terms
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </a>
            </div>
          </div>
          <div className="text-center text-sm text-muted-foreground mt-8">
            © {new Date().getFullYear()} P2P. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
