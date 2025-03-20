import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import MainLayout from "@/components/MainLayout";
import SearchBar from "@/components/SearchBar";
import MenuItemCard from "@/components/MenuItemCard";
import InventoryStatusCard from "@/components/InventoryStatusCard";
import { useNavigate } from "react-router-dom";
import { processNaturalLanguageQuery } from "@/services/dataService";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart,
  Bar, 
  LineChart,
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { Button } from "@/components/ui/button";
import { 
  Search as SearchIcon, 
  TrendingUp,
  TrendingDown,
  MessageSquare, 
  Lightbulb,
  BarChart3,
  ChefHat,
  Package,
  Users
} from "lucide-react";

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([
    "Show me the lowest performing menu items",
    "Which items are popular with Gen Z?",
    "What inventory items need urgent attention?",
    "Show me customer service metrics",
    "What's our employee productivity today?"
  ]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedHistory = localStorage.getItem('searchHistory');
    if (storedHistory) {
      setSearchHistory(JSON.parse(storedHistory));
    }
    
    const initialQuery = searchParams.get('q');
    if (initialQuery) {
      setQuery(initialQuery);
      performSearch(initialQuery);
    }
  }, []);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const data = await processNaturalLanguageQuery(searchQuery);
      setResults(data);
      
      const newHistory = [searchQuery, ...searchHistory.filter(q => q !== searchQuery)].slice(0, 5);
      setSearchHistory(newHistory);
      localStorage.setItem('searchHistory', JSON.stringify(newHistory));
      
      setSearchParams({ q: searchQuery });
    } catch (error) {
      console.error('Error processing search query:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    performSearch(searchQuery);
  };

  const renderResults = () => {
    if (!results) return null;
    
    switch (results.type) {
      case 'menuPerformance':
        return (
          <div className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <ChefHat className="w-5 h-5 text-primary" />
                  <CardTitle>Menu Performance Results</CardTitle>
                </div>
                <CardDescription>{results.explanation}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.data.map((item: any) => (
                    <MenuItemCard 
                      key={item.id} 
                      item={item} 
                      onClick={() => navigate(`/menu/${item.id}`)}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );
        
      case 'demographicPreference':
        return (
          <div className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  <CardTitle>{results.demographic} Preferences</CardTitle>
                </div>
                <CardDescription>{results.explanation}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.data.map((item: any) => (
                    <MenuItemCard 
                      key={item.id} 
                      item={item} 
                      onClick={() => navigate(`/menu/${item.id}`)}
                    />
                  ))}
                </div>
                
                <div className="mt-8 p-5 bg-primary/5 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">Key Insights</h3>
                  <div className="space-y-4">
                    <p className="text-sm">
                      {results.demographic} customers show a strong preference for {results.data[0].name} 
                      with a sentiment score of {Math.round(results.data[0].sentiment.byAgeGroup[results.demographic] * 100)}%.
                    </p>
                    <p className="text-sm">
                      Common keywords associated with their favorite items include:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {results.data[0].sentiment.keywords.map((keyword: string) => (
                        <span key={keyword} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs">
                          {keyword}
                        </span>
                      ))}
                    </div>
                    <div className="pt-4">
                      <h4 className="text-sm font-semibold mb-2">Recommendations</h4>
                      <ul className="space-y-2 list-disc pl-5 text-sm">
                        <li>Consider promoting {results.data[0].name} in targeted marketing to {results.demographic}</li>
                        <li>Explore menu variations that incorporate popular keywords</li>
                        <li>Create special combos featuring these top items</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
        
      case 'inventoryStatus':
        return (
          <div className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" />
                  <CardTitle>Inventory Status</CardTitle>
                </div>
                <CardDescription>{results.explanation}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.data.map((item: any) => (
                    <InventoryStatusCard key={item.id} item={item} />
                  ))}
                </div>
                
                {results.data.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No urgent inventory items at the moment.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );
        
      case 'customerService':
        return (
          <div className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  <CardTitle>Customer Service Performance</CardTitle>
                </div>
                <CardDescription>{results.explanation}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex justify-between items-end mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Today's Score</p>
                        <p className="text-4xl font-bold">{results.data.score}%</p>
                      </div>
                      
                      <div className="flex items-center text-sm">
                        {results.data.score > results.data.previousScore ? (
                          <>
                            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                            <span className="text-green-500">
                              +{(results.data.score - results.data.previousScore).toFixed(1)}%
                            </span>
                          </>
                        ) : (
                          <>
                            <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                            <span className="text-red-500">
                              {(results.data.score - results.data.previousScore).toFixed(1)}%
                            </span>
                          </>
                        )}
                        <span className="text-muted-foreground ml-1">vs. yesterday</span>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="text-sm font-semibold">Improvement Areas</h4>
                      {results.data.improvementAreas.map((area: any) => (
                        <div key={area.area} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{area.area}</span>
                            <span className="font-medium">{area.score}%</span>
                          </div>
                          <Progress 
                            value={area.score} 
                            className={area.score < 80 ? 'bg-red-200' : area.score < 90 ? 'bg-amber-200' : 'bg-green-200'} 
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="h-72">
                    <h4 className="text-sm font-semibold mb-2">Today's Performance by Hour</h4>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={results.data.metricsByHour}
                        margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis 
                          dataKey="hour" 
                          tickFormatter={(hour) => `${hour}:00`}
                          style={{ fontSize: '12px' }}
                        />
                        <YAxis 
                          domain={[70, 100]} 
                          style={{ fontSize: '12px' }}
                          tickFormatter={(value) => `${value}%`}
                        />
                        <Tooltip 
                          formatter={(value) => [`${value}%`, 'Score']}
                          labelFormatter={(hour) => `${hour}:00`}
                        />
                        <Bar
                          dataKey="score"
                          fill="hsl(var(--primary))"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <Button 
                  className="mt-6" 
                  onClick={() => navigate('/service')}
                >
                  View Full Customer Service Report
                </Button>
              </CardContent>
            </Card>
          </div>
        );
        
      case 'employeeProductivity':
        return (
          <div className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  <CardTitle>Employee Productivity</CardTitle>
                </div>
                <CardDescription>{results.explanation}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex justify-between items-end mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Overall Productivity</p>
                        <p className="text-4xl font-bold">{results.data.overall}%</p>
                      </div>
                      
                      <div className="flex items-center text-sm">
                        {results.data.overall > results.data.previousPeriod ? (
                          <>
                            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                            <span className="text-green-500">
                              +{(results.data.overall - results.data.previousPeriod).toFixed(1)}%
                            </span>
                          </>
                        ) : (
                          <>
                            <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                            <span className="text-red-500">
                              {(results.data.overall - results.data.previousPeriod).toFixed(1)}%
                            </span>
                          </>
                        )}
                        <span className="text-muted-foreground ml-1">vs. last week</span>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="text-sm font-semibold">By Department</h4>
                      {results.data.byDepartment.map((dept: any) => (
                        <div key={dept.department} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{dept.department}</span>
                            <div className="flex items-center">
                              <span className="font-medium mr-2">{dept.score}%</span>
                              <span className={dept.change >= 0 ? 'text-green-500' : 'text-red-500'}>
                                {dept.change > 0 ? '+' : ''}{dept.change}%
                              </span>
                            </div>
                          </div>
                          <Progress 
                            value={dept.score} 
                            className={dept.score < 80 ? 'bg-red-200' : dept.score < 90 ? 'bg-amber-200' : 'bg-green-200'} 
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold mb-4">Top Performers</h4>
                    {results.data.topEmployees.map((employee: any, index: number) => (
                      <div key={employee.name} className="flex items-center mb-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-medium mr-3">
                          {employee.name.split(' ').map((n: string) => n[0]).join('')}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <p className="font-medium">{employee.name}</p>
                            <p className="text-sm">{employee.score}%</p>
                          </div>
                          <p className="text-sm text-muted-foreground">{employee.department}</p>
                        </div>
                      </div>
                    ))}
                    
                    <div className="mt-4 p-4 bg-primary/5 rounded-lg">
                      <h4 className="font-semibold text-sm mb-2">Key Insights</h4>
                      <ul className="space-y-2 list-disc pl-5 text-sm">
                        <li>{results.data.overall > results.data.previousPeriod ? 'Overall productivity is trending upward' : 'Overall productivity has declined slightly'}</li>
                        <li>The {results.data.byDepartment.reduce((highest: any, dept: any) => dept.score > highest.score ? dept : highest).department} department is performing best</li>
                        <li>The {results.data.byDepartment.reduce((lowest: any, dept: any) => dept.score < lowest.score ? dept : lowest).department} department needs attention</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <Button 
                  className="mt-6" 
                  onClick={() => navigate('/service')}
                >
                  View Full Productivity Report
                </Button>
              </CardContent>
            </Card>
          </div>
        );
        
      case 'generalSearch':
        return (
          <div className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <SearchIcon className="w-5 h-5 text-primary" />
                  <CardTitle>Search Results</CardTitle>
                </div>
                <CardDescription>{results.explanation}</CardDescription>
              </CardHeader>
              <CardContent>
                {results.data.menuItems && results.data.menuItems.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4">Menu Items</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {results.data.menuItems.map((item: any) => (
                        <MenuItemCard 
                          key={item.id} 
                          item={item} 
                          onClick={() => navigate(`/menu/${item.id}`)}
                        />
                      ))}
                    </div>
                  </div>
                )}
                
                {results.data.inventory && results.data.inventory.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Inventory Items</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {results.data.inventory.map((item: any) => (
                        <InventoryStatusCard key={item.id} item={item} />
                      ))}
                    </div>
                  </div>
                )}
                
                {(!results.data.menuItems || results.data.menuItems.length === 0) && 
                 (!results.data.inventory || results.data.inventory.length === 0) && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No results found for "{query}"</p>
                    <p className="text-sm text-muted-foreground mt-2">Try using one of the suggested queries below</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );
        
      case 'salesAnalysis':
        return (
          <div className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  <CardTitle>Sales Analysis</CardTitle>
                </div>
                <CardDescription>{results.explanation}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Key Findings</h3>
                    <div className="space-y-4 p-4 bg-primary/5 rounded-lg">
                      {results.insights && results.insights.map((insight: string, i: number) => (
                        <p key={i} className="text-sm">{insight}</p>
                      ))}
                      
                      {!results.insights && (
                        <p className="text-sm">Based on our analysis, sales performance is affected by several factors including pricing, customer preferences, and market trends.</p>
                      )}
                    </div>
                  </div>
                  
                  {results.data && results.data.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Related Items</h3>
                      <div className="space-y-4">
                        {results.data.map((item: any) => (
                          <div key={item.id} className="flex items-center p-3 border rounded-lg hover:bg-accent cursor-pointer" onClick={() => navigate(`/menu/${item.id}`)}>
                            <div className="mr-3">
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-muted-foreground">Sales: {item.sales} | Rating: {item.rating}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Recommendations</h3>
                  <ul className="space-y-2 list-disc pl-5 text-sm">
                    <li>Review pricing strategy for underperforming items</li>
                    <li>Consider promotional campaigns for items with good margins but low sales</li>
                    <li>Analyze customer feedback for improvement opportunities</li>
                    <li>Evaluate menu placement and presentation of low-performing items</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        );
        
      default:
        return (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No results found</p>
          </div>
        );
    }
  };

  return (
    <MainLayout showSearchBar={false}>
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
        <h1 className="text-3xl font-bold tracking-tight">Search & Analysis</h1>
        
        <div className="flex justify-center">
          <SearchBar 
            onSearch={handleSearch} 
            placeholder="Ask a question or search by keyword..."
            className="max-w-3xl w-full"
          />
        </div>
        
        {!results && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  <CardTitle>Suggested Queries</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {suggestions.map((suggestion, index) => (
                    <Button 
                      key={index}
                      variant="outline"
                      className="w-full justify-start text-left h-auto py-3"
                      onClick={() => handleSearch(suggestion)}
                    >
                      <SearchIcon className="w-4 h-4 mr-2 text-muted-foreground" />
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {searchHistory.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-primary" />
                    <CardTitle>Recent Searches</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {searchHistory.map((historyItem, index) => (
                      <Button 
                        key={index}
                        variant="ghost"
                        className="w-full justify-start text-left h-auto py-3"
                        onClick={() => handleSearch(historyItem)}
                      >
                        <SearchIcon className="w-4 h-4 mr-2 text-muted-foreground" />
                        {historyItem}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
        
        {loading ? (
          <div className="animate-pulse space-y-8 max-w-7xl mx-auto">
            <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-48 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
              <div className="h-48 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
            </div>
          </div>
        ) : (
          renderResults()
        )}
        
        {results && (
          <div className="mt-8 flex justify-center">
            <Button variant="outline" onClick={() => setResults(null)}>
              New Search
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Search;
