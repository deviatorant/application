
import React, { useState } from 'react';
import { Filter, Search } from 'lucide-react';
import Button from '@/components/common/Button';
import ResultCard from '@/components/Results/ResultCard';
import Card from '@/components/common/Card';
import { cn } from '@/lib/utils';

// Mock data
const mockResults = [
  {
    id: "res-123",
    testName: "Complete Blood Count",
    collectionDate: new Date(Date.now() - 86400000 * 6), // 6 days ago
    resultDate: new Date(Date.now() - 86400000 * 4), // 4 days ago
    labName: "LabCorp",
    results: [
      {
        name: "WBC",
        value: "7.5",
        unit: "10³/µL",
        referenceRange: "4.0-11.0",
        isAbnormal: false
      },
      {
        name: "RBC",
        value: "5.2",
        unit: "10⁶/µL",
        referenceRange: "4.20-5.80",
        isAbnormal: false
      },
      {
        name: "Hemoglobin",
        value: "15.3",
        unit: "g/dL",
        referenceRange: "12.0-16.0",
        isAbnormal: false
      },
      {
        name: "Hematocrit",
        value: "45.1",
        unit: "%",
        referenceRange: "37.0-47.0",
        isAbnormal: false
      },
      {
        name: "Platelets",
        value: "295",
        unit: "10³/µL",
        referenceRange: "150-400",
        isAbnormal: false
      }
    ]
  },
  {
    id: "res-456",
    testName: "Lipid Panel",
    collectionDate: new Date(Date.now() - 86400000 * 15), // 15 days ago
    resultDate: new Date(Date.now() - 86400000 * 13), // 13 days ago
    labName: "Quest Diagnostics",
    results: [
      {
        name: "Total Cholesterol",
        value: "220",
        unit: "mg/dL",
        referenceRange: "<200",
        isAbnormal: true
      },
      {
        name: "HDL Cholesterol",
        value: "55",
        unit: "mg/dL",
        referenceRange: "≥40",
        isAbnormal: false
      },
      {
        name: "LDL Cholesterol",
        value: "145",
        unit: "mg/dL",
        referenceRange: "<100",
        isAbnormal: true
      },
      {
        name: "Triglycerides",
        value: "100",
        unit: "mg/dL",
        referenceRange: "<150",
        isAbnormal: false
      }
    ]
  },
  {
    id: "res-789",
    testName: "Comprehensive Metabolic Panel",
    collectionDate: new Date(Date.now() - 86400000 * 30), // 30 days ago
    resultDate: new Date(Date.now() - 86400000 * 28), // 28 days ago
    labName: "LabCorp",
    isPDF: true,
    pdfUrl: "#"
  }
];

const Results: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredResults, setFilteredResults] = useState(mockResults);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (term === "") {
      setFilteredResults(mockResults);
    } else {
      setFilteredResults(
        mockResults.filter(result => 
          result.testName.toLowerCase().includes(term) ||
          result.labName.toLowerCase().includes(term)
        )
      );
    }
  };

  return (
    <div className="container max-w-lg mx-auto px-4 py-6 pb-24 animate-fade-in">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold mb-4">Test Results</h1>
        
        <div className="flex gap-2">
          <div className="relative flex-grow">
            <Search 
              size={18} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
            />
            <input 
              type="text" 
              placeholder="Search results..." 
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-500"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <Button 
            variant="outline" 
            icon={<Filter size={18} />}
          >
            Filter
          </Button>
        </div>
      </header>
      
      <div className="space-y-4">
        {filteredResults.length > 0 ? (
          filteredResults.map(result => (
            <ResultCard
              key={result.id}
              id={result.id}
              testName={result.testName}
              collectionDate={result.collectionDate}
              resultDate={result.resultDate}
              labName={result.labName}
              results={result.results || []}
              isPDF={result.isPDF}
              pdfUrl={result.pdfUrl}
            />
          ))
        ) : (
          <Card className="text-center py-8">
            <div className="flex flex-col items-center">
              <Search size={40} className="text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No results found</h3>
              <p className="text-muted-foreground">
                {searchTerm 
                  ? "Try adjusting your search" 
                  : "Your test results will appear here"}
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Results;
