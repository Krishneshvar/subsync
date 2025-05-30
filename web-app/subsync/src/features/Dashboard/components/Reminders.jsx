import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table.jsx'
import { Card, CardContent } from '@/components/ui/card.jsx'
import { Bell } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion.jsx"

const headers = ['Name', 'Domain', 'Subscriptions', 'Renewal date', 'Client since', 'Services', 'License usage']

const reminders = [
  {
    name: 'Someone',
    domain: 'Somewhere',
    subscriptions: 'Some',
    renewalDate: 'Sometime',
    clientSince: 'A while',
    products: 'Some',
    licenseUsage: 'Some',
  },
]

function Reminders() {
  return (
    <Card>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="reminders">
          <AccordionTrigger className="flex justify-between items-center bg-gray-300 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-lg font-semibold text-gray-900">
              <Bell className="h-5 w-5 text-yellow-500" />
              <span>Reminders</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {headers.map((header, index) => (
                        <TableHead key={index}>{header}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reminders.map((reminder, index) => (
                      <TableRow key={index}>
                        <TableCell>{reminder.name}</TableCell>
                        <TableCell>{reminder.domain}</TableCell>
                        <TableCell>{reminder.subscriptions}</TableCell>
                        <TableCell>{reminder.renewalDate}</TableCell>
                        <TableCell>{reminder.clientSince}</TableCell>
                        <TableCell>{reminder.products}</TableCell>
                        <TableCell>{reminder.licenseUsage}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  )
}

export default Reminders;
