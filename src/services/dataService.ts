export interface MenuItem {
  id: number;
  name: string;
  category: string;
  price: number;
  cost: number;
  sales: number;
  rating: number;
  sentiment: {
    overall: number;
    byAgeGroup: {
      'Gen Z': number;
      'Millennials': number;
      'Gen X': number;
      'Boomers': number;
    };
    keywords: string[];
  };
  image: string;
}

export interface CustomerServiceData {
  score: number;
  previousScore: number;
  improvementAreas: { area: string; score: number }[];
  topPerformers: { name: string; score: number }[];
  metricsByHour: { hour: number; score: number }[];
}

export interface EmployeeProductivityData {
  overall: number;
  previousPeriod: number;
  byDepartment: { department: string; score: number; change: number }[];
  topEmployees: { name: string; department: string; score: number }[];
}

export interface InventoryItem {
  id: number;
  name: string;
  category: string;
  currentStock: number;
  minRequired: number;
  optimalStock: number;
  usageRate: number;
  supplierLeadTime: number;
  lastOrdered: string;
  price: number;
}

export interface KpiData {
  revenue: {
    value: number;
    change: number;
  };
  customerSatisfaction: {
    value: number;
    change: number;
  };
  employeeProductivity: {
    value: number;
    change: number;
  };
  inventoryHealth: {
    value: number;
    change: number;
  };
}

export interface Shipment {
  id: string;
  supplier: string;
  items: { name: string; quantity: number }[];
  estimatedArrival: string;
  arrived: boolean;
}

