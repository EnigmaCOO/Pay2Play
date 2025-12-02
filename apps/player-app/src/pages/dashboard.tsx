import { Link, useLocation, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ThemeToggle } from "@/components/theme-toggle";
import { format } from "date-fns";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Home, Building2, Calendar, DollarSign, Users, Trophy, Settings, LogOut, Wallet } from "lucide-react";
import type { Venue } from "@shared/schema";
import { useAuth } from "@/context/AuthContext";
import { BookingsSection } from "@/components/BookingsSection";
import { GamesSection } from "@/components/GamesSection";
import { VenueBookingsSection } from "@/components/VenueBookingsSection";
import { VenuePayoutsSection } from "@/components/VenuePayoutsSection";
import { WalletSection } from "@/components/WalletSection";

const menuItems = [
  { title: "Overview", url: "/dashboard", icon: Home },
  { title: "My Venues", url: "/dashboard/venues", icon: Building2 },
  { title: "Bookings", url: "/dashboard/bookings", icon: Calendar },
  { title: "Payouts", url: "/dashboard/payouts", icon: DollarSign },
  { title: "My Games", url: "/dashboard/games", icon: Users },
  { title: "Leagues", url: "/dashboard/leagues", icon: Trophy },
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
  { title: "Wallet", url: "/dashboard/wallet", icon: Wallet },
];

function DashboardOverview() {
  const { user } = useAuth();
  const userId = user?.uid;

  const { data: wallet, isLoading: isLoadingWallet } = useQuery<{ balancePkr: number }>({
    queryKey: ["/api/wallet", userId],
    enabled: !!userId,
  });

  return (
    <div>
      <h2 className="text-3xl font-display font-bold mb-2">Dashboard Overview</h2>
      <p className="text-muted-foreground mb-8">
        Manage your venues, bookings, and leagues
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover-elevate">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-primary" />
              Wallet Balance
            </CardTitle>
            <CardDescription>Your current available funds</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingWallet ? (
              <p>Loading...</p>
            ) : (
              <p className="text-2xl font-bold">PKR {wallet?.balancePkr?.toLocaleString() || 0}</p>
            )}
            <Button asChild className="w-full mt-4" data-testid="button-manage-wallet">
              <Link href="/dashboard/wallet">Manage Wallet</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              Venues
            </CardTitle>
            <CardDescription>Manage your sports facilities</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full" data-testid="button-manage-venues">
              <Link href="/dashboard/venues">Manage Venues</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Bookings
            </CardTitle>
            <CardDescription>View and manage bookings</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full" data-testid="button-view-bookings">
              <Link href="/dashboard/bookings">View Bookings</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Games
            </CardTitle>
            <CardDescription>My hosted and joined games</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full" data-testid="button-my-games">
              <Link href="/dashboard/games">My Games</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              Leagues
            </CardTitle>
            <CardDescription>Manage seasons and teams</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full" data-testid="button-manage-leagues">
              <Link href="/dashboard/leagues">Manage Leagues</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary" />
              Payouts
            </CardTitle>
            <CardDescription>Track venue revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full" data-testid="button-view-payouts">
              <Link href="/dashboard/payouts">View Payouts</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function VenuesSection() {
  const { user } = useAuth();
  const userId = user?.uid; // Use authenticated user's ID

  const { data: venues = [], isLoading } = useQuery<Venue[]>({
    queryKey: ["/api/dashboard/venues", userId],
    enabled: !!userId, // Only fetch if userId is available
  });

  if (isLoading) return <div>Loading venues...</div>;

  return (
    <div>
      <h2 className="text-3xl font-display font-bold mb-2">My Venues</h2>
      <p className="text-muted-foreground mb-8">
        Manage your registered sports venues
      </p>

      <div className="grid gap-4">
        {venues.map((venue) => (
          <Card key={venue.id}>
            <CardHeader>
              <CardTitle>{venue.name}</CardTitle>
              <CardDescription>{venue.address}, {venue.city}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{venue.description}</p>
              <div className="mt-4 flex gap-2">
                <Button size="sm" data-testid={`button-view-venue-${venue.id}`}>View Details</Button>
                <Button size="sm" variant="outline" data-testid={`button-edit-venue-${venue.id}`}>Edit</Button>
                <Button size="sm" variant="secondary" asChild>
                  <Link href={`/dashboard/venues/${venue.id}/bookings`}>View Bookings</Link>
                </Button>
                <Button size="sm" variant="secondary" asChild>
                  <Link href={`/dashboard/venues/${venue.id}/payouts`}>View Payouts</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const params = useParams();
  const section = params.section || "overview";
  const venueId = params.venueId;
  const subSection = params.subSection;
  const { user, loading, logout } = useAuth();

  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (!user) {
    // Redirect to home if not authenticated (handled by AuthContext, but good to have a fallback)
    return null;
  }

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <div className="px-3 py-4">
                <Link href="/">
                  <h1 className="text-2xl font-display font-bold">
                    P<span className="text-primary">2</span>P
                  </h1>
                </Link>
              </div>
              <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={location === item.url}>
                        <Link href={item.url} data-testid={`link-${item.title.toLowerCase().replace(/ /g, "-")}`}>
                          <item.icon className="w-4 h-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <div className="flex flex-col flex-1">
          <header className="flex items-center justify-between p-4 border-b">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <div className="flex items-center gap-2">
              {user && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {user.displayName || user.email}
                  </span>
                  <Button variant="ghost" size="icon" onClick={logout} data-testid="button-logout">
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              )}
              <ThemeToggle />
            </div>
          </header>

          <main className="flex-1 overflow-auto p-6">
            <div className="max-w-7xl mx-auto">
              {section === "overview" && <DashboardOverview />}
              {section === "venues" && !venueId && <VenuesSection />}
              {section === "venues" && venueId && subSection === "bookings" && (
                <VenueBookingsSection venueId={venueId} />
              )}
              {section === "venues" && venueId && subSection === "payouts" && (
                <VenuePayoutsSection venueId={venueId} />
              )}
              {section === "bookings" && <BookingsSection />}
              {section === "payouts" && <div>Payouts section (coming soon)</div>}
              {section === "games" && <GamesSection />}
              {section === "leagues" && <div>Leagues section (coming soon)</div>}
              {section === "settings" && <div>Settings section (coming soon)</div>}
              {section === "wallet" && <WalletSection />}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}