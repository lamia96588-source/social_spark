import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import type { EventCategory } from "@/lib/events";
import { categoryClass } from "@/lib/utils";

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return <span data-slot="badge" className={cn("badge", className)} {...props} />;
}

export function CategoryBadge({ category }: { category: EventCategory }) {
  return <Badge className={`category-badge ${categoryClass(category)}`}>{category}</Badge>;
}
