import React from 'react'
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Eye } from 'lucide-react'

export default function GenericTable({ headers, data, actions }) {
  console.log("Data passed to GenericTable:", data)

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="bg-gradient-to-l from-cyan-500 to-blue-500 text-primary-foreground">
          {headers.map(header => <TableCell key={header.key}>{header.label}</TableCell>)}
          {actions && <TableCell>Actions</TableCell>}
        </TableHeader>
        <TableBody>
          {data.map(item => (
            <TableRow key={item.cid}>
            {headers.map(header => (
              <TableCell key={`${item.cid}-${header.key}`}>
                {item[header.key] || 'N/A'}
              </TableCell>
            ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
