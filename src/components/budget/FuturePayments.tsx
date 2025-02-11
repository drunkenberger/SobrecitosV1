import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { AddFuturePaymentDialog } from "./AddFuturePaymentDialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, DollarSign } from "lucide-react";
import { useState } from "react";

interface FuturePayment {
  id: string;
  description: string;
  amount: number;
  dueDate: Date;
  category: string;
  isPaid?: boolean;
}

interface FuturePaymentsProps {
  payments?: FuturePayment[];
  onPaymentUpdate?: (id: string, isPaid: boolean) => void;
  categories?: string[];
  onAddPayment: (payment: {
    description: string;
    amount: number;
    dueDate: Date;
    category: string;
  }) => void;
}

const defaultPayments: FuturePayment[] = [
  {
    id: "1",
    description: "Rent Payment",
    amount: 1200,
    dueDate: new Date("2024-03-01"),
    category: "Housing",
    isPaid: false,
  },
  {
    id: "2",
    description: "Car Insurance",
    amount: 150,
    dueDate: new Date("2024-03-15"),
    category: "Insurance",
    isPaid: false,
  },
];

export default function FuturePayments({
  payments = defaultPayments,
  onPaymentUpdate = () => {},
  categories = [],
  onAddPayment,
}: FuturePaymentsProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());

  // Get dates with payments for calendar highlighting
  const datesWithPayments = payments.map((payment) => payment.dueDate);

  // Calculate total upcoming payments
  const totalUpcoming = payments
    .filter((payment) => !payment.isPaid)
    .reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <CalendarDays className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">Payment Calendar</h2>
        </div>
        <AddFuturePaymentDialog
          onAddPayment={onAddPayment}
          categories={categories}
        />
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border mt-4"
          modifiers={{
            payment: datesWithPayments,
          }}
          modifiersStyles={{
            payment: {
              fontWeight: "bold",
              backgroundColor: "hsl(var(--primary))",
              color: "white",
            },
          }}
        />
      </Card>

      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">Upcoming Payments</h2>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Total Upcoming</p>
            <p className="text-2xl font-bold">
              ${totalUpcoming.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments
                .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
                .map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{payment.description}</p>
                        <p className="text-sm text-muted-foreground">
                          {payment.category}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {payment.dueDate.toLocaleDateString()}
                    </TableCell>
                    <TableCell>${payment.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge
                        variant={payment.isPaid ? "default" : "secondary"}
                        className="cursor-pointer"
                        onClick={() =>
                          onPaymentUpdate(payment.id, !payment.isPaid)
                        }
                      >
                        {payment.isPaid ? "Paid" : "Pending"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
