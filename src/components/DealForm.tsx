
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { Loader, Send } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { useBrokerBuddy } from "@/contexts/BrokerBuddyContext";

const industries = [
  "Retail",
  "Food Services",
  "Construction",
  "Manufacturing",
  "Technology",
  "Healthcare",
  "Finance",
  "Real Estate",
  "Hospitality",
  "Services",
  "Transportation",
  "Education",
  "Other"
];

const formSchema = z.object({
  businessName: z.string().min(2, {
    message: "Business name must be at least 2 characters.",
  }),
  industry: z.string({
    required_error: "Please select an industry.",
  }),
  revenue: z.coerce.number().min(0, {
    message: "Revenue must be a positive number.",
  }),
  requestedAmount: z.coerce.number().min(5000, {
    message: "Amount must be at least $5,000.",
  }).max(1000000, {
    message: "Amount cannot exceed $1,000,000.",
  }),
  timeInBusiness: z.coerce.number().min(1, {
    message: "Business must be at least 1 month old.",
  }),
  ficoScore: z.coerce.number().min(300, {
    message: "FICO score must be at least 300.",
  }).max(850, {
    message: "FICO score cannot exceed 850.",
  }),
  numNSFs: z.coerce.number().min(0, {
    message: "NSFs must be a non-negative number.",
  }),
  additionalNotes: z.string().optional(),
});

const DealForm: React.FC = () => {
  const { processDeal, processingDeal } = useBrokerBuddy();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: "",
      industry: "",
      revenue: 50000,
      requestedAmount: 25000,
      timeInBusiness: 12,
      ficoScore: 680,
      numNSFs: 0,
      additionalNotes: "",
    },
  });
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await processDeal(values);
      toast.success("Deal submitted for analysis");
    } catch (error) {
      console.error(error);
      toast.error("Failed to process deal");
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Submit a Deal</CardTitle>
        <CardDescription>
          Enter deal parameters to get funding recommendations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="businessName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Name</FormLabel>
                  <FormControl>
                    <Input placeholder="ABC Company" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="industry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Industry</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an industry" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {industries.map((industry) => (
                        <SelectItem key={industry} value={industry}>
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="revenue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monthly Revenue</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="50000"
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormDescription>
                    Average monthly revenue in USD
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="requestedAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Requested Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="25000"
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormDescription>
                    Funding amount requested in USD
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="timeInBusiness"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time in Business (months)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="12"
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="ficoScore"
              render={({ field: { value, onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>FICO Score: {value}</FormLabel>
                  <FormControl>
                    <div className="pt-2">
                      <Slider
                        defaultValue={[value]}
                        min={300}
                        max={850}
                        step={1}
                        onValueChange={([val]) => onChange(val)}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Owner's credit score
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="numNSFs"
              render={({ field: { value, onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>Number of NSFs: {value}</FormLabel>
                  <FormControl>
                    <div className="pt-2">
                      <Slider
                        defaultValue={[value]}
                        min={0}
                        max={20}
                        step={1}
                        onValueChange={([val]) => onChange(val)}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Non-sufficient funds in last 3 months
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="additionalNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any other important information about this deal..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={processingDeal}
            >
              {processingDeal ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Get Recommendations
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default DealForm;
