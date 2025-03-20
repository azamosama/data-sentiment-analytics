
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "@/components/MainLayout";
import { getSentimentAnalysis } from "@/services/dataService";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  ChefHat, 
  TrendingUp, 
  TrendingDown, 
  ArrowLeft,
  Users
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";

const MenuItemDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [itemData, setItemData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItemData = async () => {
      setLoading(true);
      try {
        if (!id) return;
        const data = await getSentimentAnalysis(Number(id));
        setItemData(data);
      } catch (error) {
        console.error('Error fetching item data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchItemData();
  }, [id]);

  if (loading) {
    return (
      <MainLayout>
        <div className="animate-pulse space-y-8 max-w-7xl mx-auto">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-64 bg-gray-200 rounded-lg"></div>
            <div className="h-64 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!itemData || !itemData.item) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">Item not found</h2>
          <Button onClick={() => navigate('/menu')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Menu
          </Button>
        </div>
      </MainLayout>
    );
  }

  const { item, detailedAnalysis } = itemData;
  
  // Prepare data for the demographic chart
  const demographicData = Object.entries(item.sentiment.byAgeGroup).map(
    ([group, score]) => ({
      group,
      score: Math.round((score as number) * 100)
    })
  );
  
  // Prepare data for radar chart
  const radarData = [
    { 
      metric: "Taste", 
      score: Math.round(item.sentiment.overall * 100) 
    },
    { 
      metric: "Value", 
      score: Math.round(item.sentiment.overall * 90) 
    },
    { 
      metric: "Presentation", 
      score: Math.round(item.sentiment.overall * 85) 
    },
    { 
      metric: "Portion Size", 
      score: Math.round(item.sentiment.overall * 95) 
    },
    { 
      metric: "Consistency", 
      score: Math.round(item.sentiment.overall * 88) 
    }
  ];
  
  // Financial calculations
  const profit = item.price - item.cost;
  const profitMargin = Math.round((profit / item.price) * 100);
  const totalRevenue = item.price * item.sales;
  const totalCost = item.cost * item.sales;
  const totalProfit = totalRevenue - totalCost;

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/menu')}
              className="mb-2"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Menu
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">{item.name}</h1>
            <p className="text-muted-foreground">{item.category}</p>
          </div>
          
          <div className="bg-primary/10 text-primary rounded-full px-4 py-2 font-medium">
            ${item.price.toFixed(2)}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Sentiment Overview</CardTitle>
                <CardDescription>
                  Overall sentiment: {Math.round(item.sentiment.overall * 100)}%
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div>
                    <div className="mb-2 flex justify-between">
                      <span className="text-sm font-medium">Overall Sentiment</span>
                      <span className="text-sm font-medium">{Math.round(item.sentiment.overall * 100)}%</span>
                    </div>
                    <Progress 
                      value={item.sentiment.overall * 100} 
                      className={
                        item.sentiment.overall > 0.75 ? 'bg-green-200' : 
                        item.sentiment.overall > 0.5 ? 'bg-amber-200' : 
                        'bg-red-200'
                      } 
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold">Common Themes</h4>
                    <div className="flex flex-wrap gap-2">
                      {item.sentiment.keywords.map((keyword: string) => (
                        <span 
                          key={keyword} 
                          className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold">SWOT Analysis</h4>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/20">
                        <h5 className="font-medium text-green-700 dark:text-green-400 mb-2">Strengths</h5>
                        <ul className="space-y-1 text-green-600 dark:text-green-300">
                          {detailedAnalysis.strengths.map((item: string, i: number) => (
                            <li key={i} className="list-disc list-inside">{item}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20">
                        <h5 className="font-medium text-red-700 dark:text-red-400 mb-2">Weaknesses</h5>
                        <ul className="space-y-1 text-red-600 dark:text-red-300">
                          {detailedAnalysis.weaknesses.map((item: string, i: number) => (
                            <li key={i} className="list-disc list-inside">{item}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20">
                        <h5 className="font-medium text-blue-700 dark:text-blue-400 mb-2">Opportunities</h5>
                        <ul className="space-y-1 text-blue-600 dark:text-blue-300">
                          {detailedAnalysis.opportunities.map((item: string, i: number) => (
                            <li key={i} className="list-disc list-inside">{item}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20">
                        <h5 className="font-medium text-amber-700 dark:text-amber-400 mb-2">Recommendations</h5>
                        <ul className="space-y-1 text-amber-600 dark:text-amber-300">
                          {detailedAnalysis.recommendations.map((item: string, i: number) => (
                            <li key={i} className="list-disc list-inside">{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <h4 className="text-sm font-semibold">Sentiment by Demographics</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={demographicData}
                        margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis dataKey="group" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip formatter={(value) => [`${value}%`, 'Sentiment Score']} />
                        <Bar dataKey="score" fill="hsl(var(--primary))" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart outerRadius={90} data={radarData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="metric" />
                        <PolarRadiusAxis domain={[0, 100]} />
                        <Radar
                          name="Score"
                          dataKey="score"
                          stroke="hsl(var(--primary))"
                          fill="hsl(var(--primary))"
                          fillOpacity={0.6}
                        />
                        <Tooltip formatter={(value) => [`${value}%`, 'Score']} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card className="glass-card">
              <CardHeader className="pb-3">
                <CardTitle>Sales & Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-4 rounded-lg bg-secondary">
                    <Users className="w-5 h-5 mx-auto mb-1" />
                    <div className="text-2xl font-bold">{item.sales}</div>
                    <div className="text-sm text-muted-foreground">Total Sales</div>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-secondary">
                    <ChefHat className="w-5 h-5 mx-auto mb-1" />
                    <div className="text-2xl font-bold">{item.rating.toFixed(1)}</div>
                    <div className="text-sm text-muted-foreground">Rating</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold">Financial Metrics</h4>
                  
                  <div className="bg-primary/5 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Item Price</span>
                      <span className="font-medium">${item.price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Item Cost</span>
                      <span className="font-medium">${item.cost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Profit per Item</span>
                      <span className="font-medium">${profit.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Profit Margin</span>
                      <span className="font-medium">{profitMargin}%</span>
                    </div>
                    
                    <div className="h-px bg-primary/10 my-2"></div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm">Total Revenue</span>
                      <span className="font-medium">${totalRevenue.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Total Cost</span>
                      <span className="font-medium">${totalCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-semibold">Total Profit</span>
                      <span className="font-semibold">${totalProfit.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold">Demographics Appeal</h4>
                  
                  <div className="space-y-2">
                    {Object.entries(item.sentiment.byAgeGroup).map(([group, score]) => (
                      <div key={group} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{group}</span>
                          <span>{Math.round((score as number) * 100)}%</span>
                        </div>
                        <div className="h-2 bg-primary/10 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${(score as number) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default MenuItemDetail;
