import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle, MessageCircle, X, XCircle } from "lucide-react";
import type { ProductEntry } from "../backend.d";

interface ProductModalProps {
  product: ProductEntry | null;
  open: boolean;
  onClose: () => void;
}

export default function ProductModal({
  product,
  open,
  onClose,
}: ProductModalProps) {
  if (!product) return null;

  const waText = encodeURIComponent(
    `Hi, I am interested in ${product.name}. Please share the price quote.`,
  );

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="max-w-2xl max-h-[90vh] overflow-y-auto"
        data-ocid="products.dialog"
      >
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                {product.model}
              </p>
              <DialogTitle className="font-display text-xl font-bold text-foreground">
                {product.name}
              </DialogTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
              data-ocid="products.dialog.close_button"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="mt-4">
          <img
            src={
              product.imageUrl ||
              "/assets/generated/tractor-744.dim_600x400.jpg"
            }
            alt={product.name}
            className="w-full h-56 object-cover rounded-lg mb-4"
          />

          <div className="flex items-center gap-2 mb-4">
            <Badge className="bg-primary text-primary-foreground">
              {product.category}
            </Badge>
            {product.isAvailable ? (
              <Badge
                variant="outline"
                className="border-green-500 text-green-600"
              >
                <CheckCircle className="h-3 w-3 mr-1" /> In Stock
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="border-destructive text-destructive"
              >
                <XCircle className="h-3 w-3 mr-1" /> Out of Stock
              </Badge>
            )}
          </div>

          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            {product.description}
          </p>

          <div className="bg-muted rounded-lg p-3 mb-4">
            <p className="text-xs text-muted-foreground">HP Range</p>
            <p className="font-bold text-foreground">
              {Number(product.hpMin)}–{Number(product.hpMax)} HP
            </p>
          </div>

          {product.features.length > 0 && (
            <div>
              <h4 className="font-semibold text-sm mb-2">Key Features</h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {product.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <a
            href={`https://wa.me/919424569451?text=${waText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full mt-6"
            data-ocid="products.dialog.primary_button"
          >
            <Button className="w-full bg-primary text-primary-foreground hover:bg-secondary">
              <MessageCircle className="h-4 w-4 mr-2" />
              Get Price Quote on WhatsApp
            </Button>
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}
