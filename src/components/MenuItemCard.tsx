
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { MenuItem } from "@/services/dataService";

interface MenuItemCardProps {
  item: MenuItem;
  onClick?: () => void;
  className?: string;
}

const MenuItemCard = ({ item, onClick, className = "" }: MenuItemCardProps) => {
  const sentimentPercentage = Math.round(item.sentiment.overall * 100);
  const profit = item.price - item.cost;
  const profitMargin = Math.round((profit / item.price) * 100);
  
  return (
    <Card 
      className={`overflow-hidden transition-all duration-300 hover:shadow-md ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      <CardHeader className="pb-2 flex flex-row gap-4 items-center">
        <div className="w-16 h-16 rounded-md overflow-hidden bg-secondary flex items-center justify-center shrink-0">
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-medium leading-none">{item.name}</h3>
          <div className="flex items-center text-sm text-muted-foreground">
            <span className="mr-2">{item.category}</span>
            <span>${item.price.toFixed(2)}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between mb-1 text-sm">
            <span>Sentiment</span>
            <span className="font-medium">{sentimentPercentage}%</span>
          </div>
          <Progress 
            value={sentimentPercentage} 
            className={sentimentPercentage > 75 ? 'bg-green-200' : sentimentPercentage > 50 ? 'bg-amber-200' : 'bg-red-200'} 
          />
        </div>
        
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div>
            <p className="text-muted-foreground">Sales</p>
            <p className="font-medium">{item.sales}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Rating</p>
            <p className="font-medium">{item.rating.toFixed(1)}/5</p>
          </div>
          <div>
            <p className="text-muted-foreground">Margin</p>
            <p className="font-medium">{profitMargin}%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MenuItemCard;