// Mock data for menu items
const menuItems: MenuItem[] = [
  {
    id: 1,
    name: "Chick-In Maple",
    category: "Signature Waffles",
    price: 9.99,
    cost: 3.50,
    sales: 430,
    rating: 4.2,
    sentiment: {
      overall: 0.76,
      byAgeGroup: {
        'Gen Z': 0.65,
        'Millennials': 0.82,
        'Gen X': 0.78,
        'Boomers': 0.75,
      },
      keywords: ["juicy", "filling", "overpriced", "consistent"]
    },
    image: "/placeholder.svg"
  },
  {
    id: 2,
    name: "Spicy Chick",
    category: "Signature Waffles",
    price: 8.99,
    cost: 3.20,
    sales: 310,
    rating: 3.8,
    sentiment: {
      overall: 0.62,
      byAgeGroup: {
        'Gen Z': 0.55,
        'Millennials': 0.63,
        'Gen X': 0.67,
        'Boomers': 0.70,
      },
      keywords: ["dry", "plain", "healthy", "quick"]
    },
    image: "/placeholder.svg"
  },
  {
    id: 3,
    name: "Chick-In Queso",
    category: "Signature Waffles",
    price: 7.99,
    cost: 2.80,
    sales: 380,
    rating: 4.5,
    sentiment: {
      overall: 0.88,
      byAgeGroup: {
        'Gen Z': 0.92,
        'Millennials': 0.90,
        'Gen X': 0.75,
        'Boomers': 0.65,
      },
      keywords: ["fresh", "healthy", "expensive", "trendy"]
    },
    image: "/placeholder.svg"
  },
  {
    id: 4,
    name: "Chick-In Fries",
    category: "Loaded Fries",
    price: 8.49,
    cost: 2.50,
    sales: 250,
    rating: 4.0,
    sentiment: {
      overall: 0.71,
      byAgeGroup: {
        'Gen Z': 0.60,
        'Millennials': 0.75,
        'Gen X': 0.80,
        'Boomers': 0.78,
      },
      keywords: ["fresh", "light", "more dressing", "crisp"]
    },
    image: "/placeholder.svg"
  },
  {
    id: 5,
    name: "Asian Chili Fries",
    category: "Loaded Fries",
    price: 11.99,
    cost: 4.20,
    sales: 420,
    rating: 4.7,
    sentiment: {
      overall: 0.89,
      byAgeGroup: {
        'Gen Z': 0.95,
        'Millennials': 0.88,
        'Gen X': 0.75,
        'Boomers': 0.68,
      },
      keywords: ["authentic", "spicy", "flavorful", "filling"]
    },
    image: "/placeholder.svg"
  },
  {
    id: 6,
    name: "Nashville Hot Fries",
    category: "Loaded Fries",
    price: 12.99,
    cost: 4.50,
    sales: 390,
    rating: 4.4,
    sentiment: {
      overall: 0.82,
      byAgeGroup: {
        'Gen Z': 0.80,
        'Millennials': 0.85,
        'Gen X': 0.82,
        'Boomers': 0.79,
      },
      keywords: ["classic", "cheesy", "simple", "satisfying"]
    },
    image: "/placeholder.svg"
  },
  {
    id: 7,
    name: "Buffalo Sandwich Meal",
    category: "Chick-In Buns",
    price: 10.49,
    cost: 3.80,
    sales: 280,
    rating: 4.3,
    sentiment: {
      overall: 0.78,
      byAgeGroup: {
        'Gen Z': 0.77,
        'Millennials': 0.82,
        'Gen X': 0.75,
        'Boomers': 0.72,
      },
      keywords: ["fresh", "zesty", "light", "flavorful"]
    },
    image: "/placeholder.svg"
  },
  {
    id: 8,
    name: "Classic Sandwich Meal",
    category: "Chick-In Buns",
    price: 6.99,
    cost: 2.20,
    sales: 200,
    rating: 4.6,
    sentiment: {
      overall: 0.86,
      byAgeGroup: {
        'Gen Z': 0.90,
        'Millennials': 0.88,
        'Gen X': 0.85,
        'Boomers': 0.82,
      },
      keywords: ["rich", "decadent", "moist", "sweet"]
    },
    image: "/placeholder.svg"
  },
  {
    id: 9,
    name: "Garlic Parmesan Sandwich Meal",
    category: "Chick-In Buns",
    price: 9.49,
    cost: 3.30,
    sales: 220,
    rating: 4.1,
    sentiment: {
      overall: 0.74,
      byAgeGroup: {
        'Gen Z': 0.78,
        'Millennials': 0.80,
        'Gen X': 0.70,
        'Boomers': 0.62,
      },
      keywords: ["healthy", "fresh", "bland", "overpriced"]
    },
    image: "/placeholder.svg"
  },
  {
    id: 10,
    name: "Boneless Wing Meal",
    category: "Wings",
    price: 18.99,
    cost: 8.50,
    sales: 150,
    rating: 4.5,
    sentiment: {
      overall: 0.83,
      byAgeGroup: {
        'Gen Z': 0.70,
        'Millennials': 0.82,
        'Gen X': 0.90,
        'Boomers': 0.88,
      },
      keywords: ["premium", "tender", "expensive", "satisfying"]
    },
    image: "/placeholder.svg"
  }
];

// Mock data for customer service
const customerServiceData: CustomerServiceData = {
  score: 90,
  previousScore: 87,
  improvementAreas: [
    { area: "Wait Time", score: 78 },
    { area: "Friendliness", score: 92 },
    { area: "Issue Resolution", score: 85 },
    { area: "Follow-up", score: 81 }
  ],
  topPerformers: [
    { name: "Sarah Johnson", score: 98 },
    { name: "Michael Chen", score: 96 },
    { name: "David Garcia", score: 95 }
  ],
  metricsByHour: [
    { hour: 8, score: 92 },
    { hour: 9, score: 90 },
    { hour: 10, score: 93 },
    { hour: 11, score: 91 },
    { hour: 12, score: 86 },
    { hour: 13, score: 84 },
    { hour: 14, score: 89 },
    { hour: 15, score: 92 },
    { hour: 16, score: 94 },
    { hour: 17, score: 95 },
    { hour: 18, score: 93 },
    { hour: 19, score: 91 },
    { hour: 20, score: 90 }
  ]
};

