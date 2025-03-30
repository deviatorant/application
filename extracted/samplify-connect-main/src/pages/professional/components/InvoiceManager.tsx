
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Calendar, FilePlus, Search, Calculator, Printer, FileText } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { Invoice, ProfessionalPatient } from '@/lib/supabase/schema';

// Sample data for demonstration
const mockPatients: ProfessionalPatient[] = Array.from({ length: 5 }, (_, i) => ({
  id: `pat-${i}`,
  professional_id: 'prof-1',
  first_name: `Prénom${i}`,
  last_name: `Nom${i}`,
  email: `patient${i}@example.com`,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
}));

const mockInvoices: Invoice[] = Array.from({ length: 10 }, (_, i) => ({
  id: `inv-${i}`,
  professional_id: 'prof-1',
  patient_id: `pat-${i % 5}`,
  invoice_number: `INV-2023-${1000 + i}`,
  amount: 300 + (i * 50),
  tax_amount: (300 + (i * 50)) * 0.2,
  total_amount: (300 + (i * 50)) * 1.2,
  status: i % 3 === 0 ? 'paid' : (i % 3 === 1 ? 'unpaid' : 'cancelled'),
  issued_date: new Date(2023, 10, 1 + i).toISOString(),
  due_date: new Date(2023, 10, 15 + i).toISOString(),
  paid_date: i % 3 === 0 ? new Date(2023, 10, 10 + i).toISOString() : undefined,
  payment_method: i % 3 === 0 ? (i % 2 === 0 ? 'cash' : 'bank_transfer') : undefined,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  patient: {
    first_name: `Prénom${i % 5}`,
    last_name: `Nom${i % 5}`
  }
}));

const invoiceSchema = z.object({
  patient_id: z.string().min(1, { message: 'Le patient est requis' }),
  amount: z.coerce.number().min(1, { message: 'Le montant doit être supérieur à 0' }),
  tax_rate: z.coerce.number().min(0, { message: 'Le taux de TVA doit être supérieur ou égal à 0' }),
  issued_date: z.string().min(1, { message: 'La date d\'émission est requise' }),
  due_date: z.string().min(1, { message: 'La date d\'échéance est requise' }),
  notes: z.string().optional()
});

type InvoiceFormValues = z.infer<typeof invoiceSchema>;

