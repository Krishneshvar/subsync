import React from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ currentPage, setCurrentPage, totalPages }) {
  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
      <div>
        <p className="text-sm text-gray-700">
          Showing page <span className="font-medium">{currentPage}</span> of{' '}
          <span className="font-medium">{totalPages}</span>
        </p>
      </div>
      <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
        <ButtonGroup>
          <Button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1} // Disable button on the first page
            variant="primary"
            className="relative inline-flex items-center rounded-l-md px-2 py-2 text-primary-foreground"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </Button>
          <Button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages} // Disable button on the last page
            variant="primary"
            className="relative inline-flex items-center rounded-r-md px-2 py-2 text-primary-foreground"
          >
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </Button>
        </ButtonGroup>
      </nav>
    </div>
  );
}
