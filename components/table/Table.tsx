"use client";
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";
import { useTranslations } from "next-intl";

interface Data {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

const mockData: Data[] = Array.from({ length: 25 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  role: i % 2 === 0 ? "Admin" : "User",
  status: i % 3 === 0 ? "Active" : "Inactive",
}));

export default function TableDesign() {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Data;
    direction: "asc" | "desc";
  } | null>(null);

  const getCurrentLocale = () => {
    if (typeof window !== "undefined") {
      return document.cookie.match(/locale=([^;]*)/)?.[1] || "en";
    }
    return "en";
  };

  const [locale, setLocale] = useState(getCurrentLocale());
  const direction = locale === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    const checkLocale = () => {
      const newLocale = getCurrentLocale();
      if (newLocale !== locale) {
        setLocale(newLocale);
      }
    };

    const intervalId = setInterval(checkLocale, 100);
    return () => clearInterval(intervalId);
  }, [locale]);

  // Sort data
  const sortedData = [...mockData].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
    if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
    return 0;
  });

  // Calculate pagination
  const totalPages = Math.ceil(sortedData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentData = sortedData.slice(startIndex, endIndex);

  // Generate page numbers array
  const getPageNumbers = () => {
    const pageNumbers = [];

    if (totalPages <= 3) {
      // If total pages is 3 or less, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage === 1) {
        // At first page: 1 2 ... last
        pageNumbers.push(1, 2, "...", totalPages);
      } else if (currentPage === totalPages) {
        // At last page: 1 ... secondLast last
        pageNumbers.push(1, "...", totalPages - 1, totalPages);
      } else if (currentPage === 2) {
        // At second page: 1 2 3 ... last
        pageNumbers.push(1, 2, 3, "...", totalPages);
      } else if (currentPage === totalPages - 1) {
        // At second-to-last page: 1 ... secondLast last
        pageNumbers.push(1, "...", totalPages - 1, totalPages);
      } else {
        // In middle: 1 ... current ... last
        pageNumbers.push(1, "...", currentPage, "...", totalPages);
      }
    }

    return pageNumbers;
  };

  // Handle sorting
  const handleSort = (key: keyof Data) => {
    setSortConfig({
      key,
      direction:
        sortConfig?.key === key && sortConfig.direction === "asc"
          ? "desc"
          : "asc",
    });
  };

  const t = useTranslations("TableFooter");

  return (
    <div className="w-full mx-auto space-y-4 z-[-1]">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("id")}
              >
                <div className="flex items-center gap-1">
                  ID
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center gap-1">
                  Name
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("email")}
              >
                <div className="flex items-center gap-1">
                  Email
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("role")}
              >
                <div className="flex items-center gap-1">
                  Role
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("status")}
              >
                <div className="flex items-center gap-1">
                  Status
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.role}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      row.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {row.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{t("show")}</span>
          <Select
            value={rowsPerPage.toString()}
            onValueChange={(value) => {
              setRowsPerPage(Number(value));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm font-medium">{t("entires")}</span>
        </div>

        <div className="text-sm text-muted-foreground">
          {t("numberOfEntries", {
            startIndex: startIndex + 1,
            endIndex: Math.min(endIndex, sortedData.length),
            totalEntries: sortedData.length,
          })}
        </div>

        <div className="flex items-center gap-1" style={{ direction }}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            {locale === "ar" ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>

          {getPageNumbers().map((pageNum, index) =>
            typeof pageNum === "number" ? (
              <Button
                key={index}
                variant={currentPage === pageNum ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(pageNum)}
                className="min-w-[32px]"
              >
                {pageNum}
              </Button>
            ) : (
              <span key={index} className="px-1 text-gray-500">
                {pageNum}
              </span>
            )
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            {locale === "ar" ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
