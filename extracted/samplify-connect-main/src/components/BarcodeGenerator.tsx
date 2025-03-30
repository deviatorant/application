
import React, { useEffect, useRef } from 'react';
import { QrCode, Printer } from 'lucide-react';
import Button from './common/Button';
import Card from './common/Card';
import { cn } from '@/lib/utils';

interface BarcodeGeneratorProps {
  sampleId: string;
  patientName: string;
  testType: string;
  collectionDate: Date;
  className?: string;
  onPrint?: () => void;
}

const BarcodeGenerator: React.FC<BarcodeGeneratorProps> = ({
  sampleId,
  patientName,
  testType,
  collectionDate,
  className,
  onPrint
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // For a real implementation, we would use a proper barcode library
  // This is just a visual placeholder
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Clear canvas
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw a simple placeholder barcode
        ctx.fillStyle = 'black';
        const barWidth = 3;
        const barSpacing = 2;
        const startX = 20;
        
        for (let i = 0; i < sampleId.length; i++) {
          // Use char code as bar height
          const charCode = sampleId.charCodeAt(i);
          const height = 20 + (charCode % 40);
          
          // Draw bar
          ctx.fillRect(
            startX + i * (barWidth + barSpacing), 
            canvas.height - height, 
            barWidth, 
            height
          );
          
          // Add some short bars in between
          if (i < sampleId.length - 1) {
            const shortHeight = 15 + ((charCode + sampleId.charCodeAt(i+1)) % 15);
            ctx.fillRect(
              startX + i * (barWidth + barSpacing) + barWidth + 1, 
              canvas.height - shortHeight, 
              1, 
              shortHeight
            );
          }
        }
        
        // Add sample ID as text
        ctx.font = '12px monospace';
        ctx.fillText(sampleId, 20, 20);
      }
    }
  }, [sampleId]);
  
  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      // Placeholder print functionality
      const printWindow = window.open('', '_blank');
      if (printWindow && canvasRef.current) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Sample Label - ${sampleId}</title>
              <style>
                body { font-family: sans-serif; margin: 20px; }
                .sample-info { margin-bottom: 20px; }
                .label { border: 1px solid #ccc; padding: 15px; width: 300px; }
              </style>
            </head>
            <body>
              <div class="sample-info">
                <h2>Sample Label</h2>
                <p>Patient: ${patientName}</p>
                <p>Test: ${testType}</p>
                <p>Date: ${collectionDate.toLocaleDateString()}</p>
                <p>ID: ${sampleId}</p>
              </div>
              <div class="label">
                <img src="${canvasRef.current.toDataURL()}" />
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };
  
  return (
    <Card className={cn("p-4", className)}>
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold">Sample ID: {sampleId}</h3>
          <Button
            variant="ghost"
            size="sm"
            icon={<Printer size={16} />}
            onClick={handlePrint}
          >
            Print
          </Button>
        </div>
        
        <div className="text-sm space-y-1 text-muted-foreground">
          <p>Patient: {patientName}</p>
          <p>Test: {testType}</p>
          <p>Date: {collectionDate.toLocaleDateString()}</p>
        </div>
      </div>
      
      <div className="flex justify-center p-4 bg-white rounded-lg border">
        <canvas 
          ref={canvasRef} 
          width={200} 
          height={80}
          className="max-w-full"
        />
      </div>
      
      <div className="mt-4 flex items-center justify-center text-sm text-muted-foreground">
        <QrCode size={16} className="mr-2" />
        <span>Scan to verify sample authenticity</span>
      </div>
    </Card>
  );
};

export default BarcodeGenerator;
