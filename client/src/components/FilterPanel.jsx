import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

export default function FilterPanel({ 
  selectedCourse, 
  selectedTags, 
  onCourseChange, 
  onTagToggle,
  onClearFilters 
}) {
  const courses = [
    "Web Development",
    "Mobile Development",
    "Data Science",
    "Game Development",
    "Machine Learning",
    "Cybersecurity"
  ];

  const tags = [
    "React",
    "Node.js",
    "Python",
    "Java",
    "MongoDB",
    "SQL",
    "UI/UX",
    "API",
    "Mobile",
    "Web"
  ];

  const hasFilters = selectedCourse || selectedTags.length > 0;

  return (
    <Card className="p-4" data-testid="card-filters">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Filters</h3>
        {hasFilters && (
          <button
            onClick={onClearFilters}
            className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
            data-testid="button-clear-filters"
          >
            <X className="h-3 w-3" />
            Clear
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-2">Course</h4>
          <div className="flex flex-wrap gap-2">
            {courses.map((course) => (
              <Badge
                key={course}
                variant={selectedCourse === course ? "default" : "outline"}
                className="cursor-pointer hover-elevate"
                onClick={() => onCourseChange(course === selectedCourse ? null : course)}
                data-testid={`filter-course-${course.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {course}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">Tags</h4>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                className="cursor-pointer hover-elevate"
                onClick={() => onTagToggle(tag)}
                data-testid={`filter-tag-${tag.toLowerCase()}`}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