// Mock data for employee productivity
const employeeProductivityData: EmployeeProductivityData = {
  overall: 83,
  previousPeriod: 81,
  byDepartment: [
    { department: "Kitchen", score: 86, change: 2 },
    { department: "Service", score: 84, change: 3 },
    { department: "Management", score: 90, change: 1 },
    { department: "Cleaning", score: 82, change: -1 }
  ],
  topEmployees: [
    { name: "Jessica Wu", department: "Kitchen", score: 97 },
    { name: "Robert Smith", department: "Management", score: 96 },
    { name: "Elena Rodriguez", department: "Service", score: 95 }
  ]
};

// Mock data for inventory items
const inventoryItems: InventoryItem[] = [
  {
    id: 1,
    name: "Chicken Breast",
    category: "Proteins",
    currentStock: 10,
    minRequired: 15,
    optimalStock: 30,
    usageRate: 5,
    supplierLeadTime: 2,
    lastOrdered: "2023-05-15",
    price: 4.99
  },
  {
    id: 2,
    name: "Waffle Mix",
    category: "Dry Goods",
    currentStock: 8,
    minRequired: 12,
    optimalStock: 25,
    usageRate: 4,
    supplierLeadTime: 2,
    lastOrdered: "2023-05-16",
    price: 5.99
  },
  {
    id: 3,
    name: "Maple Syrup",
    category: "Condiments",
    currentStock: 5,
    minRequired: 8,
    optimalStock: 15,
    usageRate: 3,
    supplierLeadTime: 1,
    lastOrdered: "2023-05-17",
    price: 1.99
  },
  {
    id: 4,
    name: "French Fries",
    category: "Frozen Foods",
    currentStock: 20,
    minRequired: 10,
    optimalStock: 20,
    usageRate: 3,
    supplierLeadTime: 1,
    lastOrdered: "2023-05-16",
    price: 2.49
  },
  {
    id: 5,
    name: "Hot Sauce",
    category: "Condiments",
    currentStock: 25,
    minRequired: 20,
    optimalStock: 40,
    usageRate: 8,
    supplierLeadTime: 1,
    lastOrdered: "2023-05-15",
    price: 3.99
  },
  {
    id: 6,
    name: "Cheese Blend",
    category: "Dairy",
    currentStock: 35,
    minRequired: 30,
    optimalStock: 60,
    usageRate: 10,
    supplierLeadTime: 2,
    lastOrdered: "2023-05-14",
    price: 4.99
  },
  {
    id: 7,
    name: "Brioche Buns",
    category: "Bakery",
    currentStock: 8,
    minRequired: 5,
    optimalStock: 12,
    usageRate: 1,
    supplierLeadTime: 3,
    lastOrdered: "2023-05-10",
    price: 2.99
  },
  {
    id: 8,
    name: "Lettuce",
    category: "Produce",
    currentStock: 18,
    minRequired: 15,
    optimalStock: 30,
    usageRate: 6,
    supplierLeadTime: 2,
    lastOrdered: "2023-05-12",
    price: 6.99
  },
  {
    id: 9,
    name: "Tomatoes",
    category: "Produce",
    currentStock: 25,
    minRequired: 15,
    optimalStock: 30,
    usageRate: 3,
    supplierLeadTime: 3,
    lastOrdered: "2023-05-08",
    price: 2.49
  },
  {
    id: 10,
    name: "Cooking Oil",
    category: "Dry Goods",
    currentStock: 150,
    minRequired: 100,
    optimalStock: 200,
    usageRate: 20,
    supplierLeadTime: 4,
    lastOrdered: "2023-05-05",
    price: 1.99
  },
  {
    id: 11,
    name: "Napkins",
    category: "Supplies",
    currentStock: 200,
    minRequired: 150,
    optimalStock: 300,
    usageRate: 25,
    supplierLeadTime: 1,
    lastOrdered: "2023-05-19",
    price: 0.99
  }
];

// Mock data for KPIs
const kpiData: KpiData = {
  revenue: {
    value: 24850,
    change: 3.2
  },
  customerSatisfaction: {
    value: 90,
    change: 2.5
  },
  employeeProductivity: {
    value: 83,
    change: 1.5
  },
  inventoryHealth: {
    value: 72,
    change: -1.8
  }
};

