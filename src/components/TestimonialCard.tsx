
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TestimonialCardProps {
  quote: string;
  author: {
    name: string;
    role?: string;
    company?: string;
    avatarUrl?: string;
  };
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  quote,
  author,
}) => {
  return (
    <Card className="h-full flex flex-col">
      <CardContent className="flex-1 pt-6">
        <div className="mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <span key={star} className="text-yellow-400">★</span>
          ))}
        </div>
        <blockquote className="text-muted-foreground italic">
          "{quote}"
        </blockquote>
      </CardContent>
      <CardFooter>
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={author.avatarUrl} />
            <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{author.name}</p>
            {(author.role || author.company) && (
              <p className="text-xs text-muted-foreground">
                {author.role}{author.role && author.company ? `, ` : ""}{author.company}
              </p>
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default TestimonialCard;
