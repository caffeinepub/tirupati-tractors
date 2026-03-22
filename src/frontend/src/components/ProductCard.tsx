import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, MessageSquare, Star } from "lucide-react";
import type { ProductEntry } from "../backend.d";
import { BEST_SELLER_MODEL } from "../data/products";

interface ProductCardProps {
  product: ProductEntry;
  index: number;
  onViewSpecs: (product: ProductEntry) => void;
  onGetQuote: (product: ProductEntry) => void;
}

export default function ProductCard({
  product,
  index,
  onViewSpecs,
  onGetQuote: _onGetQuote,
}: ProductCardProps) {
  const imgSrc =
    product.imageUrl || "/assets/generated/tractor-744.dim_600x400.jpg";
  const isBestSeller = product.model === BEST_SELLER_MODEL;

  const handleGetQuote = () => {
    const text = encodeURIComponent(
      `Hi, I am interested in ${product.name}. Please share the price quote.`,
    );
    window.open(`https://wa.me/919424569451?text=${text}`, "_blank");
  };

  return (
    <div
      className="bg-card rounded-lg border border-border shadow-card overflow-hidden flex flex-col hover:shadow-md transition-shadow relative"
      data-ocid={`products.item.${index}`}
    >
      {/* Best Seller ribbon */}
      {isBestSeller && (
        <div className="absolute top-3 left-0 z-10">
          <div className="bg-gold text-gold-foreground text-xs font-bold px-3 py-1 rounded-r-full shadow-sm flex items-center gap-1">
            <Star className="h-3 w-3 fill-current" />
            Best Seller
          </div>
        </div>
      )}

      <div className="relative overflow-hidden bg-muted h-48">
        <img
          src={imgSrc}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {!product.isAvailable && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <Badge variant="secondary">Out of Stock</Badge>
          </div>
        )}
        <Badge
          className={`absolute top-2 right-2 text-xs ${
            isBestSeller
              ? "bg-gold text-gold-foreground"
              : "bg-primary text-primary-foreground"
          }`}
        >
          {product.category}
        </Badge>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="mb-1">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
            {product.model}
          </p>
          <h3 className="font-display font-bold text-base text-foreground mt-0.5 leading-tight">
            {product.name}
          </h3>
        </div>

        {/* Star rating */}
        <div className="flex items-center gap-0.5 mb-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              className={`h-3 w-3 ${
                s <= (isBestSeller ? 5 : 4)
                  ? "fill-gold text-gold"
                  : "text-muted-foreground"
              }`}
            />
          ))}
          <span className="text-xs text-muted-foreground ml-1">
            {isBestSeller ? "5.0" : "4.0"}
          </span>
        </div>

        {/* Specs */}
        <ul className="text-xs text-muted-foreground space-y-1 mb-3">
          <li className="flex gap-1">
            <span className="font-medium text-foreground">HP:</span>
            {Number(product.hpMin)}–{Number(product.hpMax)} HP
          </li>
          {product.features.slice(0, 2).map((f) => (
            <li key={f} className="truncate">
              • {f}
            </li>
          ))}
        </ul>

        {/* Description preview if available */}
        {product.description && (
          <p className="text-xs text-muted-foreground mb-3 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}

        <div className="mt-auto">
          <div className="flex gap-2 mt-3">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-xs border-primary text-primary hover:bg-muted"
              onClick={() => onViewSpecs(product)}
              data-ocid={`products.item.${index}.secondary_button`}
            >
              <Eye className="h-3.5 w-3.5 mr-1" />
              View Specs
            </Button>
            <Button
              size="sm"
              className={`flex-1 text-xs ${
                isBestSeller
                  ? "bg-gold text-gold-foreground hover:bg-gold/90"
                  : "bg-primary text-primary-foreground hover:bg-secondary"
              }`}
              onClick={handleGetQuote}
              data-ocid={`products.item.${index}.primary_button`}
            >
              <MessageSquare className="h-3.5 w-3.5 mr-1" />
              Get Quote
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