// Mock data for shipments
const shipments: Shipment[] = [
  {
    id: "SHP-001",
    supplier: "Fresh Produce Co.",
    items: [
      { name: "Lettuce", quantity: 30 },
      { name: "Tomatoes", quantity: 50 }
    ],
    estimatedArrival: "2023-05-20",
    arrived: true
  },
  {
    id: "SHP-002",
    supplier: "Premium Meats",
    items: [
      { name: "Ground Beef", quantity: 40 },
      { name: "Chicken Breast", quantity: 35 }
    ],
    estimatedArrival: "2023-05-23",
    arrived: false
  },
  {
    id: "SHP-003",
    supplier: "Bakery Supplies",
    items: [
      { name: "Burger Buns", quantity: 100 },
      { name: "Flour", quantity: 25 }
    ],
    estimatedArrival: "2023-05-18",
    arrived: false
  },
  {
    id: "SHP-004",
    supplier: "Restaurant Essentials",
    items: [
      { name: "Napkins", quantity: 200 },
      { name: "Condiment Packets", quantity: 500 }
    ],
    estimatedArrival: "2023-05-25",
    arrived: false
  }
];

// Service functions
export const getMenuItems = (): Promise<MenuItem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(menuItems), 500);
  });
};

export const getCustomerServiceData = (): Promise<CustomerServiceData> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(customerServiceData), 500);
  });
};

export const getEmployeeProductivityData = (): Promise<EmployeeProductivityData> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(employeeProductivityData), 500);
  });
};

export const getInventoryItems = (): Promise<InventoryItem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(inventoryItems), 500);
  });
};

export const getKpiData = (): Promise<KpiData> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(kpiData), 500);
  });
};

export const getShipments = (): Promise<Shipment[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(shipments), 500);
  });
};

export const searchData = (query: string): Promise<any> => {
  return new Promise((resolve) => {
    // Simple mock search function
    setTimeout(() => {
      const results = {
        menuItems: menuItems.filter(item => 
          item.name.toLowerCase().includes(query.toLowerCase()) || 
          item.category.toLowerCase().includes(query.toLowerCase())
        ),
        inventory: inventoryItems.filter(item => 
          item.name.toLowerCase().includes(query.toLowerCase()) || 
          item.category.toLowerCase().includes(query.toLowerCase())
        ),
      };
      resolve(results);
    }, 700);
  });
};

export const getSentimentAnalysis = (itemId: number): Promise<any> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const item = menuItems.find(i => i.id === itemId);
      if (item) {
        resolve({
          item,
          detailedAnalysis: {
            strengths: [
              "Popular among younger demographics",
              "Consistent quality ratings",
              "Good value perception"
            ],
            weaknesses: [
              "Some concerns about portion size",
              "Mixed reviews on pricing",
              "Presentation could be improved"
            ],
            opportunities: [
              "Menu pairing with complementary items",
              "Special promotion for target demographics",
              "Packaging improvements for takeout"
            ],
            recommendations: [
              "Consider slight price adjustment",
              "Review portion consistency",
              "Update presentation for Instagram appeal"
            ]
          }
        });
      } else {
        resolve(null);
      }
    }, 600);
  });
};

// Helper function to determine inventory status
export const getInventoryStatus = (item: InventoryItem): 'urgent' | 'warning' | 'normal' => {
  // Days until stock runs out
  const daysRemaining = item.currentStock / item.usageRate;
  
  if (daysRemaining <= item.supplierLeadTime) {
    return 'urgent';
  } else if (item.currentStock < item.minRequired) {
    return 'warning';
  } else {
    return 'normal';
  }
};

