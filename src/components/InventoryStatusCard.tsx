
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tag, Clock, AlertTriangle } from "lucide-react";
import { InventoryItem, getInventoryStatus } from "@/services/dataService";

interface InventoryStatusCardProps {
  item: InventoryItem;
  className?: string;
}

const InventoryStatusCard = ({ item, className = "" }: InventoryStatusCardProps) => {
  const status = getInventoryStatus(item);
  const percentStock = Math.min(Math.round((item.currentStock / item.optimalStock) * 100), 100);
  
  const daysRemaining = Math.ceil(item.currentStock / item.usageRate);
  
  const getStatusColor = () => {
    switch (status) {
      case 'urgent':
        return 'bg-inventory-urgent text-white';
      case 'warning':
        return 'bg-inventory-warning text-black';
      case 'normal':
        return 'bg-inventory-normal text-white';
    }
  };
  
  const getStatusText = () => {
    switch (status) {
      case 'urgent':
        return 'Reorder Immediately';
      case 'warning':
        return 'Low Stock';
      case 'normal':
        return 'Stock Adequate';
    }
  };
  
  return (
    <Card className={`overflow-hidden transition-all duration-300 ${className}`}>
      <div className={`h-1.5 ${getStatusColor()}`} />
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-medium">{item.name}</CardTitle>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </div>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Tag className="w-3.5 h-3.5 mr-1" />
          {item.category}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between mb-1 text-sm">
            <span>Current Stock</span>
            <span className="font-medium">{item.currentStock} / {item.optimalStock} units</span>
          </div>
          <Progress 
            value={percentStock} 
            className={status === 'urgent' ? 'bg-red-200' : status === 'warning' ? 'bg-amber-200' : 'bg-emerald-200'} 
          />
        </div>
        
        {status !== 'normal' && (
          <div className="flex items-center justify-between py-2 px-3 rounded-md bg-secondary">
            {status === 'urgent' ? (
              <AlertTriangle className="w-4 h-4 text-inventory-urgent" />
            ) : (
              <Clock className="w-4 h-4 text-inventory-warning" />
            )}
            <span className="text-sm">
              {status === 'urgent' 
                ? `Need to reorder now (Lead time: ${item.supplierLeadTime} days)` 
                : `${daysRemaining} days of stock remaining`}
            </span>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-muted-foreground">Usage Rate</p>
            <p className="font-medium">{item.usageRate} units/day</p>
          </div>
          <div>
            <p className="text-muted-foreground">Last Ordered</p>
            <p className="font-medium">{new Date(item.lastOrdered).toLocaleDateString()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InventoryStatusCard;
