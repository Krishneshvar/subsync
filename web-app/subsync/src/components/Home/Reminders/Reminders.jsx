import React from 'react'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Bell, ChevronDown } from 'lucide-react'

const headers = ['Name', 'Domain', 'Subscriptions', 'Renewal date', 'Client since', 'Products', 'License usage', '']

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
  // Add more reminder objects as needed
]

export default function Reminders() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-lg font-semibold text-gray-900">
          <Bell className="h-5 w-5 text-yellow-500" />
          <span>Reminders</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              {headers.map((header, index) => (
                <TableHead key={index}>{header}</TableHead>
              ))}
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
                  <TableCell>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
