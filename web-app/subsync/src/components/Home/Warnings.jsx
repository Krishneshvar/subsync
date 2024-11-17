import React from 'react'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table'
import { Card, CardContent } from '@/components/ui/card'
import { AlertTriangle } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const headers = ['Name', 'Domain', 'Subscriptions', 'Renewal date', 'Client since', 'Products', 'License usage']

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
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="warnings">
          <AccordionTrigger className="flex justify-between items-center bg-gray-300 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-lg font-semibold text-gray-900">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <span>Warnings</span>
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
                    {warnings.map((warning, index) => (
                      <TableRow key={index}>
                        <TableCell>{warning.name}</TableCell>
                        <TableCell>{warning.domain}</TableCell>
                        <TableCell>{warning.subscriptions}</TableCell>
                        <TableCell>{warning.renewalDate}</TableCell>
                        <TableCell>{warning.clientSince}</TableCell>
                        <TableCell>{warning.products}</TableCell>
                        <TableCell>{warning.licenseUsage}</TableCell>
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
