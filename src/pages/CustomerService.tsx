
import { useState, useEffect } from "react";
import MainLayout from "@/components/MainLayout";
import { getCustomerServiceData, getEmployeeProductivityData } from "@/services/dataService";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from "recharts";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  Award, 
  AlertTriangle 
} from "lucide-react";

const CustomerService = () => {
  const [serviceData, setServiceData] = useState<any>(null);
  const [productivityData, setProductivityData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const csData = await getCustomerServiceData();
        const empData = await getEmployeeProductivityData();
        
        setServiceData(csData);
        setProductivityData(empData);
      } catch (error) {
        console.error('Error fetching service data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

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

  // Helper function to generate a component with trend indicator
  const TrendIndicator = ({ current, previous, reversed = false }: { current: number, previous: number, reversed?: boolean }) => {
    const diff = current - previous;
    const isPositive = !reversed ? diff > 0 : diff < 0;
    
    return (
      <div className="flex items-center">
        {isPositive ? (
          <>
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-500 text-sm font-medium">+{Math.abs(diff).toFixed(1)}%</span>
          </>
        ) : (
          <>
            <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
            <span className="text-red-500 text-sm font-medium">-{Math.abs(diff).toFixed(1)}%</span>
          </>
        )}
      </div>
    );
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
        <h1 className="text-3xl font-bold tracking-tight">Customer Service & Productivity</h1>
        
        <Tabs defaultValue="service" className="w-full">
          <TabsList>
            <TabsTrigger value="service">Customer Service</TabsTrigger>
            <TabsTrigger value="productivity">Employee Productivity</TabsTrigger>
          </TabsList>
          
          <TabsContent value="service" className="space-y-8 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="glass-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Overall Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-3xl font-bold">{serviceData.score}%</div>
                      <TrendIndicator current={serviceData.score} previous={serviceData.previousScore} />
                    </div>
                    <div className={`text-2xl font-bold ${serviceData.score >= 90 ? 'text-green-500' : serviceData.score >= 80 ? 'text-amber-500' : 'text-red-500'}`}>
                      {serviceData.score >= 90 ? 'A' : serviceData.score >= 80 ? 'B' : serviceData.score >= 70 ? 'C' : 'D'}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass-card col-span-3">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Daily Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={serviceData.metricsByHour}
                        margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis 
                          dataKey="hour" 
                          tickFormatter={(hour) => `${hour}:00`}
                          style={{ fontSize: '12px' }}
                        />
                        <YAxis 
                          domain={[75, 100]} 
                          style={{ fontSize: '12px' }}
                          tickFormatter={(value) => `${value}%`}
                        />
                        <Tooltip 
                          formatter={(value) => [`${value}%`, 'Satisfaction']}
                          labelFormatter={(hour) => `${hour}:00`}
                        />
                        <Line
                          type="monotone"
                          dataKey="score"
                          stroke="hsl(var(--primary))"
                          strokeWidth={2}
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Improvement Areas</CardTitle>
                  <CardDescription>Service aspects that need attention</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {serviceData.improvementAreas.map((area: any) => (
                    <div key={area.area} className="space-y-2">
                      <div className="flex justify-between">
                        <p className="text-sm font-medium">{area.area}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant={area.score < 80 ? "destructive" : area.score < 90 ? "outline" : "default"}>
                            {area.score}%
                          </Badge>
                        </div>
                      </div>
                      <Progress 
                        value={area.score} 
                        className={
                          area.score >= 90 ? 'bg-green-200' : 
                          area.score >= 80 ? 'bg-amber-200' : 
                          'bg-red-200'
                        } 
                      />
                      <p className="text-sm text-muted-foreground">
                        {area.score < 80 
                          ? 'Requires immediate attention' 
                          : area.score < 90 
                            ? 'Needs improvement' 
                            : 'Good performance'}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
              
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Top Performers</CardTitle>
                  <CardDescription>Customer service excellence</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {serviceData.topPerformers.map((performer: any, index: number) => (
                      <div key={performer.name} className="flex items-center">
                        <div className="relative mr-4">
                          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-primary text-primary-foreground font-bold">
                            {performer.name.split(' ').map((n: string) => n[0]).join('')}
                          </div>
                          {index === 0 && (
                            <div className="absolute -top-2 -right-2 bg-amber-500 text-white p-1 rounded-full">
                              <Award className="w-3 h-3" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{performer.name}</p>
                          <div className="flex items-center mt-1">
                            <Progress value={performer.score} className="flex-1 h-2 bg-green-200" />
                            <span className="ml-2 text-sm font-medium">{performer.score}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-8 p-4 bg-primary/5 rounded-lg">
                    <h4 className="font-semibold text-sm mb-2">Today's Recommendations</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <AlertTriangle className="w-4 h-4 text-amber-500 mr-2 mt-0.5 shrink-0" />
                        <span>Focus on reducing wait times during peak hours (12-1 PM)</span>
                      </li>
                      <li className="flex items-start">
                        <AlertTriangle className="w-4 h-4 text-amber-500 mr-2 mt-0.5 shrink-0" />
                        <span>Implement follow-up procedure for customer complaints</span>
                      </li>
                      <li className="flex items-start">
                        <TrendingUp className="w-4 h-4 text-green-500 mr-2 mt-0.5 shrink-0" />
                        <span>Continue excellent performance in friendliness metrics</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="productivity" className="space-y-8 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="glass-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Overall Productivity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-3xl font-bold">{productivityData.overall}%</div>
                      <TrendIndicator 
                        current={productivityData.overall} 
                        previous={productivityData.previousPeriod} 
                      />
                    </div>
                    <div className={`text-2xl font-bold ${productivityData.overall >= 90 ? 'text-green-500' : productivityData.overall >= 80 ? 'text-amber-500' : 'text-red-500'}`}>
                      {productivityData.overall >= 90 ? 'A' : productivityData.overall >= 80 ? 'B' : productivityData.overall >= 70 ? 'C' : 'D'}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass-card col-span-3">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Department Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={productivityData.byDepartment}
                        margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis dataKey="department" />
                        <YAxis domain={[50, 100]} tickFormatter={(value) => `${value}%`} />
                        <Tooltip formatter={(value) => [`${value}%`, 'Productivity']} />
                        <Bar dataKey="score" fill="hsl(var(--primary))">
                          {productivityData.byDepartment.map((entry: any, index: number) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={entry.score >= 90 ? '#3FD7A2' : entry.score >= 80 ? '#FFB23F' : '#FF4A3F'} 
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Department Analysis</CardTitle>
                  <CardDescription>Productivity by team with change indicators</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {productivityData.byDepartment.map((dept: any) => (
                    <div key={dept.department} className="space-y-2">
                      <div className="flex justify-between">
                        <p className="text-sm font-medium">{dept.department}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant={dept.score < 80 ? "destructive" : dept.score < 90 ? "outline" : "default"}>
                            {dept.score}%
                          </Badge>
                          <span className={`text-xs ${dept.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {dept.change >= 0 ? `+${dept.change}%` : `${dept.change}%`}
                          </span>
                        </div>
                      </div>
                      <Progress 
                        value={dept.score} 
                        className={
                          dept.score >= 90 ? 'bg-green-200' : 
                          dept.score >= 80 ? 'bg-amber-200' : 
                          'bg-red-200'
                        } 
                      />
                      <p className="text-sm text-muted-foreground">
                        {dept.change >= 2 
                          ? 'Significant improvement from last period' 
                          : dept.change >= 0 
                            ? 'Slight improvement from last period' 
                            : 'Declined from last period'}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
              
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Top Employees</CardTitle>
                  <CardDescription>Highest productivity performers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {productivityData.topEmployees.map((employee: any, index: number) => (
                      <div key={employee.name} className="flex items-center">
                        <div className="relative mr-4">
                          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-primary text-primary-foreground font-bold">
                            {employee.name.split(' ').map((n: string) => n[0]).join('')}
                          </div>
                          {index === 0 && (
                            <div className="absolute -top-2 -right-2 bg-amber-500 text-white p-1 rounded-full">
                              <Award className="w-3 h-3" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <p className="font-medium">{employee.name}</p>
                            <p className="text-sm text-muted-foreground">{employee.department}</p>
                          </div>
                          <div className="flex items-center mt-1">
                            <Progress value={employee.score} className="flex-1 h-2 bg-green-200" />
                            <span className="ml-2 text-sm font-medium">{employee.score}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-8 p-4 bg-primary/5 rounded-lg">
                    <h4 className="font-semibold text-sm mb-2">Productivity Action Items</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <AlertTriangle className="w-4 h-4 text-amber-500 mr-2 mt-0.5 shrink-0" />
                        <span>Schedule productivity workshop for Cleaning department</span>
                      </li>
                      <li className="flex items-start">
                        <AlertTriangle className="w-4 h-4 text-amber-500 mr-2 mt-0.5 shrink-0" />
                        <span>Review task allocation in Service department</span>
                      </li>
                      <li className="flex items-start">
                        <TrendingUp className="w-4 h-4 text-green-500 mr-2 mt-0.5 shrink-0" />
                        <span>Document Kitchen team's process improvements for sharing</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default CustomerService;
