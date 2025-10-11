import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { isTeacher } from "@/lib/roles";
import { Link } from "wouter";

export default function ProfileCard({ user }) {
  const [stats, setStats] = useState({ projectsCount: 0, rating: 0 });

  // Fetch user stats dynamically
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`/api/users/${user.id}/stats`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch stats");
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Error fetching user stats  :", err);
      }
    };

    if (user?.id) fetchStats();
  }, [user?.id]);

  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "U";

  return (
    <Card className="p-6" data-testid="card-profile">
      <div className="flex flex-col items-center text-center space-y-4">
        <Avatar className="h-24 w-24">
          <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
        </Avatar>

        <div>
          <h3 className="text-xl font-semibold" data-testid="text-user-name">
            {user?.name}
          </h3>
          <Badge variant="secondary" className="mt-2" data-testid="badge-user-role">
            {isTeacher(user) ? "Teacher" : "Student"}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full pt-4 border-t">
          <div>
            <div className="text-2xl font-bold" data-testid="text-projects-count">
              {stats.projectsCount}
            </div>
            <div className="text-sm text-muted-foreground">Projects</div>
          </div>
          <div>
            <div className="text-2xl font-bold" data-testid="text-rating-count">
              {stats.rating}
            </div>
            <div className="text-sm text-muted-foreground">Thumbs Up</div>
          </div>
        </div>

        <Link href="/profile" className="w-full">
          <Button variant="outline" className="w-full" data-testid="button-view-profile">
            View Profile
          </Button>
        </Link>
      </div>
    </Card>
  );
}
