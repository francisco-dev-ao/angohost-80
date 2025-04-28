
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface StatCardProps {
  title: string;
  value: number | string;
  description: string;
  icon: LucideIcon;
  iconColor: string;
  buttonText: string;
  buttonLink: string;
}

const StatCard = ({
  title,
  value,
  description,
  icon: Icon,
  iconColor,
  buttonText,
  buttonLink,
}: StatCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${iconColor}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1 mb-4">
          {description}
        </p>
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => navigate(buttonLink)}
        >
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
};

export default StatCard;
