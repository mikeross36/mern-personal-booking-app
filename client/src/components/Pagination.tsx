import { useMemo } from "react";
import { Button } from "./ui/button";

export type PaginationType = {
  currentPage: number;
  totalPages: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
};

export default function Pagination({
  currentPage,
  totalPages,
  setCurrentPage,
}: PaginationType) {
  const pageNumbers = useMemo(
    () => Array.from({ length: totalPages }, (_, idx) => idx + 1),
    [totalPages]
  );
  return (
    <div className="flex justify-center">
      <ul className="flex border border-slate-300">
        {pageNumbers.map((number) => {
          return (
            <li
              key={number}
              className={`p-1 ${currentPage === number ? "bg-gray-200" : ""}`}
            >
              <Button
                onClick={() => setCurrentPage(number)}
                variant={"secondary"}
              >
                {number}
              </Button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
