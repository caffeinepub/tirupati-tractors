import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus, Loader2, Plus, Trash2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import type { Product } from "../backend.d";
import { useImageUpload } from "../hooks/useImageUpload";

const CATEGORIES = [
  "Tractors",
  "Mini Tractors",
  "Heavy Duty",
  "Implements",
  "Accessories",
];

interface ProductFormProps {
  initial?: Product & { id?: bigint };
  onSubmit: (product: Product) => void;
  onCancel: () => void;
  isPending: boolean;
}

const blank: Product = {
  name: "",
  model: "",
  category: "Tractors",
  description: "",
  hpMin: BigInt(0),
  hpMax: BigInt(0),
  priceMin: 0,
  priceMax: 0,
  imageUrl: "",
  features: [],
  isAvailable: true,
};

export default function ProductForm({
  initial,
  onSubmit,
  onCancel,
  isPending,
}: ProductFormProps) {
  const [form, setForm] = useState<Product>(initial ?? blank);
  const [newFeature, setNewFeature] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadImage, isUploading, uploadProgress } = useImageUpload();

  const set = (key: keyof Product, value: any) =>
    setForm((p) => ({ ...p, [key]: value }));

  const addFeature = () => {
    if (!newFeature.trim()) return;
    set("features", [...form.features, newFeature.trim()]);
    setNewFeature("");
  };

  const removeFeature = (i: number) =>
    set(
      "features",
      form.features.filter((_, idx) => idx !== i),
    );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addFeature();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadImage(file);
      set("imageUrl", url);
    } catch {
      // silent — progress resets automatically
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Product Name *</Label>
          <Input
            required
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="Swaraj 744 FE"
            data-ocid="product_form.input"
          />
        </div>
        <div>
          <Label>Model *</Label>
          <Input
            required
            value={form.model}
            onChange={(e) => set("model", e.target.value)}
            placeholder="744 FE"
            data-ocid="product_form.input"
          />
        </div>
      </div>

      <div>
        <Label>Category</Label>
        <Select value={form.category} onValueChange={(v) => set("category", v)}>
          <SelectTrigger data-ocid="product_form.select">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="flex items-center gap-2">
          Description
          <span className="text-xs text-muted-foreground font-normal">
            (you can add this later)
          </span>
        </Label>
        <Textarea
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          rows={5}
          placeholder="Add product description here..."
          className="resize-y"
          data-ocid="product_form.textarea"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>HP Min</Label>
          <Input
            type="number"
            value={Number(form.hpMin)}
            onChange={(e) => set("hpMin", BigInt(e.target.value || "0"))}
            data-ocid="product_form.input"
          />
        </div>
        <div>
          <Label>HP Max</Label>
          <Input
            type="number"
            value={Number(form.hpMax)}
            onChange={(e) => set("hpMax", BigInt(e.target.value || "0"))}
            data-ocid="product_form.input"
          />
        </div>
      </div>

      <div className="bg-muted/50 rounded-lg p-4 space-y-3">
        <p className="text-sm font-semibold text-foreground">
          💰 Price Range (in Lakh ₹)
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Starting Price (Min) *</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                ₹
              </span>
              <Input
                type="number"
                step="0.1"
                min="0"
                value={form.priceMin}
                onChange={(e) =>
                  set("priceMin", Number.parseFloat(e.target.value) || 0)
                }
                className="pl-7"
                placeholder="e.g. 7.5"
                data-ocid="product_form.input"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">Lakh*</p>
          </div>
          <div>
            <Label>Maximum Price (Max)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                ₹
              </span>
              <Input
                type="number"
                step="0.1"
                min="0"
                value={form.priceMax}
                onChange={(e) =>
                  set("priceMax", Number.parseFloat(e.target.value) || 0)
                }
                className="pl-7"
                placeholder="e.g. 8.5"
                data-ocid="product_form.input"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">Lakh*</p>
          </div>
        </div>
      </div>

      {/* Image Upload */}
      <div>
        <Label>Product Image</Label>
        <div className="mt-1.5 flex items-start gap-3">
          <div className="shrink-0">
            {form.imageUrl ? (
              <img
                src={form.imageUrl}
                alt="preview"
                className="h-20 w-28 object-cover rounded-lg border border-border"
              />
            ) : (
              <div className="h-20 w-28 rounded-lg border border-dashed border-border bg-muted flex items-center justify-center">
                <ImagePlus className="h-6 w-6 text-muted-foreground" />
              </div>
            )}
          </div>

          <div className="flex-1 space-y-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2"
              data-ocid="product_form.upload_button"
            >
              {isUploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              {isUploading ? "Uploading..." : "Upload Image"}
            </Button>

            {isUploading && uploadProgress !== null && (
              <div className="w-full" data-ocid="product_form.loading_state">
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-200"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {uploadProgress}% uploaded
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Features */}
      <div>
        <Label>Key Features</Label>
        <div className="flex gap-2 mb-2">
          <Input
            value={newFeature}
            onChange={(e) => setNewFeature(e.target.value)}
            placeholder="e.g. Power Steering, Dual Clutch..."
            onKeyDown={handleKeyDown}
            data-ocid="product_form.input"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addFeature}
            data-ocid="product_form.secondary_button"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <ul className="space-y-1">
          {form.features.map((f, i) => (
            <li
              key={`feature-${i}-${f}`}
              className="flex items-center gap-2 bg-muted rounded px-3 py-1 text-sm"
            >
              <span className="flex-1">{f}</span>
              <button
                type="button"
                onClick={() => removeFeature(i)}
                data-ocid={`product_form.delete_button.${i + 1}`}
              >
                <Trash2 className="h-3.5 w-3.5 text-destructive" />
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center gap-3">
        <Switch
          checked={form.isAvailable}
          onCheckedChange={(v) => set("isAvailable", v)}
          data-ocid="product_form.switch"
        />
        <Label>Available for sale</Label>
      </div>

      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
          data-ocid="product_form.cancel_button"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isPending || isUploading}
          className="flex-1 bg-primary text-primary-foreground"
          data-ocid="product_form.submit_button"
        >
          {isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
          {isPending ? "Saving..." : "Save Product"}
        </Button>
      </div>
    </form>
  );
}
