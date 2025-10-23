
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { MapPin, Users, Clock, Search, SlidersHorizontal, Calendar } from "lucide-react";
import { Link } from "wouter";

type Game = {
  id: string;
  sport: string;
  start: string;
  end: string;
  minPlayers: number;
  maxPlayers: number;
  currentPlayers: number;
  pricePkr: number;
  status: string;
  venueName: string;
  fieldName: string;
  skillLevel?: string;
  distance?: number;
};

const skillLevels = ["Beginner", "Friendly", "Intermediate", "High-Level", "Masters"];
const timeSlots = [
  { label: "Morning (7am - 12pm)", value: "morning" },
  { label: "Afternoon (12pm - 5pm)", value: "afternoon" },
  { label: "Evening (5pm - 10pm)", value: "evening" },
  { label: "Late night (10pm - 2am)", value: "late" }
];

export default function Games() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [distanceRange, setDistanceRange] = useState([100]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("distance");

  const { data: games, isLoading } = useQuery<Game[]>({
    queryKey: ["/api/games/search"],
  });

  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });

  const filteredGames = games?.filter(game => {
    if (searchQuery && !game.venueName.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (selectedSkills.length > 0 && !selectedSkills.includes(game.skillLevel || "Friendly")) {
      return false;
    }
    return true;
  }) || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-display font-bold">Discover</h1>
            <Button variant="ghost" size="icon">
              <Calendar className="w-5 h-5" />
            </Button>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search games"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-12"
            />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2">
                  <SlidersHorizontal className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="py-6 space-y-6">
                  {/* Preferred Time */}
                  <div>
                    <h3 className="font-semibold mb-3">Preferred time</h3>
                    <div className="space-y-2">
                      {timeSlots.map((slot) => (
                        <div key={slot.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={slot.value}
                            checked={selectedTimes.includes(slot.value)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedTimes([...selectedTimes, slot.value]);
                              } else {
                                setSelectedTimes(selectedTimes.filter(t => t !== slot.value));
                              }
                            }}
                          />
                          <label htmlFor={slot.value} className="text-sm cursor-pointer">
                            {slot.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Distance */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <h3 className="font-semibold">Distance away</h3>
                      <span className="text-sm text-muted-foreground">
                        0 mi - {distanceRange[0]} mi
                      </span>
                    </div>
                    <Slider
                      value={distanceRange}
                      onValueChange={setDistanceRange}
                      max={100}
                      step={1}
                      className="mt-2"
                    />
                  </div>

                  {/* Skill Level */}
                  <div>
                    <h3 className="font-semibold mb-3">Game Difficulty</h3>
                    <div className="space-y-2">
                      {skillLevels.map((level) => (
                        <div key={level} className="flex items-center space-x-2">
                          <Checkbox
                            id={level}
                            checked={selectedSkills.includes(level)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedSkills([...selectedSkills, level]);
                              } else {
                                setSelectedSkills(selectedSkills.filter(s => s !== level));
                              }
                            }}
                          />
                          <label htmlFor={level} className="text-sm cursor-pointer">
                            {level}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sort By */}
                  <div>
                    <h3 className="font-semibold mb-3">Sort By</h3>
                    <div className="space-y-2">
                      {[
                        { label: "Nearest", value: "distance" },
                        { label: "Soonest", value: "time" },
                        { label: "Price", value: "price" }
                      ].map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={option.value}
                            checked={sortBy === option.value}
                            onCheckedChange={() => setSortBy(option.value)}
                          />
                          <label htmlFor={option.value} className="text-sm cursor-pointer">
                            {option.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setSelectedSkills([]);
                        setSelectedTimes([]);
                        setDistanceRange([100]);
                      }}
                    >
                      Clear
                    </Button>
                    <Button className="flex-1">
                      See {filteredGames.length} Games
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Date Selector */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {dates.map((date) => (
              <button
                key={date.toISOString()}
                onClick={() => setSelectedDate(date)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  date.toDateString() === selectedDate.toDateString()
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {date.toLocaleDateString("en-US", { weekday: "short", day: "numeric" })}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Games List */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredGames.length === 0 ? (
          <Card className="border-2 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="w-32 h-32 mb-6 relative">
                <div className="absolute inset-0 bg-primary/10 rounded-full flex items-center justify-center">
                  <Users className="w-16 h-16 text-primary" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-2">Quiet day on the field.</h3>
              <p className="text-muted-foreground text-center max-w-md mb-6">
                No games here today—or maybe not just yet. Tell us where and when you'd play,
                and help us bring the action to you.
              </p>
              <Button asChild>
                <Link href="/create-game">Help us grow in your city</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredGames.map((game) => (
              <Link key={game.id} href={`/games/${game.id}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 relative">
                    {game.distance && (
                      <Badge className="absolute top-2 right-2 bg-background/90">
                        <MapPin className="w-3 h-3 mr-1" />
                        {game.distance} mi away
                      </Badge>
                    )}
                    {game.status === "confirmed" && (
                      <Badge className="absolute top-2 left-2 bg-green-500">
                        GAME CONFIRMED
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-lg">{game.venueName}</h3>
                        <p className="text-sm text-muted-foreground">@{game.fieldName}</p>
                      </div>
                      {game.status === "open" && (
                        <span className="text-sm font-semibold text-green-600">
                          {game.maxPlayers - game.currentPlayers} spots left
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <Clock className="w-4 h-4" />
                      <span>
                        {new Date(game.start).toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "2-digit"
                        })} - {new Date(game.end).toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "2-digit"
                        })}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {game.skillLevel || "Friendly"}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {game.currentPlayers}/{game.maxPlayers}
                        </Badge>
                      </div>
                      <span className="font-bold">Rs. {game.pricePkr}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
