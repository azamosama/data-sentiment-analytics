
import React, { useState } from "react";
import { Download, Upload, Plus, Search, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useBrokerBuddy } from "@/contexts/BrokerBuddyContext";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import LenderDetails from "@/components/LenderDetails";

const LenderDatabase: React.FC = () => {
  const { lenders, uploadLenders, setSelectedLender } = useBrokerBuddy();
  const [searchTerm, setSearchTerm] = useState("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadLenders(file);
      // Reset the input
      e.target.value = "";
    }
  };
  
  const exportLenders = () => {
    try {
      // Create CSV content
      const headers = "Name,Tier,Min FICO,Max NSFs,Min Revenue,Max Amount,Industries,Notes\n";
      const rows = lenders.map(lender => 
        `${lender.name},${lender.tier},${lender.minFICO},${lender.maxNSFs},${lender.minRevenue},${lender.maxAmount},"${lender.industries.join(';')}","${lender.notes || ''}"`
      ).join("\n");
      
      const csvContent = headers + rows;
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      
      // Create download link and trigger download
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "broker_buddy_lenders.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Lenders exported successfully");
    } catch (error) {
      console.error("Error exporting lenders:", error);
      toast.error("Failed to export lenders");
    }
  };
  
  // Filter lenders based on search term
  const filteredLenders = lenders.filter(
    (lender) =>
      lender.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lender.industries.some((ind) =>
        ind.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );
  
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Lender Database</CardTitle>
        <div className="flex gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".csv,.txt"
            className="hidden"
          />
          <Button variant="outline" size="sm" onClick={handleUploadClick}>
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" size="sm" onClick={exportLenders}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-4">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or industry..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Lender
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Lender</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                {/* This would be a form to add a new lender */}
                <p className="text-muted-foreground">
                  This feature will be implemented in a future update. For now, please import lenders using CSV or TXT files.
                </p>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead className="hidden md:table-cell">FICO</TableHead>
                <TableHead className="hidden md:table-cell">NSFs</TableHead>
                <TableHead className="hidden lg:table-cell">Min Revenue</TableHead>
                <TableHead>Industries</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLenders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    {searchTerm
                      ? "No lenders match your search criteria"
                      : "No lenders available. Import lenders to get started."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredLenders.map((lender) => (
                  <TableRow key={lender.id}>
                    <TableCell className="font-medium">{lender.name}</TableCell>
                    <TableCell>
                      <Badge variant={lender.tier === 1 ? "default" : lender.tier === 2 ? "secondary" : "outline"}>
                        {lender.tier}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{lender.minFICO}+</TableCell>
                    <TableCell className="hidden md:table-cell">{lender.maxNSFs}</TableCell>
                    <TableCell className="hidden lg:table-cell">${lender.minRevenue.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {lender.industries.length === 1 && lender.industries[0] === "All" ? (
                          <span className="text-xs">All Industries</span>
                        ) : (
                          lender.industries.length > 2 ? (
                            <span className="text-xs">{lender.industries.length} industries</span>
                          ) : (
                            lender.industries.map((ind) => (
                              <span key={ind} className="text-xs">{ind}</span>
                            ))
                          )
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => setSelectedLender(lender)}
                            >
                              <Search className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Lender Details</DialogTitle>
                            </DialogHeader>
                            <LenderDetails />
                          </DialogContent>
                        </Dialog>
                        <Button variant="ghost" size="icon" disabled>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" disabled>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default LenderDatabase;
