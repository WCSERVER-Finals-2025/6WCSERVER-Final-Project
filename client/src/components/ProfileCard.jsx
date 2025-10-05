import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function ProfileCard({ user }) {
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
            {user?.role === "teacher" ? "Teacher" : "Student"}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full pt-4 border-t">
          <div>
            <div className="text-2xl font-bold" data-testid="text-projects-count">
              {user?.projectsCount || 0}
            </div>
            <div className="text-sm text-muted-foreground">Projects</div>
          </div>
          <div>
            <div className="text-2xl font-bold" data-testid="text-rating-count">
              {user?.rating || 0}
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
