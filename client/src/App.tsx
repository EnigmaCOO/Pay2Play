import { Route, Switch } from "wouter";
import Home from "./pages/Home";
import Contact from "./pages/Contact";

export default function App() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/contact" component={Contact} />
    </Switch>
  );
}