// Enhance natural language processing for more complex queries
export const processNaturalLanguageQuery = (query: string): Promise<any> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const normalizedQuery = query.toLowerCase();
      
      // Sales analysis related queries
      if (normalizedQuery.includes("sales") && (normalizedQuery.includes("low") || normalizedQuery.includes("poor") || normalizedQuery.includes("why"))) {
        const sortedItems = [...menuItems].sort((a, b) => a.sales - b.sales);
        const lowestPerforming = sortedItems.slice(0, 3);
        
        // Calculate average sales
        const avgSales = menuItems.reduce((sum, item) => sum + item.sales, 0) / menuItems.length;
        
        // Calculate percentage below average for lowest items
        const percentBelowAvg = ((avgSales - lowestPerforming[0].sales) / avgSales * 100).toFixed(1);
        
        resolve({
          type: "salesAnalysis",
          data: lowestPerforming,
          explanation: "Analysis of underperforming menu items",
          insights: [
            `Sales are below average in several categories, with the worst performer (${lowestPerforming[0].name}) being ${percentBelowAvg}% below the average.`,
            `${lowestPerforming[0].category} items generally have lower performance compared to other categories.`,
            `Customer sentiment analysis suggests pricing and portion size concerns for these items.`
          ]
        });
      }
      // Critical inventory queries
      else if ((normalizedQuery.includes("inventory") || normalizedQuery.includes("stock")) && 
               (normalizedQuery.includes("critical") || normalizedQuery.includes("low") || normalizedQuery.includes("urgent"))) {
        const urgentItems = inventoryItems.filter(item => getInventoryStatus(item) === 'urgent');
        
        if (normalizedQuery.includes("name") || normalizedQuery.includes("what") || normalizedQuery.includes("which")) {
          // User wants the names specifically
          const itemNames = urgentItems.map(item => item.name);
          resolve({
            type: "inventoryStatus",
            data: urgentItems,
            explanation: `The following items need urgent attention: ${itemNames.join(", ")}`,
            criticalNames: itemNames
          });
        } else {
          resolve({
            type: "inventoryStatus",
            data: urgentItems,
            explanation: "These inventory items need urgent attention as they are below critical levels."
          });
        }
      }
      // Lowest performing menu queries
      else if (normalizedQuery.includes("lowest performing")) {
        const sortedItems = [...menuItems].sort((a, b) => a.sales - b.sales);
        resolve({
          type: "menuPerformance",
          data: sortedItems.slice(0, 3),
          explanation: "These are the lowest performing menu items based on sales volume."
        });
      } 
      // Best performing menu queries
      else if (normalizedQuery.includes("best performing")) {
        const sortedItems = [...menuItems].sort((a, b) => b.sales - a.sales);
        resolve({
          type: "menuPerformance",
          data: sortedItems.slice(0, 3),
          explanation: "These are the best performing menu items based on sales volume."
        });
      }
      // Gen Z preferences
      else if (normalizedQuery.includes("gen z") || normalizedQuery.includes("young")) {
        const sortedItems = [...menuItems].sort((a, b) => b.sentiment.byAgeGroup['Gen Z'] - a.sentiment.byAgeGroup['Gen Z']);
        resolve({
          type: "demographicPreference",
          data: sortedItems.slice(0, 3),
          demographic: "Gen Z",
          explanation: "These menu items are most popular with Gen Z customers based on sentiment analysis."
        });
      }
      // Customer service queries
      else if (normalizedQuery.includes("customer service") || normalizedQuery.includes("satisfaction")) {
        resolve({
          type: "customerService",
          data: customerServiceData,
          explanation: "Here's the latest customer service performance data."
        });
      }
      // Employee productivity queries
      else if (normalizedQuery.includes("employee") || normalizedQuery.includes("productivity")) {
        resolve({
          type: "employeeProductivity",
          data: employeeProductivityData,
          explanation: "Here's the current employee productivity metrics."
        });
      }
      else {
        // Default search behavior for unrecognized queries
        const results = {
          menuItems: menuItems.filter(item => 
            item.name.toLowerCase().includes(normalizedQuery) || 
            item.category.toLowerCase().includes(normalizedQuery)
          ),
          inventory: inventoryItems.filter(item => 
            item.name.toLowerCase().includes(normalizedQuery) || 
            item.category.toLowerCase().includes(normalizedQuery)
          ),
        };
        resolve({
          type: "generalSearch",
          data: results,
          explanation: `Search results for "${query}"`
        });
      }
    }, 800);
  });
};
