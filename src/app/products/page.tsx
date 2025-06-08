"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MainLayout from "@/components/layouts/MainLayout";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { Search } from "lucide-react";

const supabase = createClient();

const PAGE_SIZE = 10;

interface Product {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  created_at: string;
}

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    (async () => {
      setLoading(true);

      const query = supabase
        .from("products")
        .select("*", { count: "exact" })
        .ilike("name", `%${search}%`)
        .order("created_at", { ascending: false })
        .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

      const { data, count, error } = await query;

      if (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
        setTotalCount(0);
      } else {
        setProducts(data || []);
        setTotalCount(count || 0);
      }

      setLoading(false);
    })();
  }, [search, page]);

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
    setPage(1);
  }

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const footerContent = (
    <Pagination className="mb-4">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            aria-disabled={page <= 1}
            href="#"
            className={page <= 1 ? "pointer-events-none opacity-50" : undefined}
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
          />
        </PaginationItem>
        {Array.from({ length: totalPages }, (_, i) => (
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              isActive={page === i + 1}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        ))}
        {totalPages > 5 && page < totalPages - 2 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {page >= totalPages && (
          <PaginationItem>
            <PaginationNext
              aria-disabled={page >= totalPages}
              className={
                page >= totalPages
                  ? "pointer-events-none opacity-50"
                  : undefined
              }
              href="#"
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
  return (
    <MainLayout footerContent={footerContent}>
      <div className="flex flex-col">
        <div className="flex-1 max-w-4xl mx-auto container">
          <div className="flex items-center justify-between mb-6 sticky top-12 z-100">
            <Search className="absolute ml-4 z-10" />
            <Input
              placeholder="Search products..."
              type="text"
              value={search}
              onChange={handleSearchChange}
              className="py-6 px-4 pl-14 text-lg font-geist-sans bg-background z-9"
            />
          </div>
          {loading && <p>Loading...</p>}

          {!loading && products.length === 0 && <p>No products found</p>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.map((product) => (
              <Card key={product.id}>
                <CardHeader>
                  <CardTitle>{product.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  {product.image_url && (
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      width={300}
                      height={200}
                      className="mb-2 w-full h-48 object-cover object-center rounded"
                    />
                  )}
                  {product.description}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
