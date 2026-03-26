import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle,
  Edit2,
  Loader2,
  Lock,
  Package,
  Plus,
  Settings,
  Tractor,
  Trash2,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import type { Product, ProductEntry, ShowroomInfo } from "../backend.d";
import ProductForm from "../components/ProductForm";
import { SAMPLE_PRODUCTS } from "../data/products";
import {
  useAddProduct,
  useDeleteProduct,
  useGetAllProducts,
  useGetShowroomInfo,
  useUpdateProduct,
  useUpdateShowroomInfo,
} from "../hooks/useQueries";

const ADMIN_PASSCODE = "515151";
const KNOWN_MODELS = ["735 FE", "744 XT", "744 FE", "855 FE", "855 XM"];

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(
    () => localStorage.getItem("adminUnlocked") === "true",
  );
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");

  const { data: backendProducts, isLoading: productsLoading } =
    useGetAllProducts();
  const { data: showroom } = useGetShowroomInfo();

  const addProduct = useAddProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const updateShowroom = useUpdateShowroomInfo();

  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<ProductEntry | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ProductEntry | null>(null);
  const [showroomForm, setShowroomForm] = useState<ShowroomInfo | null>(null);

  // Always show exactly the 5 known models, merging backend edits if available
  const products: ProductEntry[] = useMemo(() => {
    return SAMPLE_PRODUCTS.map((sample) => {
      if (backendProducts && backendProducts.length > 0) {
        const match = backendProducts.find((bp) => bp.model === sample.model);
        if (match) {
          return {
            ...match,
            imageUrl:
              match.imageUrl && !match.imageUrl.startsWith("http")
                ? match.imageUrl
                : sample.imageUrl,
          };
        }
      }
      return sample;
    }).filter((p) => KNOWN_MODELS.includes(p.model));
  }, [backendProducts]);

  const handlePasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === ADMIN_PASSCODE) {
      localStorage.setItem("adminUnlocked", "true");
      setIsAdmin(true);
      setError("");
    } else {
      setError("Incorrect passcode. Please try again.");
      setPasscode("");
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-[420px]"
          data-ocid="admin.panel"
        >
          <div className="bg-card rounded-2xl border border-border shadow-lg p-10">
            <div className="flex flex-col items-center mb-8">
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <Lock className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-2xl font-display font-bold text-foreground">
                Admin Access
              </h1>
              <p className="text-muted-foreground text-sm mt-1 text-center">
                Enter your passcode to manage the dashboard
              </p>
            </div>

            <form onSubmit={handlePasscodeSubmit} className="space-y-4">
              <div>
                <Label htmlFor="passcode" className="text-sm font-medium">
                  Passcode
                </Label>
                <Input
                  id="passcode"
                  type="password"
                  placeholder="Enter passcode"
                  value={passcode}
                  onChange={(e) => {
                    setPasscode(e.target.value);
                    setError("");
                  }}
                  className="mt-1.5"
                  autoFocus
                  data-ocid="admin.input"
                />
                {error && (
                  <p
                    className="text-destructive text-sm mt-1.5"
                    data-ocid="admin.error_state"
                  >
                    {error}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                disabled={!passcode.trim()}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold py-5"
                data-ocid="admin.submit_button"
              >
                Enter Admin
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  const handleAddProduct = async (product: Product) => {
    try {
      await addProduct.mutateAsync(product);
      toast.success("Product added successfully");
      setShowForm(false);
    } catch {
      toast.error("Failed to add product");
    }
  };

  const handleUpdateProduct = async (product: Product) => {
    if (!editProduct) return;
    try {
      await updateProduct.mutateAsync({
        id: editProduct.id,
        product: product,
      });
      toast.success("Product updated successfully");
      setEditProduct(null);
    } catch {
      toast.error("Failed to update product");
    }
  };

  const handleDeleteProduct = async () => {
    if (!deleteTarget) return;
    try {
      await deleteProduct.mutateAsync(deleteTarget.id);
      toast.success("Product deleted");
      setDeleteTarget(null);
    } catch {
      toast.error("Failed to delete product");
    }
  };

  const handleUpdateShowroom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showroomForm) return;
    try {
      await updateShowroom.mutateAsync(showroomForm);
      toast.success("Showroom info updated");
    } catch {
      toast.error("Failed to update showroom info");
    }
  };

  const currentShowroom: ShowroomInfo = showroom || {
    name: "Tirupati Tractors",
    address: "Sendhwa Varla Road, Balwadi, Madhya Pradesh",
    phone: "+91 94245 69451",
    email: "Tirupatitractor551@gmail.com",
  };

  return (
    <main className="max-w-[1200px] mx-auto px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Settings className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-foreground">
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground text-sm">
                Manage your product catalog and showroom info
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              localStorage.removeItem("adminUnlocked");
              setIsAdmin(false);
            }}
            data-ocid="admin.secondary_button"
          >
            Lock
          </Button>
        </div>
      </motion.div>

      <Tabs defaultValue="products">
        <TabsList className="mb-6">
          <TabsTrigger value="products" data-ocid="admin.tab">
            Products
          </TabsTrigger>
          <TabsTrigger value="showroom" data-ocid="admin.tab">
            Showroom Info
          </TabsTrigger>
        </TabsList>

        {/* Products Tab */}
        <TabsContent value="products">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-primary/5 border border-primary/20 rounded-xl px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6"
          >
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2.5 rounded-lg">
                <Tractor className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">
                  {products.length} model{products.length !== 1 ? "s" : ""}{" "}
                  listed
                  <span className="text-muted-foreground font-normal">
                    {" "}
                    · Add more anytime
                  </span>
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Your catalog grows as your showroom expands
                </p>
              </div>
            </div>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-5 shrink-0"
              size="lg"
              data-ocid="admin.primary_button"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add New Tractor Model
            </Button>
          </motion.div>

          {productsLoading ? (
            <div className="text-center py-10" data-ocid="admin.loading_state">
              <Loader2 className="h-8 w-8 text-primary animate-spin mx-auto" />
            </div>
          ) : products.length === 0 ? (
            <div
              className="text-center py-16 bg-card border border-border rounded-lg"
              data-ocid="admin.empty_state"
            >
              <Package className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">
                No products yet. Add your first tractor model!
              </p>
            </div>
          ) : (
            <div
              className="bg-card border border-border rounded-lg overflow-hidden"
              data-ocid="admin.table"
            >
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                      Product
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">
                      Category
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">
                      HP
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="text-right px-4 py-3 font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p, i) => (
                    <tr
                      key={String(p.id)}
                      className="border-t border-border hover:bg-muted/30 transition-colors"
                      data-ocid={`admin.row.${i + 1}`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.imageUrl}
                            alt={p.name}
                            className="h-10 w-14 object-cover rounded"
                          />
                          <div>
                            <p className="font-medium text-foreground flex items-center gap-1.5">
                              {p.name}
                              {p.model === "744 XT" && (
                                <span className="text-xs bg-gold text-gold-foreground px-1.5 py-0.5 rounded font-semibold">
                                  Best Seller
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {p.model}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <Badge variant="outline">{p.category}</Badge>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell text-muted-foreground">
                        {Number(p.hpMin)}–{Number(p.hpMax)} HP
                      </td>
                      <td className="px-4 py-3">
                        {p.isAvailable ? (
                          <span className="flex items-center gap-1 text-green-600 text-xs">
                            <CheckCircle className="h-3.5 w-3.5" /> Available
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-muted-foreground text-xs">
                            <XCircle className="h-3.5 w-3.5" /> Unavailable
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setEditProduct(p)}
                            data-ocid={`admin.row.${i + 1}.edit_button`}
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => setDeleteTarget(p)}
                            data-ocid={`admin.row.${i + 1}.delete_button`}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {/* Placeholder row */}
                  <tr className="border-t border-dashed border-border">
                    <td colSpan={5} className="px-4 py-4">
                      <button
                        type="button"
                        onClick={() => setShowForm(true)}
                        className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
                        data-ocid="admin.empty_state"
                      >
                        <span className="h-7 w-7 rounded-full border-2 border-dashed border-muted-foreground/40 group-hover:border-primary flex items-center justify-center transition-colors">
                          <Plus className="h-3.5 w-3.5" />
                        </span>
                        <span>
                          Click 'Add New Tractor Model' to add your next model
                          here
                        </span>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>

        {/* Showroom Tab */}
        <TabsContent value="showroom">
          <div className="max-w-xl">
            <h2 className="font-semibold text-lg mb-6">Showroom Information</h2>
            <form
              onSubmit={handleUpdateShowroom}
              className="bg-card border border-border rounded-lg p-6 space-y-4"
            >
              <div>
                <Label>Showroom Name</Label>
                <Input
                  value={showroomForm?.name ?? currentShowroom.name}
                  onChange={(e) =>
                    setShowroomForm((prev) => ({
                      ...(prev ?? currentShowroom),
                      name: e.target.value,
                    }))
                  }
                  data-ocid="showroom_form.input"
                />
              </div>
              <div>
                <Label>Address</Label>
                <Textarea
                  value={showroomForm?.address ?? currentShowroom.address}
                  onChange={(e) =>
                    setShowroomForm((prev) => ({
                      ...(prev ?? currentShowroom),
                      address: e.target.value,
                    }))
                  }
                  rows={3}
                  data-ocid="showroom_form.textarea"
                />
              </div>
              <div>
                <Label>Phone</Label>
                <Input
                  value={showroomForm?.phone ?? currentShowroom.phone}
                  onChange={(e) =>
                    setShowroomForm((prev) => ({
                      ...(prev ?? currentShowroom),
                      phone: e.target.value,
                    }))
                  }
                  data-ocid="showroom_form.input"
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={showroomForm?.email ?? currentShowroom.email}
                  onChange={(e) =>
                    setShowroomForm((prev) => ({
                      ...(prev ?? currentShowroom),
                      email: e.target.value,
                    }))
                  }
                  data-ocid="showroom_form.input"
                />
              </div>
              <Button
                type="submit"
                disabled={updateShowroom.isPending || !showroomForm}
                className="bg-primary text-primary-foreground"
                data-ocid="showroom_form.submit_button"
              >
                {updateShowroom.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : null}
                {updateShowroom.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Product Dialog */}
      <Dialog open={showForm} onOpenChange={(o) => !o && setShowForm(false)}>
        <DialogContent
          className="max-w-2xl max-h-[90vh] overflow-y-auto"
          data-ocid="add_product.dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display">
              Add New Tractor Model
            </DialogTitle>
          </DialogHeader>
          <ProductForm
            onSubmit={handleAddProduct}
            onCancel={() => setShowForm(false)}
            isPending={addProduct.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog
        open={!!editProduct}
        onOpenChange={(o) => !o && setEditProduct(null)}
      >
        <DialogContent
          className="max-w-2xl max-h-[90vh] overflow-y-auto"
          data-ocid="edit_product.dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display">Edit Product</DialogTitle>
          </DialogHeader>
          {editProduct && (
            <ProductForm
              initial={editProduct}
              onSubmit={handleUpdateProduct}
              onCancel={() => setEditProduct(null)}
              isPending={updateProduct.isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
      >
        <AlertDialogContent data-ocid="delete_product.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <strong>{deleteTarget?.name}</strong>? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="delete_product.cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteProduct}
              className="bg-destructive text-destructive-foreground"
              data-ocid="delete_product.confirm_button"
            >
              {deleteProduct.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
