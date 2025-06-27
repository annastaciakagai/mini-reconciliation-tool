import { useState } from "react";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from "@/components/ui/pagination";
import { CheckCircleIcon, ExclamationTriangleIcon, XCircleIcon } from '@heroicons/react/24/solid';

function StatusIcon({ status }) {
  if (status === "matched") return <CheckCircleIcon className="h-5 w-5 text-green-500 inline" />;
  if (status === "internal") return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500 inline" />;
  if (status === "provider") return <XCircleIcon className="h-5 w-5 text-red-500 inline" />;
  return null;
}

function exportCSV(data, filename) {
  if (!data.length) return;
  const csvRows = [];
  csvRows.push(Object.keys(data[0]).join(","));
  data.forEach(row => {
    csvRows.push(Object.values(row).map(val => `"${val}"`).join(","));
  });
  const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

const PAGE_SIZE = 10;

export default function Output({ matched, onlyInternal, onlyProvider }) {
  // Pagination state for each table
  const [matchedPage, setMatchedPage] = useState(1);
  const [internalPage, setInternalPage] = useState(1);
  const [providerPage, setProviderPage] = useState(1);

  // Pagination calculations
  const matchedTotalPages = Math.ceil(matched.length / PAGE_SIZE) || 1;
  const internalTotalPages = Math.ceil(onlyInternal.length / PAGE_SIZE) || 1;
  const providerTotalPages = Math.ceil(onlyProvider.length / PAGE_SIZE) || 1;

  const matchedPageData = matched.slice((matchedPage - 1) * PAGE_SIZE, matchedPage * PAGE_SIZE);
  const internalPageData = onlyInternal.slice((internalPage - 1) * PAGE_SIZE, internalPage * PAGE_SIZE);
  const providerPageData = onlyProvider.slice((providerPage - 1) * PAGE_SIZE, providerPage * PAGE_SIZE);

  // Pagination UI helper
  const renderPagination = (page, setPage, totalPages) => (
    totalPages > 1 && (
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setPage(p => Math.max(1, p - 1))}
              aria-disabled={page === 1}
            />
          </PaginationItem>
          {Array.from({ length: totalPages }, (_, idx) => (
            <PaginationItem key={idx}>
              <PaginationLink
                isActive={page === idx + 1}
                onClick={() => setPage(idx + 1)}
              >
                {idx + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              aria-disabled={page === totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    )
  );

  return (
    <div className="space-y-8">
      {/* Matched Transactions */}
      <section>
        <div className="flex items-center gap-2 mb-2">
          <StatusIcon status="matched" />
          <h2 className="text-lg font-semibold">Matched Transactions</h2>
          <button
            className="ml-auto bg-gray-200 px-2 py-1 rounded text-sm"
            onClick={() => exportCSV(matched, "matched.csv")}
          >
            Export as CSV
          </button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction Reference</TableHead>
              <TableHead>Amount (Internal)</TableHead>
              <TableHead>Amount (Provider)</TableHead>
              <TableHead>Status (Internal)</TableHead>
              <TableHead>Status (Provider)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {matchedPageData.map((tx, i) => (
              <TableRow key={i}>
                <TableCell>{tx.transaction_reference}</TableCell>
                <TableCell className={!tx.isAmountMatch ? "bg-yellow-100" : ""}>{tx.amount}</TableCell>
                <TableCell className={!tx.isAmountMatch ? "bg-yellow-100" : ""}>{tx.providerAmount}</TableCell>
                <TableCell className={!tx.isStatusMatch ? "bg-yellow-100" : ""}>{tx.status}</TableCell>
                <TableCell className={!tx.isStatusMatch ? "bg-yellow-100" : ""}>{tx.providerStatus}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {renderPagination(matchedPage, setMatchedPage, matchedTotalPages)}
      </section>

      {/* Only in Internal */}
      <section>
        <div className="flex items-center gap-2 mb-2">
          <StatusIcon status="internal" />
          <h2 className="text-lg font-semibold">Present only in Internal file</h2>
          <button
            className="ml-auto bg-gray-200 px-2 py-1 rounded text-sm"
            onClick={() => exportCSV(onlyInternal, "only-internal.csv")}
          >
            Export as CSV
          </button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction Reference</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {internalPageData.map((tx, i) => (
              <TableRow key={i}>
                <TableCell>{tx.transaction_reference}</TableCell>
                <TableCell>{tx.amount}</TableCell>
                <TableCell>{tx.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {renderPagination(internalPage, setInternalPage, internalTotalPages)}
      </section>

      {/* Only in Provider */}
      <section>
        <div className="flex items-center gap-2 mb-2">
          <StatusIcon status="provider" />
          <h2 className="text-lg font-semibold">Present only in Provider file</h2>
          <button
            className="ml-auto bg-gray-200 px-2 py-1 rounded text-sm"
            onClick={() => exportCSV(onlyProvider, "only-provider.csv")}
          >
            Export as CSV
          </button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction Reference</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {providerPageData.map((tx, i) => (
              <TableRow key={i}>
                <TableCell>{tx.transaction_reference}</TableCell>
                <TableCell>{tx.amount}</TableCell>
                <TableCell>{tx.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {renderPagination(providerPage, setProviderPage, providerTotalPages)}
      </section>
    </div>
  );
}