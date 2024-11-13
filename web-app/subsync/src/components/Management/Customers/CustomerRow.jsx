import React from 'react';
import { Link } from 'react-router-dom';
import { Eye } from 'lucide-react';

export default function CustomerRow({ customer }) {
  return (
    <tr key={customer.cid} className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{customer.cid}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{customer.cname}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {typeof customer.domains === 'string' 
          ? JSON.parse(customer.domains).join(', ') 
          : Array.isArray(customer.domains) ? customer.domains.join(', ') : 'N/A'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.email}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.phone}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.address}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.created_at}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.updated_at}</td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <Link to={`/customer-details/${customer.cid}`} className="text-indigo-600 hover:text-indigo-900">
          <Eye className="h-5 w-5" />
        </Link>
      </td>
    </tr>
  );
}
