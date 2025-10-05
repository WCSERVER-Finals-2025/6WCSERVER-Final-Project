import { Link, useLocation } from "wouter";
import { Home, FolderOpen, Upload, User, FileCheck, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Sidebar({ currentUser, pendingCount = 0 }) {
  const [location] = useLocation();

  const isActive = (path) => location === path;

  const studentLinks = [
    { path: "/", icon: Home, label: "Dashboard" },
    { path: "/browse", icon: FolderOpen, label: "Browse Projects" },
    { path: "/upload", icon: Upload, label: "Upload Project" },
    { path: "/profile", icon: User, label: "My Profile" },
  ];

  const teacherLinks = [
    { path: "/", icon: Home, label: "Dashboard" },
    { path: "/browse", icon: FolderOpen, label: "Browse Projects" },
    { path: "/admin", icon: FileCheck, label: "Pending Approvals" },
    { path: "/profile", icon: User, label: "My Profile" },
  ];

  const links = currentUser?.role === "teacher" ? teacherLinks : studentLinks;

  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border h-screen flex flex-col">
      <div className="p-6 border-b border-sidebar-border">
        <h1 className="text-xl font-bold text-sidebar-foreground">Student Portfolio</h1>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {links.map((link) => (
          <Link key={link.path} href={link.path}>
            <Button
              variant="ghost"
              className={`w-full justify-start gap-3 ${
                isActive(link.path) ? "bg-sidebar-accent" : ""
              }`}
              data-testid={`link-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
            >
              <link.icon className="h-5 w-5" />
              {link.label}
              {link.path === "/admin" && pendingCount > 0 && (
                <Badge variant="destructive" className="ml-auto" data-testid="badge-pending-count">
                  {pendingCount}
                </Badge>
              )}
            </Button>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3"
          data-testid="button-logout"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </Button>
      </div>
    </div>
  );
}
