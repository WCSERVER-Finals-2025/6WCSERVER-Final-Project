import { Card } from "@/components/ui/card";

export default function RecentApprovedWidget({ projects }) {
  return (
    <Card className="p-4">
      <h4 className="font-semibold text-lg mb-2">Recent Approved Projects</h4>
      <ul className="space-y-2">
        {projects.map((proj) => (
          <li key={proj._id} className="text-sm">
            {proj.title} by {proj.uploadedBy?.name || proj.author || "Unknown"}
          </li>
        ))}
      </ul>
    </Card>
  );
}
