
import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { FileText, Search, Download, ArrowDown, ArrowUp, ChevronLeft, ChevronRight } from 'lucide-react';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface Consultation {
  id: string;
  patientName: string;
  date: Date;
  type: 'video' | 'inperson';
  diagnosis: string;
  notes: string;
}

const ConsultationHistory: React.FC = () => {
  const { t } = useLanguage();
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('desc');
  
  // Mock data
  const consultations: Consultation[] = [
    {
      id: 'c1',
      patientName: 'Ahmed Khalid',
      date: new Date(2023, 5, 15),
      type: 'video',
      diagnosis: 'Hypertension',
      notes: 'Prescription renewed. Follow-up in 3 months.'
    },
    {
      id: 'c2',
      patientName: 'Fatima Ben',
      date: new Date(2023, 5, 10),
      type: 'inperson',
      diagnosis: 'Seasonal allergies',
      notes: 'Prescribed antihistamines. Patient to avoid outdoor activities during high pollen count.'
    },
    {
      id: 'c3',
      patientName: 'Omar Zidane',
      date: new Date(2023, 5, 5),
      type: 'video',
      diagnosis: 'Migraine',
      notes: 'Discussed triggers. Prescribed preventative medication.'
    },
    {
      id: 'c4',
      patientName: 'Laila Hassan',
      date: new Date(2023, 4, 28),
      type: 'inperson',
      diagnosis: 'Lower back pain',
      notes: 'Recommended physical therapy and ergonomic adjustments at work.'
    }
  ];
  
  const sortedConsultations = [...consultations].sort((a, b) => {
    const comparison = a.date.getTime() - b.date.getTime();
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">
          {t('consultationHistory')}
        </h2>
        
        <div className="flex items-center">
          <div className="relative mr-2">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder={t('searchDoctor')}
              className="pl-10 pr-4 py-1 text-sm border rounded-md w-60 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
          >
            {sortOrder === 'asc' ? (
              <ArrowUp size={14} className="mr-1" />
            ) : (
              <ArrowDown size={14} className="mr-1" />
            )}
            {t('date')}
          </Button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-2 px-4 text-left font-medium text-muted-foreground">
                {t('patientName')}
              </th>
              <th className="py-2 px-4 text-left font-medium text-muted-foreground">
                {t('date')}
              </th>
              <th className="py-2 px-4 text-left font-medium text-muted-foreground">
                {t('type')}
              </th>
              <th className="py-2 px-4 text-left font-medium text-muted-foreground">
                {t('diagnosis')}
              </th>
              <th className="py-2 px-4 text-right font-medium text-muted-foreground">
                {t('actions')}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedConsultations.map(consultation => (
              <tr key={consultation.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">{consultation.patientName}</td>
                <td className="py-3 px-4">
                  {format(consultation.date, 'dd/MM/yyyy', { locale: fr })}
                </td>
                <td className="py-3 px-4">
                  <span className={cn(
                    "px-2 py-1 rounded-full text-xs",
                    consultation.type === 'video' 
                      ? "bg-blue-100 text-blue-800" 
                      : "bg-green-100 text-green-800"
                  )}>
                    {consultation.type === 'video' ? t('videoType') : t('inPersonType')}
                  </span>
                </td>
                <td className="py-3 px-4">{consultation.diagnosis}</td>
                <td className="py-3 px-4 text-right space-x-2">
                  <button className="text-blue-600 hover:text-blue-800">
                    <FileText size={16} />
                  </button>
                  <button className="text-green-600 hover:text-green-800">
                    <Download size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="flex items-center justify-between mt-4 text-sm">
        <div className="text-muted-foreground">
          {t('showing')} 1-{sortedConsultations.length} {t('of')} {sortedConsultations.length}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button size="sm" variant="outline" className="h-8 w-8 p-0">
            <ChevronLeft size={16} />
          </Button>
          <Button size="sm" variant="outline" className="h-8 w-8 p-0 bg-blue-50 border-blue-200">
            1
          </Button>
          <Button size="sm" variant="outline" className="h-8 w-8 p-0">
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ConsultationHistory;
