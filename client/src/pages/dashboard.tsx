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
import { Home, Building2, Calendar, DollarSign, Users, Trophy, Settings } from "lucide-react";
import type { Venue } from "@shared/schema";

const menuItems = [
  { title: "Overview", url: "/dashboard", icon: Home },
  { title: "My Venues", url: "/dashboard/venues", icon: Building2 },
  { title: "Bookings", url: "/dashboard/bookings", icon: Calendar },
  { title: "Payouts", url: "/dashboard/payouts", icon: DollarSign },
  { title: "My Games", url: "/dashboard/games", icon: Users },
  { title: "Leagues", url: "/dashboard/leagues", icon: Trophy },
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
];

function DashboardOverview() {
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
  const userId = "e58ca82c-13b7-4731-8616-9aeb56a0ede5"; // Seeded test user
  const { data: venues = [], isLoading } = useQuery<Venue[]>({
    queryKey: ["/api/dashboard/venues", userId],
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
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [location] = useLocation();
  const params = useParams();
  const section = params.section || "overview";

  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

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
              <ThemeToggle />
            </div>
          </header>

          <main className="flex-1 overflow-auto p-6">
            <div className="max-w-7xl mx-auto">
              {section === "overview" && <DashboardOverview />}
              {section === "venues" && <VenuesSection />}
              {section === "bookings" && <div>Bookings section (coming soon)</div>}
              {section === "payouts" && <div>Payouts section (coming soon)</div>}
              {section === "games" && <div>My Games section (coming soon)</div>}
              {section === "leagues" && <div>Leagues section (coming soon)</div>}
              {section === "settings" && <div>Settings section (coming soon)</div>}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
