import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ currentPage, setCurrentPage, totalPages }) {
  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
      <div>
        <p className="text-sm text-gray-700">
          Showing page <span className="font-medium">{currentPage}</span> of{" "}
          <span className="font-medium">{totalPages}</span>
        </p>
      </div>
      <nav className="inline-flex items-center gap-2" aria-label="Pagination">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="rounded-full"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="rounded-full"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </nav>
    </div>
  );
}
