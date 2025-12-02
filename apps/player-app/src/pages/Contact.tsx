import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import logoImage from "@assets/image_1761127248488.png";
import appStoreImage from "@assets/app-store-badge.png";
import googlePlayImage from "@assets/google-play-badge.png";
import { Link } from "wouter";

interface ContactForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  helpType: string;
}

export default function Contact() {
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<ContactForm>();

  const onSubmit = (data: ContactForm) => {
    console.log(data);
    toast({
      title: "Message sent!",
      description: "We'll get back to you as soon as possible.",
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Navigation */}
      <nav className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/">
              <a className="flex items-center gap-3">
                <img src={logoImage} alt="P2P" className="h-12 w-auto" />
              </a>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <a href="#" className="text-foreground/80 hover:text-foreground transition-colors">
                Partners
              </a>
              <a href="#" className="text-foreground/80 hover:text-foreground transition-colors">
                Leagues
              </a>
            </div>
          </div>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            Open App
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 px-6 py-16">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
            Get in Touch
          </h1>
          <p className="text-lg text-foreground/80 mb-12 leading-relaxed">
            Have questions, partnership ideas, or feedback? We're here to help. 
            Whether you're a venue, brand, or player community, let's connect and 
            build the future of play—cricket, football, and padel.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName">
                  First name<span className="text-destructive">*</span>
                </Label>
                <Input
                  id="firstName"
                  placeholder="Enter your first name"
                  {...register("firstName", { required: true })}
                  className="bg-card border-border"
                  data-testid="input-first-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">
                  Last name<span className="text-destructive">*</span>
                </Label>
                <Input
                  id="lastName"
                  placeholder="Enter your last name"
                  {...register("lastName", { required: true })}
                  className="bg-card border-border"
                  data-testid="input-last-name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                Email address<span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register("email", { required: true })}
                className="bg-card border-border"
                data-testid="input-email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+92 3xx xxxxxxx"
                {...register("phone")}
                className="bg-card border-border"
                data-testid="input-phone"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="helpType">
                How can we help?<span className="text-destructive">*</span>
              </Label>
              <Select
                onValueChange={(value) => setValue("helpType", value)}
                required
              >
                <SelectTrigger className="bg-card border-border" data-testid="select-help-type">
                  <SelectValue placeholder="Select options" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General Inquiry</SelectItem>
                  <SelectItem value="partnership">Partnership Opportunity</SelectItem>
                  <SelectItem value="venue">Venue Registration</SelectItem>
                  <SelectItem value="support">Technical Support</SelectItem>
                  <SelectItem value="feedback">Feedback</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-14 text-lg font-semibold"
              data-testid="button-submit"
            >
              Submit
            </Button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <img src={logoImage} alt="P2P" className="h-12 w-auto" />
              <p className="text-sm text-muted-foreground">
                Connecting communities through cricket, football, and padel.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <p className="text-sm text-muted-foreground">Get the app</p>
              <div className="flex gap-3">
                <a href="#" className="transition-transform hover:scale-105">
                  <img src={appStoreImage} alt="App Store" className="h-10 w-32 object-contain" />
                </a>
                <a href="#" className="transition-transform hover:scale-105">
                  <img src={googlePlayImage} alt="Google Play" className="h-10 w-32 object-contain" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 mt-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Partners</a>
            <a href="#" className="hover:text-foreground transition-colors">Community</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
