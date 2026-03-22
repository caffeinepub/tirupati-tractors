import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Filter, Search } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import type { ProductEntry } from "../backend.d";
import ProductCard from "../components/ProductCard";
import ProductModal from "../components/ProductModal";
import { SAMPLE_PRODUCTS } from "../data/products";
import { useGetAllProducts } from "../hooks/useQueries";

const CATEGORIES = ["All", "Tractors", "Mini Tractors", "Heavy Duty"];

export default function ModelsPage() {
  const { data: backendProducts, isLoading } = useGetAllProducts();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState<ProductEntry | null>(null);

  const products: ProductEntry[] = useMemo(() => {
    if (backendProducts && backendProducts.length > 0) return backendProducts;
    return SAMPLE_PRODUCTS;
  }, [backendProducts]);

  const filtered = useMemo(() => {
    let result = products;
    if (category !== "All")
      result = result.filter((p) => p.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) || p.model.toLowerCase().includes(q),
      );
    }
    return result;
  }, [products, category, search]);

  return (
    <main className="max-w-[1200px] mx-auto px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-display font-bold text-foreground mb-1">
          Tractor Models
        </h1>
        <p className="text-muted-foreground text-sm">
          {products.length} model{products.length !== 1 ? "s" : ""} available —
          from 35 to 55 HP
        </p>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or model..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            data-ocid="models.search_input"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Filter className="h-4 w-4 text-muted-foreground mt-2.5 shrink-0" />
          {CATEGORIES.map((c) => (
            <Button
              key={c}
              size="sm"
              variant={category === c ? "default" : "outline"}
              className={
                category === c
                  ? "bg-primary text-primary-foreground"
                  : "border-border"
              }
              onClick={() => setCategory(c)}
              data-ocid="models.tab"
            >
              {c}
            </Button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton
              key={i}
              className="h-96 rounded-lg"
              data-ocid="models.loading_state"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div
          className="text-center py-20 text-muted-foreground"
          data-ocid="models.empty_state"
        >
          <p className="text-lg font-medium">No tractors found</p>
          <p className="text-sm mt-1">
            Try adjusting your search or category filter
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p, i) => (
            <motion.div
              key={String(p.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <ProductCard
                product={p}
                index={i + 1}
                onViewSpecs={setSelected}
                onGetQuote={(prod) =>
                  window.open(
                    `https://wa.me/919424569451?text=${encodeURIComponent(`Hi, I am interested in ${prod.name}. Please share the price quote.`)}`,
                    "_blank",
                  )
                }
              />
            </motion.div>
          ))}
        </div>
      )}

      <ProductModal
        product={selected}
        open={!!selected}
        onClose={() => setSelected(null)}
      />
    </main>
  );
}
