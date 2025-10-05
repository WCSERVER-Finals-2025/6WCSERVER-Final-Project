import { useState } from "react";
import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import BrowseProjects from "@/pages/BrowseProjects";
import UploadProject from "@/pages/UploadProject";
import ProjectDetail from "@/pages/ProjectDetail";
import AdminPanel from "@/pages/AdminPanel";
import Profile from "@/pages/Profile";

function Router({ currentUser, onLogin }) {
  if (!currentUser) {
    return <Login onLogin={onLogin} />;
  }

  return (
    <Switch>
      <Route path="/" component={() => <Dashboard currentUser={currentUser} />} />
      <Route path="/browse" component={() => <BrowseProjects currentUser={currentUser} />} />
      <Route path="/upload" component={() => <UploadProject currentUser={currentUser} />} />
      <Route path="/project/:id" component={() => <ProjectDetail currentUser={currentUser} />} />
      <Route path="/admin" component={() => <AdminPanel currentUser={currentUser} />} />
      <Route path="/profile" component={() => <Profile currentUser={currentUser} />} />
    </Switch>
  );
}

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router currentUser={currentUser} onLogin={setCurrentUser} />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
