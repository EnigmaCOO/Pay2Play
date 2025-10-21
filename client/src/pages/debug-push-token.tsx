import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/theme-toggle";
import { Bell } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export default function DebugPushToken() {
  const [token, setToken] = useState("");
  const { toast } = useToast();

  const saveMutation = useMutation({
    mutationFn: async (expoPushToken: string) => {
      return await apiRequest("POST", "/api/users/push-token", { expoPushToken });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Push token saved successfully",
      });
      setToken("");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save push token",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (token.trim()) {
      saveMutation.mutate(token.trim());
    }
  };

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
      <main className="max-w-2xl mx-auto px-4 py-12">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Bell className="w-6 h-6 text-primary" />
              <CardTitle className="text-2xl">Push Notification Debug</CardTitle>
            </div>
            <CardDescription>
              Save an Expo push token for testing push notifications. This will allow you to receive
              notifications when game events occur.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="expo-token" data-testid="label-expo-token">
                  Expo Push Token
                </Label>
                <Input
                  id="expo-token"
                  placeholder="ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  data-testid="input-expo-token"
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Get your Expo push token from the Expo Go app or your development console.
                </p>
              </div>
              <Button
                type="submit"
                disabled={!token.trim() || saveMutation.isPending}
                data-testid="button-save-token"
                className="w-full"
              >
                {saveMutation.isPending ? "Saving..." : "Save Push Token"}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h3 className="font-semibold mb-2">How to test:</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                <li>Save your Expo push token using the form above</li>
                <li>Join a pickup game or create one</li>
                <li>Simulate a payment webhook success</li>
                <li>You should receive a push notification confirming your game join</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
