import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/theme-toggle";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Venue, Field } from "@shared/schema";

const gameSchema = z.object({
  hostId: z.string().min(1),
  fieldId: z.string().min(1, "Field is required"),
  sport: z.enum(["cricket", "football", "futsal", "padel"]),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  minPlayers: z.coerce.number().min(2, "Minimum 2 players"),
  maxPlayers: z.coerce.number().min(2, "Minimum 2 players"),
  pricePerPlayerPkr: z.coerce.number().min(1, "Price must be at least 1 PKR"),
});

type GameFormData = z.infer<typeof gameSchema>;

export default function CreateGame() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [selectedVenue, setSelectedVenue] = useState<string>("");
  
  const { data: venues } = useQuery<Venue[]>({
    queryKey: ["/api/venues"],
  });

  const { data: fields } = useQuery<Field[]>({
    queryKey: ["/api/fields", selectedVenue],
    enabled: !!selectedVenue,
    queryFn: async () => {
      const venue = await fetch(`/api/venues/${selectedVenue}`).then(r => r.json());
      return venue.fields || [];
    },
  });

  const form = useForm<GameFormData>({
    resolver: zodResolver(gameSchema),
    defaultValues: {
      hostId: "e58ca82c-13b7-4731-8616-9aeb56a0ede5", // Seeded test user
      sport: "football",
      minPlayers: 4,
      maxPlayers: 10,
      pricePerPlayerPkr: 500,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: GameFormData) => {
      return await apiRequest("POST", "/api/games", data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Game created successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/games/search"] });
      navigate("/games");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create game",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: GameFormData) => {
    createMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <h1 className="text-2xl font-display font-bold">
              P<span className="text-primary">2</span>P
            </h1>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button asChild variant="ghost" data-testid="button-back">
              <Link href="/games">Back to Games</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Host a Pickup Game</CardTitle>
            <CardDescription>
              Create a new game and let other players join by paying to reserve their spot
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Venue</label>
                  <Select value={selectedVenue} onValueChange={setSelectedVenue}>
                    <SelectTrigger data-testid="select-venue">
                      <SelectValue placeholder="Select a venue" />
                    </SelectTrigger>
                    <SelectContent>
                      {venues?.map((venue) => (
                        <SelectItem key={venue.id} value={venue.id}>
                          {venue.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <FormField
                  control={form.control}
                  name="fieldId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Field</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} disabled={!selectedVenue}>
                        <FormControl>
                          <SelectTrigger data-testid="select-field">
                            <SelectValue placeholder="Select a field" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {fields?.map((f) => (
                            <SelectItem key={f.id} value={f.id}>
                              {f.name} ({f.sport}) - PKR {f.pricePerHourPkr}/hr
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sport"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sport</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-sport">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="cricket">Cricket</SelectItem>
                          <SelectItem value="football">Football</SelectItem>
                          <SelectItem value="futsal">Futsal</SelectItem>
                          <SelectItem value="padel">Padel</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Time</FormLabel>
                        <FormControl>
                          <Input type="datetime-local" {...field} data-testid="input-start-time" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Time</FormLabel>
                        <FormControl>
                          <Input type="datetime-local" {...field} data-testid="input-end-time" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="minPlayers"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Min Players</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} data-testid="input-min-players" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="maxPlayers"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Players</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} data-testid="input-max-players" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="pricePerPlayerPkr"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price per Player (PKR)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} data-testid="input-price" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={createMutation.isPending}
                  data-testid="button-create-game"
                >
                  {createMutation.isPending ? "Creating..." : "Create Game"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
