import { Pencil } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button.jsx";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table.jsx";

function GenericTable({ headers, data, actions, basePath, primaryKey = "id" }) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="bg-blue-500 text-primary-foreground rounded-lg">
          <TableRow>
            {headers.map((header) => (
              <TableCell
                as="th"
                className="px-4 py-2 text-left font-semibold"
                key={header.key}
              >
                {header.label}
              </TableCell>
            ))}
            {actions && (
              <TableCell as="th" className="px-4 py-2 text-left font-semibold">
                Actions
              </TableCell>
            )}
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((item) => (
            <TableRow key={item[primaryKey]}>
              {headers.map((header) => (
                <TableCell
                  key={`${item[primaryKey]}-${header.key}`}
                  className={
                    "px-4 py-2 text-left " +
                    (header.key === "customer_status"
                      ? item[header.key] === "Active"
                        ? "text-green-500 font-bold"
                        : item[header.key] === "Inactive"
                        ? "text-red-500 font-bold"
                        : ""
                      : "")
                  }
                >
                  {item[header.key] || "N/A"}
                </TableCell>
              ))}

              {actions && (
                <TableCell className="px-4 py-2 text-left">
                  <Link to={`${basePath}/${item[primaryKey]}`}>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Edit ${item[headers[0]?.key] || "item"}`}
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
  );
}

export default GenericTable;