import React from 'react'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { AlertTriangle, ChevronDown } from 'lucide-react'

const headers = ['Name', 'Domain', 'Subscriptions', 'Renewal date', 'Client since', 'Products', 'License usage', '']

const warnings = [
  {
    name: 'Someone',
    domain: 'Somewhere',
    subscriptions: 'Some',
    renewalDate: 'Sometime',
    clientSince: 'A while',
    products: 'Some',
    licenseUsage: 'Some',
  },
  // Add more warning objects as needed
]

export default function Warnings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-lg font-semibold text-gray-900">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          <span>Warnings</span>
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
              {warnings.map((warning, index) => (
                <TableRow key={index}>
                  <TableCell>{warning.name}</TableCell>
                  <TableCell>{warning.domain}</TableCell>
                  <TableCell>{warning.subscriptions}</TableCell>
                  <TableCell>{warning.renewalDate}</TableCell>
                  <TableCell>{warning.clientSince}</TableCell>
                  <TableCell>{warning.products}</TableCell>
                  <TableCell>{warning.licenseUsage}</TableCell>
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