const InvoiceManager: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [isCreateInvoiceOpen, setIsCreateInvoiceOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      patient_id: '',
      amount: 0,
      tax_rate: 20, // 20% by default
      issued_date: format(new Date(), 'yyyy-MM-dd'),
      due_date: format(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'), // 14 days later
      notes: ''
    }
  });

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = 
      invoice.patient?.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.patient?.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.invoice_number.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = activeTab === 'all' || activeTab === invoice.status;
    
    return matchesSearch && matchesFilter;
  });

  const handleCreateInvoice = (data: InvoiceFormValues) => {
    // In a real app, you would call an API to save the new invoice
    const taxAmount = data.amount * (data.tax_rate / 100);
    const totalAmount = data.amount + taxAmount;
    
    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      professional_id: 'prof-1',
      patient_id: data.patient_id,
      invoice_number: `INV-${format(new Date(), 'yyyy')}-${1000 + invoices.length + 1}`,
      amount: data.amount,
      tax_amount: taxAmount,
      total_amount: totalAmount,
      status: 'unpaid',
      issued_date: data.issued_date,
      due_date: data.due_date,
      notes: data.notes,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      patient: mockPatients.find(p => p.id === data.patient_id) ? {
        first_name: mockPatients.find(p => p.id === data.patient_id)!.first_name,
        last_name: mockPatients.find(p => p.id === data.patient_id)!.last_name
      } : undefined
    };
    
    setInvoices([...invoices, newInvoice]);
    setIsCreateInvoiceOpen(false);
    form.reset();
  };

  const handleViewDetails = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsDetailsOpen(true);
  };

  const handleMarkAsPaid = (invoiceId: string) => {
    setInvoices(invoices.map(invoice => 
      invoice.id === invoiceId
        ? { 
            ...invoice, 
            status: 'paid', 
            paid_date: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        : invoice
    ));
    
    if (selectedInvoice?.id === invoiceId) {
      setSelectedInvoice({
        ...selectedInvoice,
        status: 'paid',
        paid_date: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'unpaid':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{t('invoicesAndPayments')}</h1>
          <p className="text-muted-foreground">{t('manageInvoices')}</p>
        </div>
        
        <Button onClick={() => setIsCreateInvoiceOpen(true)}>
          <FilePlus size={16} className="mr-2" />
          {t('createInvoice')}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{t('totalInvoiced')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD' })
                .format(invoices.reduce((sum, inv) => sum + inv.total_amount, 0))}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{t('totalPaid')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">
              {new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD' })
                .format(invoices
                  .filter(inv => inv.status === 'paid')
                  .reduce((sum, inv) => sum + inv.total_amount, 0)
                )}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{t('outstandingAmount')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-yellow-600">
              {new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD' })
                .format(invoices
                  .filter(inv => inv.status === 'unpaid')
                  .reduce((sum, inv) => sum + inv.total_amount, 0)
                )}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input
            placeholder={t('searchInvoice')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
            icon={<Search size={18} />}
          />
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
          <TabsList>
            <TabsTrigger value="all">{t('all')}</TabsTrigger>
            <TabsTrigger value="unpaid">{t('unpaid')}</TabsTrigger>
            <TabsTrigger value="paid">{t('paid')}</TabsTrigger>
            <TabsTrigger value="cancelled">{t('cancelled')}</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{t('invoices')}</CardTitle>
          <CardDescription>
            {filteredInvoices.length} {t('invoicesFound')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="grid grid-cols-12 border-b py-3 px-4 font-medium text-sm bg-muted/50">
              <div className="col-span-2">{t('invoiceNumber')}</div>
              <div className="col-span-3">{t('patient')}</div>
              <div className="col-span-2">{t('amount')}</div>
              <div className="col-span-2">{t('date')}</div>
              <div className="col-span-1">{t('status')}</div>
              <div className="col-span-2 text-right">{t('actions')}</div>
            </div>
            
            <div className="divide-y">
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((invoice) => (
                  <div key={invoice.id} className="grid grid-cols-12 py-3 px-4 items-center text-sm">
                    <div className="col-span-2 font-medium">
                      {invoice.invoice_number}
                    </div>
                    <div className="col-span-3">
                      {invoice.patient?.first_name} {invoice.patient?.last_name}
                    </div>
                    <div className="col-span-2">
                      {new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD' })
                        .format(invoice.total_amount)}
                    </div>
                    <div className="col-span-2 text-muted-foreground">
                      <div className="flex items-center">
                        <Calendar size={14} className="mr-1" />
                        <span>
                          {format(new Date(invoice.issued_date), 'dd/MM/yyyy')}
                        </span>
                      </div>
                    </div>
                    <div className="col-span-1">
                      <span className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                        getStatusBadgeClass(invoice.status)
                      )}>
                        {t(invoice.status)}
                      </span>
                    </div>
                    <div className="col-span-2 text-right flex justify-end items-center space-x-2">
                      {invoice.status === 'unpaid' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleMarkAsPaid(invoice.id)}
                        >
                          {t('markPaid')}
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleViewDetails(invoice)}
                      >
                        {t('view')}
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center text-muted-foreground">
                  {t('noInvoicesFound')}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Create Invoice Dialog */}
      <Dialog open={isCreateInvoiceOpen} onOpenChange={setIsCreateInvoiceOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{t('createInvoice')}</DialogTitle>
            <DialogDescription>
              {t('enterInvoiceDetails')}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleCreateInvoice)} className="space-y-4">
              <FormField
                control={form.control}
                name="patient_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('patient')}</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('selectPatient')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mockPatients.map((patient) => (
                          <SelectItem key={patient.id} value={patient.id}>
                            {patient.first_name} {patient.last_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('amount')} (MAD)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="tax_rate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('taxRate')} (%)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="issued_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('issuedDate')}</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="due_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('dueDate')}</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('notes')}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {form.watch('amount') > 0 && (
                <div className="bg-muted p-4 rounded-lg space-y-2">
                  <div className="flex justify-between items-center">
                    <span>{t('subtotal')}</span>
                    <span>
                      {new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD' })
                        .format(form.watch('amount'))}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>{t('tax')} ({form.watch('tax_rate')}%)</span>
                    <span>
                      {new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD' })
                        .format(form.watch('amount') * (form.watch('tax_rate') / 100))}
                    </span>
                  </div>
                  <div className="flex justify-between items-center font-bold pt-2 border-t">
                    <span>{t('total')}</span>
                    <span>
                      {new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD' })
                        .format(form.watch('amount') * (1 + form.watch('tax_rate') / 100))}
                    </span>
                  </div>
                </div>
              )}
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreateInvoiceOpen(false)}>
                  {t('cancel')}
                </Button>
                <Button type="submit">{t('createInvoice')}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Invoice Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[650px]">
          <DialogHeader>
            <DialogTitle>{t('invoiceDetails')}</DialogTitle>
          </DialogHeader>
          
          {selectedInvoice && (
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold">
                    {t('invoice')} #{selectedInvoice.invoice_number}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(selectedInvoice.issued_date), 'PPP', { locale: fr })}
                  </p>
                </div>
                
                <span className={cn(
                  "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                  getStatusBadgeClass(selectedInvoice.status)
                )}>
                  {t(selectedInvoice.status)}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">{t('from')}</h3>
                  <p className="font-medium">Dr. Mohammed El Mansouri</p>
                  <p className="text-sm">Cabinet Médical</p>
                  <p className="text-sm">123 Rue Principale</p>
                  <p className="text-sm">Casablanca, Maroc</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">{t('to')}</h3>
                  <p className="font-medium">{selectedInvoice.patient?.first_name} {selectedInvoice.patient?.last_name}</p>
                  <p className="text-sm">Patient ID: {selectedInvoice.patient_id}</p>
                </div>
              </div>
              
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="py-2 px-4 text-left font-medium">{t('description')}</th>
                      <th className="py-2 px-4 text-right font-medium">{t('amount')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="py-3 px-4">{t('consultationFee')}</td>
                      <td className="py-3 px-4 text-right">
                        {new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD' })
                          .format(selectedInvoice.amount)}
                      </td>
                    </tr>
                    <tr className="border-t">
                      <td className="py-3 px-4">{t('tax')} (20%)</td>
                      <td className="py-3 px-4 text-right">
                        {new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD' })
                          .format(selectedInvoice.tax_amount)}
                      </td>
                    </tr>
                    <tr className="border-t bg-muted/30">
                      <td className="py-3 px-4 font-medium">{t('total')}</td>
                      <td className="py-3 px-4 text-right font-bold">
                        {new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD' })
                          .format(selectedInvoice.total_amount)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">{t('issuedDate')}</span>
                  <span className="text-sm">
                    {format(new Date(selectedInvoice.issued_date), 'PPP', { locale: fr })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">{t('dueDate')}</span>
                  <span className="text-sm">
                    {format(new Date(selectedInvoice.due_date), 'PPP', { locale: fr })}
                  </span>
                </div>
                {selectedInvoice.paid_date && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{t('paidDate')}</span>
                    <span className="text-sm">
                      {format(new Date(selectedInvoice.paid_date), 'PPP', { locale: fr })}
                    </span>
                  </div>
                )}
                {selectedInvoice.payment_method && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{t('paymentMethod')}</span>
                    <span className="text-sm">
                      {selectedInvoice.payment_method === 'cash' ? t('cash') : t('bankTransfer')}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="pt-4 flex justify-end space-x-2">
                <Button variant="outline" className="gap-2">
                  <Printer size={16} />
                  {t('printInvoice')}
                </Button>
                {selectedInvoice.status === 'unpaid' && (
                  <Button className="gap-2" onClick={() => handleMarkAsPaid(selectedInvoice.id)}>
                    <Calculator size={16} />
                    {t('markAsPaid')}
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InvoiceManager;
