import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Users, Trophy, MapPin, Shield, Zap } from "lucide-react";
import logoImage from "@assets/image_1761127248488.png";

export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logoImage} alt="Pay 2 Play" className="h-12 w-auto" />
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#facilities" className="text-foreground/80 hover:text-foreground transition-colors">
              Facilities
            </a>
            <a href="#how-it-works" className="text-foreground/80 hover:text-foreground transition-colors">
              How It Works
            </a>
            <a href="#contact" className="text-foreground/80 hover:text-foreground transition-colors">
              Contact
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="text-foreground">
              Log In
            </Button>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              Sign Up
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 leading-tight">
            FIND AND BOOK<br />
            SPORTS FACILITIES
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto">
            Search for facilities nearby, see everything they have to offer, and book your next game.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button 
              size="lg" 
              className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-10 h-14 font-semibold"
              data-testid="button-signup"
            >
              SIGN UP WITH EMAIL
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 text-lg px-10 h-14 font-semibold"
              data-testid="button-login"
            >
              LOG IN
            </Button>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border">
            <MapPin className="w-4 h-4 text-primary" />
            <select className="bg-transparent border-none outline-none text-foreground cursor-pointer">
              <option>Lahore</option>
              <option>Karachi</option>
              <option>Islamabad</option>
            </select>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 bg-card/30">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-primary mb-2">500+</div>
            <div className="text-muted-foreground">Active Players</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary mb-2">50+</div>
            <div className="text-muted-foreground">Verified Facilities</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary mb-2">3</div>
            <div className="text-muted-foreground">Sports Available</div>
          </div>
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
              From signup to game time in 3 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-card border-2 border-border hover-elevate">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <div className="text-6xl font-bold text-primary/20 mb-4">01</div>
                <h3 className="text-2xl font-bold mb-3">Find Your Facility</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Browse cricket, football, and padel facilities across Lahore with real-time availability.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-2 border-border hover-elevate">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
                  <Calendar className="w-8 h-8 text-primary" />
                </div>
                <div className="text-6xl font-bold text-primary/20 mb-4">02</div>
                <h3 className="text-2xl font-bold mb-3">Book Your Slot</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Select your preferred time, confirm instantly, and pay securely through our platform.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-2 border-border hover-elevate">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
                  <Trophy className="w-8 h-8 text-primary" />
                </div>
                <div className="text-6xl font-bold text-primary/20 mb-4">03</div>
                <h3 className="text-2xl font-bold mb-3">Play Your Game</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Show up at the facility and enjoy your game. Join pickup games or organize leagues.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="facilities" className="py-24 px-6 bg-card/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Why Pay 2 Play?
            </h2>
            <p className="text-xl text-muted-foreground">
              Everything you need in one platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-card border border-border">
              <CardContent className="p-6">
                <Shield className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">Verified Facilities</h3>
                <p className="text-muted-foreground">
                  All venues are verified with transparent pricing and quality standards.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border border-border">
              <CardContent className="p-6">
                <Zap className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">Instant Booking</h3>
                <p className="text-muted-foreground">
                  Real-time availability and instant confirmations. No waiting, no hassle.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border border-border">
              <CardContent className="p-6">
                <Users className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">Pickup Games</h3>
                <p className="text-muted-foreground">
                  Join games with other players. Pay per spot and make new connections.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border border-border">
              <CardContent className="p-6">
                <Trophy className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">Leagues & Tournaments</h3>
                <p className="text-muted-foreground">
                  Register teams, compete in organized leagues with fixtures and standings.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border border-border">
              <CardContent className="p-6">
                <Calendar className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">Multi-Sport</h3>
                <p className="text-muted-foreground">
                  Cricket, Football, and Padel all in one place. More sports coming soon.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border border-border">
              <CardContent className="p-6">
                <MapPin className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">Across Lahore</h3>
                <p className="text-muted-foreground">
                  Facilities in DHA, Gulberg, Model Town, Cantt, and more locations.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Ready to Play?
          </h2>
          <p className="text-xl mb-10 opacity-90">
            Join hundreds of players across Lahore. Book your next game in under 2 minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="bg-background text-foreground hover:bg-background/90 text-lg px-10 h-14 font-semibold"
              data-testid="button-get-started"
            >
              GET STARTED
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 text-lg px-10 h-14 font-semibold"
              data-testid="button-venue-dashboard"
            >
              VENUE DASHBOARD
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="py-12 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
            <div className="text-center md:text-left">
              <img src={logoImage} alt="Pay 2 Play" className="h-16 w-auto mb-3 mx-auto md:mx-0" />
              <p className="text-sm text-muted-foreground">
                Lahore's Premier Sports Booking Platform
              </p>
            </div>
            <div className="flex gap-8 text-sm">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Contact Us
              </a>
            </div>
          </div>
          <div className="text-center text-sm text-muted-foreground border-t border-border pt-8">
            © {new Date().getFullYear()} Pay 2 Play. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
