
import { cn } from "@/lib/utils";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface KpiCardProps {
  title: string;
  value: number | string;
  change: number;
  icon: React.ReactNode;
  format?: (value: number | string) => string;
  className?: string;
}

const KpiCard = ({
  title,
  value,
  change,
  icon,
  format = (val) => String(val),
  className,
}: KpiCardProps) => {
  const isPositive = change > 0;
  
  return (
    <Card className={cn("overflow-hidden animate-slide-up", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="w-8 h-8 p-1.5 rounded-md bg-primary/10 text-primary">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{format(value)}</div>
        <div className="flex items-center pt-1">
          {isPositive ? (
            <ArrowUpIcon className="mr-1 h-4 w-4 text-green-500" />
          ) : (
            <ArrowDownIcon className="mr-1 h-4 w-4 text-red-500" />
          )}
          <span
            className={cn(
              "text-xs font-medium",
              isPositive ? "text-green-500" : "text-red-500"
            )}
          >
            {Math.abs(change)}%
          </span>
          <span className="text-xs text-muted-foreground ml-1">from last month</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default KpiCard;
