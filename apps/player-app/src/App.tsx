import { Route, Switch } from "wouter";
import Landing from "./pages/landing";
import Contact from "./pages/Contact";
import CreateGame from "./pages/create-game";
import Dashboard from "./pages/dashboard";
import DebugPushToken from "./pages/debug-push-token";
import GameDetail from "./pages/game-detail";
import Games from "./pages/games";
import Leagues from "./pages/leagues";
import NotFound from "./pages/not-found";
import Venues from "./pages/venues";
import VenueDetail from "./pages/venue-detail";
import Book from "./pages/Book"; // Import the new Book component

export default function App() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/contact" component={Contact} />
      <Route path="/create-game" component={CreateGame} />
      <Route path="/dashboard/:section?/:venueId?/:subSection?" component={Dashboard} />
      <Route path="/debug-push-token" component={DebugPushToken} />
      <Route path="/game/:id" component={GameDetail} />
      <Route path="/games" component={Games} />
      <Route path="/leagues" component={Leagues} />
      <Route path="/venues" component={Venues} />
      <Route path="/venues/:id" component={VenueDetail} />
      <Route path="/book/:fieldId" component={Book} />
      <Route component={NotFound} />
    </Switch>
  );
}