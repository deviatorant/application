
import React, { useState } from 'react';
import { format } from 'date-fns';
import { ChevronDown, ChevronUp, Download, FileText } from 'lucide-react';
import Card from '../common/Card';
import { cn } from '@/lib/utils';
import Button from '../common/Button';

interface TestResult {
  name: string;
  value: string;
  unit: string;
  referenceRange: string;
  isAbnormal: boolean;
}

interface ResultCardProps {
  id: string;
  testName: string;
  collectionDate: Date;
  resultDate: Date;
  labName: string;
  results: TestResult[];
  isPDF?: boolean;
  pdfUrl?: string;
  className?: string;
}

const ResultCard: React.FC<ResultCardProps> = ({
  id,
  testName,
  collectionDate,
  resultDate,
  labName,
  results,
  isPDF = false,
  pdfUrl,
  className
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card 
      className={cn("overflow-hidden", className)}
      isHoverable
    >
      <div 
        className="flex justify-between items-start cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div>
          <h3 className="font-semibold text-lg">{testName}</h3>
          <p className="text-sm text-muted-foreground">
            Lab: {labName}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">
            Collected: {format(collectionDate, 'MMM d, yyyy')}
          </p>
          <p className="text-sm font-medium">
            Results: {format(resultDate, 'MMM d, yyyy')}
          </p>
        </div>
      </div>
      
      <div className="mt-4 flex justify-between items-center">
        <div className="flex items-center">
          <FileText 
            size={18} 
            className={cn(
              "mr-2",
              isPDF ? "text-medical-500" : "text-muted-foreground"
            )} 
          />
          <span className="text-sm">
            {isPDF ? "PDF Report Available" : `${results.length} Result Items`}
          </span>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          icon={isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          iconPosition="right"
        >
          {isExpanded ? "Less" : "More"}
        </Button>
      </div>
      
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-border animate-fade-in">
          {isPDF && pdfUrl ? (
            <div className="flex justify-center">
              <Button
                variant="outline"
                icon={<Download size={16} />}
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(pdfUrl, '_blank');
                }}
              >
                Download PDF Report
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-12 text-sm font-medium text-muted-foreground">
                <div className="col-span-4">Test</div>
                <div className="col-span-2">Result</div>
                <div className="col-span-2">Units</div>
                <div className="col-span-4">Reference Range</div>
              </div>
              
              {results.map((result, index) => (
                <div 
                  key={index}
                  className={cn(
                    "grid grid-cols-12 text-sm py-2 border-b border-border/50",
                    result.isAbnormal && "bg-red-50"
                  )}
                >
                  <div className="col-span-4 font-medium">{result.name}</div>
                  <div className={cn(
                    "col-span-2",
                    result.isAbnormal && "font-bold text-red-600"
                  )}>
                    {result.value}
                  </div>
                  <div className="col-span-2">{result.unit}</div>
                  <div className="col-span-4">{result.referenceRange}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default ResultCard;
