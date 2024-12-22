import React from 'react'
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Pencil } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function GenericTable({ headers, data, actions, basePath, primaryKey = 'id' }) {
  console.log("Data passed to GenericTable:", data)

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="bg-blue-500 text-primary-foreground">
          {headers.map(header => <TableCell key={header.key}>{header.label}</TableCell>)}
          {actions && <TableCell>Actions</TableCell>}
        </TableHeader>
        <TableBody>
          {data.map(item => (
            <TableRow key={item[primaryKey]}>
              {headers.map(header => (
                <TableCell key={`${item[primaryKey]}-${header.key}`}>
                  {item[header.key] || 'N/A'}
                </TableCell>
              ))}
              {actions && (
                <TableCell>
                  <Link to={`${basePath}/${item[primaryKey]}`}>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Edit ${item[headers[0]?.key] || 'item'}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </Link>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
