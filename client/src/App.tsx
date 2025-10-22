import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Users, Trophy, MapPin, Shield, Zap } from "lucide-react";
import { FaFacebook, FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa";
import logoImage from "@assets/image_1761127248488.png";
import footballImage from "@assets/generated_images/Football_futsal_action_b2dab30e.png";
import partnershipImage from "@assets/image_1761129612907.png";
import appStoreImage from "@assets/app-store-badge.png";
import googlePlayImage from "@assets/google-play-badge.png";

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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border mb-8">
            <MapPin className="w-4 h-4 text-primary" />
            <select className="bg-transparent border-none outline-none text-foreground cursor-pointer">
              <option>Lahore</option>
              <option>Karachi</option>
              <option>Islamabad</option>
            </select>
          </div>
          
          {/* App Store Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-4">
            <a href="#" className="transition-transform hover:scale-105" data-testid="link-app-store">
              <img src={appStoreImage} alt="Download on App Store" className="h-14 w-48 object-contain" />
            </a>
            <a href="#" className="transition-transform hover:scale-105" data-testid="link-google-play">
              <img src={googlePlayImage} alt="Get it on Google Play" className="h-14 w-48 object-contain" />
            </a>
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

      {/* Our Story Section */}
      <section className="relative py-32 px-6 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${footballImage})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/85 to-background/95" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <p className="text-primary text-sm font-semibold tracking-wider uppercase mb-4">Our Story</p>
            <h2 className="text-5xl md:text-7xl font-display font-bold mb-8 leading-tight">
              One Game.<br />
              One Community.<br />
              <span className="text-primary">Infinite Play.</span>
            </h2>
          </div>

          {/* Story Content */}
          <div className="space-y-6 text-center text-lg md:text-xl leading-relaxed text-foreground/90 max-w-4xl mx-auto mb-16">
            <p>
              P2P was born from a simple idea — that sports should belong to everyone.
              From dusty cricket pitches and late-night football turf wars to padel courts glowing under floodlights, we saw one truth:
              <span className="font-semibold text-foreground"> the love of the game unites us all.</span>
            </p>
            
            <p>
              But in a world where play was fading behind screens, we wanted to bring it back — raw, real, and alive.
              So, we built Pay 2 Play, not just as an app, but as a movement — a bridge between passion and possibility.
            </p>
            
            <p>
              A single tap connects you to your next match, your next rival, your next family of players.
              <span className="font-semibold text-foreground"> Find your field. Book your slot. Join a league. Build your legacy.</span>
            </p>
            
            <p>
              Because every booking is more than a transaction — it's a heartbeat in the rhythm of a growing sports revolution.
            </p>
            
            <p>
              From Lahore to the world, P2P empowers players, venues, and communities to thrive together —
              turning empty fields into electric moments, and strangers into teammates.
            </p>
            
            <p className="text-xl md:text-2xl font-semibold text-foreground pt-4">
              We're not just reimagining sports technology — we're rewriting the culture of play.
            </p>
            
            <p className="text-primary font-bold text-xl">
              Accessible. Elegant. Unstoppable.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <Button 
              size="lg" 
              className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-10 h-14 font-semibold"
            >
              Join the Movement
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 text-lg px-10 h-14 font-semibold"
            >
              Watch the Story
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-8 text-center max-w-4xl mx-auto mb-12">
            <div>
              <div className="text-5xl md:text-6xl font-bold text-primary mb-2">12+</div>
              <div className="text-sm text-muted-foreground">Venues Partnered</div>
            </div>
            <div>
              <div className="text-5xl md:text-6xl font-bold text-primary mb-2">5,000+</div>
              <div className="text-sm text-muted-foreground">Players Connected</div>
            </div>
            <div>
              <div className="text-5xl md:text-6xl font-bold text-primary mb-2">3</div>
              <div className="text-sm text-muted-foreground">Sports, 1 Platform</div>
            </div>
          </div>

          {/* Tagline */}
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-display font-bold">
              Play. Connect. Compete. Belong.
            </p>
          </div>
        </div>
      </section>

      {/* Partnership Section */}
      <section className="relative py-32 px-6 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${partnershipImage})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/80 to-background/90" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-5xl md:text-6xl font-display font-bold mb-8 leading-tight">
              Let's Build the Future<br />
              of Sports Together
            </h2>
          </div>

          {/* Content */}
          <div className="space-y-6 text-center text-lg md:text-xl leading-relaxed text-foreground/90 max-w-4xl mx-auto mb-12">
            <p>
              <span className="font-semibold text-foreground">Partner with P2P to power the next era of play.</span>
              <br />
              Whether you're a sports facility, a brand, or a community organization, join us in making sports accessible, inclusive, and unforgettable.
            </p>
            
            <p>
              We're connecting players, venues, and partners through a single, intelligent platform — uniting Cricket, Football, and Padel under one experience.
            </p>
            
            <p>
              Together, we can turn every city into a playground, every field into an opportunity, and every match into a story worth sharing.
            </p>
            
            <p className="text-xl md:text-2xl font-semibold text-foreground pt-4">
              Let's build the future of sports — together.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-10 h-14 font-semibold"
              data-testid="button-become-partner"
            >
              Become a Partner
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 text-lg px-10 h-14 font-semibold"
              data-testid="button-learn-more"
            >
              Learn More
            </Button>
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
          <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-8">
            <div className="text-center md:text-left">
              <img src={logoImage} alt="Pay 2 Play" className="h-16 w-auto mb-3 mx-auto md:mx-0" />
              <p className="text-sm text-muted-foreground mb-4">
                Pakistan's Premier Sports Booking Platform
              </p>
              
              {/* Social Media Icons */}
              <div className="flex gap-4 justify-center md:justify-start">
                <a 
                  href="#" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                  data-testid="link-facebook"
                  aria-label="Facebook"
                >
                  <FaFacebook className="w-6 h-6" />
                </a>
                <a 
                  href="#" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                  data-testid="link-instagram"
                  aria-label="Instagram"
                >
                  <FaInstagram className="w-6 h-6" />
                </a>
                <a 
                  href="#" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                  data-testid="link-tiktok"
                  aria-label="TikTok"
                >
                  <FaTiktok className="w-6 h-6" />
                </a>
                <a 
                  href="#" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                  data-testid="link-youtube"
                  aria-label="YouTube"
                >
                  <FaYoutube className="w-6 h-6" />
                </a>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
              <div className="flex flex-col gap-3 text-sm">
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
              
              {/* Get the App */}
              <div className="flex flex-col gap-3">
                <h3 className="text-sm font-semibold text-foreground">Get the App</h3>
                <div className="flex flex-col gap-2">
                  <a href="#" className="transition-transform hover:scale-105" data-testid="footer-app-store">
                    <img src={appStoreImage} alt="Download on App Store" className="h-12 w-40 object-contain" />
                  </a>
                  <a href="#" className="transition-transform hover:scale-105" data-testid="footer-google-play">
                    <img src={googlePlayImage} alt="Get it on Google Play" className="h-12 w-40 object-contain" />
                  </a>
                </div>
              </div>
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
