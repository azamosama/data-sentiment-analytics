
import { useState, useEffect } from "react";
import MainLayout from "@/components/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate, useLocation } from "react-router-dom";
import { processNaturalLanguageQuery, MenuItem, InventoryItem } from "@/services/dataService";
import MenuItemCard from "@/components/MenuItemCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table,
  TableBody,
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip } from "recharts";
import { getInventoryStatus } from "@/services/dataService";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Search = () => {
  const query = useQuery().get('q') || '';
  const [results, setResults] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;
      
      setLoading(true);
      try {
        const data = await processNaturalLanguageQuery(query);
        setResults(data);
      } catch (error) {
        console.error('Error searching:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchResults();
  }, [query]);

  // Helper function to render appropriate result components based on search type
  const renderResults = () => {
    if (loading) {
      return (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (!results) {
      return (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Enter a search query to see results</p>
        </div>
      );
    }

    switch (results.type) {
      case 'salesAnalysis':
        return (
          <div className="space-y-6">
            <div className="bg-muted/50 rounded-lg p-4 border border-border">
              <h3 className="text-lg font-medium mb-2">Insights</h3>
              <ul className="space-y-2 list-disc pl-5">
                {results.insights.map((insight: string, i: number) => (
                  <li key={i} className="text-sm">{insight}</li>
                ))}
              </ul>
            </div>

            <h3 className="text-lg font-medium">Lowest Performing Items</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {results.data.map((item: MenuItem) => (
                <MenuItemCard 
                  key={item.id} 
                  item={item} 
                  onClick={() => navigate(`/menu/${item.id}`)}
                />
              ))}
            </div>
            
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={results.data.map((item: MenuItem) => ({ 
                name: item.name, 
                sales: item.sales,
                sentiment: Math.round(item.sentiment.overall * 100)
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
      
      case 'inventoryStatus':
        return (
          <div className="space-y-6">
            <div className="bg-muted/50 rounded-lg p-4 border border-border">
              <h3 className="text-lg font-medium mb-2">Inventory Alert</h3>
              <p>{results.explanation}</p>
              {results.criticalNames && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {results.criticalNames.map((name: string) => (
                    <Badge key={name} variant="destructive">{name}</Badge>
                  ))}
                </div>
              )}
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Current Stock</TableHead>
                  <TableHead>Min Required</TableHead>
                  <TableHead>Usage Rate</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.data.map((item: InventoryItem) => {
                  const status = getInventoryStatus(item);
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{item.currentStock}</TableCell>
                      <TableCell>{item.minRequired}</TableCell>
                      <TableCell>{item.usageRate}/day</TableCell>
                      <TableCell>
                        <Badge 
                          className={
                            status === 'urgent' ? 'bg-red-500' : 
                            status === 'warning' ? 'bg-yellow-500' : 
                            'bg-green-500'
                          }
                        >
                          {status === 'urgent' ? 'Critical' : 
                           status === 'warning' ? 'Low' : 'Normal'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        );
      
      case 'demographicPreference':
        return (
          <div className="space-y-6">
            <div className="bg-muted/50 rounded-lg p-4 border border-border">
              <h3 className="text-lg font-medium mb-2">Demographic Analysis: {results.demographic}</h3>
              <p>{results.explanation}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {results.data.map((item: MenuItem) => (
                <MenuItemCard 
                  key={item.id} 
                  item={item} 
                  onClick={() => navigate(`/menu/${item.id}`)}
                />
              ))}
            </div>
          </div>
        );
      
      case 'customerService':
      case 'employeeProductivity':
        // Rendering for service and productivity results
        return (
          <div className="space-y-6">
            <div className="bg-muted/50 rounded-lg p-4 border border-border">
              <h3 className="text-lg font-medium mb-2">{results.type === 'customerService' ? 'Customer Service Analysis' : 'Employee Productivity'}</h3>
              <p>{results.explanation}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.type === 'customerService' && (
                <>
                  <Card>
                    <CardContent className="pt-6">
                      <h4 className="font-medium mb-4">Areas for Improvement</h4>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Area</TableHead>
                            <TableHead className="text-right">Score</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {results.data.improvementAreas.map((area: { area: string, score: number }) => (
                            <TableRow key={area.area}>
                              <TableCell>{area.area}</TableCell>
                              <TableCell className="text-right">{area.score}%</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <h4 className="font-medium mb-4">Top Performers</h4>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead className="text-right">Score</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {results.data.topPerformers.map((person: { name: string, score: number }) => (
                            <TableRow key={person.name}>
                              <TableCell>{person.name}</TableCell>
                              <TableCell className="text-right">{person.score}%</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </>
              )}
              
              {results.type === 'employeeProductivity' && (
                <>
                  <Card>
                    <CardContent className="pt-6">
                      <h4 className="font-medium mb-4">Department Performance</h4>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Department</TableHead>
                            <TableHead className="text-right">Score</TableHead>
                            <TableHead className="text-right">Change</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {results.data.byDepartment.map((dept: { department: string, score: number, change: number }) => (
                            <TableRow key={dept.department}>
                              <TableCell>{dept.department}</TableCell>
                              <TableCell className="text-right">{dept.score}%</TableCell>
                              <TableCell className={`text-right ${dept.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {dept.change > 0 ? '+' : ''}{dept.change}%
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <h4 className="font-medium mb-4">Top Employees</h4>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Department</TableHead>
                            <TableHead className="text-right">Score</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {results.data.topEmployees.map((person: { name: string, department: string, score: number }) => (
                            <TableRow key={person.name}>
                              <TableCell>{person.name}</TableCell>
                              <TableCell>{person.department}</TableCell>
                              <TableCell className="text-right">{person.score}%</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </div>
        );
      
      case 'generalSearch':
        return (
          <Tabs defaultValue="menu">
            <TabsList>
              <TabsTrigger value="menu">Menu Items ({results.data.menuItems.length})</TabsTrigger>
              <TabsTrigger value="inventory">Inventory ({results.data.inventory.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="menu" className="space-y-6 mt-4">
              {results.data.menuItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {results.data.menuItems.map((item: MenuItem) => (
                    <MenuItemCard 
                      key={item.id} 
                      item={item} 
                      onClick={() => navigate(`/menu/${item.id}`)}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No menu items found matching your search.</p>
              )}
            </TabsContent>
            
            <TabsContent value="inventory" className="space-y-6 mt-4">
              {results.data.inventory.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Current Stock</TableHead>
                      <TableHead>Min Required</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.data.inventory.map((item: InventoryItem) => {
                      const status = getInventoryStatus(item);
                      return (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>{item.category}</TableCell>
                          <TableCell>{item.currentStock}</TableCell>
                          <TableCell>{item.minRequired}</TableCell>
                          <TableCell>
                            <Badge 
                              className={
                                status === 'urgent' ? 'bg-red-500' : 
                                status === 'warning' ? 'bg-yellow-500' : 
                                'bg-green-500'
                              }
                            >
                              {status === 'urgent' ? 'Critical' : 
                               status === 'warning' ? 'Low' : 'Normal'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground">No inventory items found matching your search.</p>
              )}
            </TabsContent>
          </Tabs>
        );
      
      default:
        return (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No results found for "{query}"</p>
          </div>
        );
    }
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Search Results</h1>
          <p className="text-muted-foreground">
            {query ? `Results for "${query}"` : 'Enter a search query above'}
          </p>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            {renderResults()}
          </CardContent>
        </Card>
        
        {results && (
          <div className="text-sm text-muted-foreground">
            <p>Try asking things like:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>"Show me the lowest performing menu items"</li>
              <li>"What inventory items need urgent attention?"</li>
              <li>"Show me menu items popular with Gen Z"</li>
              <li>"Show me customer service performance"</li>
            </ul>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Search;
