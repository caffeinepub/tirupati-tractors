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
  Package,
  Plus,
  Settings,
  Tractor,
  Trash2,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Product, ShowroomInfo } from "../backend.d";
import ProductForm from "../components/ProductForm";
import { SAMPLE_PRODUCTS } from "../data/products";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAddProduct,
  useClaimAdminByEmail,
  useDeleteProduct,
  useGetAllProducts,
  useGetShowroomInfo,
  useIsAdmin,
  useUpdateProduct,
  useUpdateShowroomInfo,
} from "../hooks/useQueries";

type ProductWithId = Product & { id: bigint };

export default function AdminPage() {
  const { identity } = useInternetIdentity();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const { data: backendProducts, isLoading: productsLoading } =
    useGetAllProducts();
  const { data: showroom } = useGetShowroomInfo();

  const addProduct = useAddProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const updateShowroom = useUpdateShowroomInfo();
  const claimAdmin = useClaimAdminByEmail();

  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<ProductWithId | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ProductWithId | null>(null);
  const [showroomForm, setShowroomForm] = useState<ShowroomInfo | null>(null);
  const [claimEmail, setClaimEmail] = useState("");

  const products = (
    backendProducts && backendProducts.length > 0
      ? backendProducts.map((p, i) => ({ ...p, id: BigInt(i) }))
      : SAMPLE_PRODUCTS
  ) as ProductWithId[];

  if (!identity) {
    return (
      <div
        className="max-w-[600px] mx-auto px-4 py-20 text-center"
        data-ocid="admin.panel"
      >
        <div className="bg-card rounded-xl border border-border p-10">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-display font-bold mb-2">
            Admin Access Required
          </h2>
          <p className="text-muted-foreground text-sm">
            Please log in to access the admin dashboard.
          </p>
        </div>
      </div>
    );
  }

  if (adminLoading) {
    return (
      <div
        className="flex items-center justify-center py-20"
        data-ocid="admin.loading_state"
      >
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    const handleClaimAdmin = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!claimEmail.trim()) return;
      try {
        const result = await claimAdmin.mutateAsync(claimEmail.trim());
        if (result === true) {
          toast.success("Admin access granted! Reloading...");
          setTimeout(() => window.location.reload(), 1000);
        } else {
          toast.error("Email not recognized as admin.");
        }
      } catch {
        toast.error("Failed to claim admin access.");
      }
    };

    return (
      <div
        className="max-w-[500px] mx-auto px-4 py-20 text-center"
        data-ocid="admin.panel"
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl border border-border p-10"
        >
          <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-display font-bold mb-2">Access Denied</h2>
          <p className="text-muted-foreground text-sm mb-6">
            If you have admin access, enter your admin email below to activate
            it.
          </p>

          <form onSubmit={handleClaimAdmin} className="text-left space-y-3">
            <div>
              <Label htmlFor="claim-email" className="text-sm font-medium">
                Admin Email
              </Label>
              <Input
                id="claim-email"
                type="email"
                placeholder="Enter your admin email"
                value={claimEmail}
                onChange={(e) => setClaimEmail(e.target.value)}
                disabled={claimAdmin.isPending}
                className="mt-1"
                data-ocid="admin.input"
              />
            </div>
            <Button
              type="submit"
              disabled={claimAdmin.isPending || !claimEmail.trim()}
              className="w-full bg-primary text-primary-foreground hover:bg-secondary font-semibold"
              data-ocid="admin.submit_button"
            >
              {claimAdmin.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Claim Admin Access"
              )}
            </Button>
          </form>
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
      await updateProduct.mutateAsync({ id: editProduct.id, product });
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
    phone: "+91 98765 43210",
    email: "info@tirupatitractors.in",
  };

  return (
    <main className="max-w-[1200px] mx-auto px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
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
          {/* Prominent Add CTA banner */}
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
              className="bg-primary text-primary-foreground hover:bg-secondary font-semibold px-5 shrink-0"
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
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">
                      Price (Lakh ₹)
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
                      key={`${p.name}-${i}`}
                      className="border-t border-border hover:bg-muted/30 transition-colors"
                      data-ocid={`admin.row.${i + 1}`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              p.imageUrl ||
                              "/assets/generated/tractor-744.dim_600x400.jpg"
                            }
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
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className="text-primary font-medium">
                          ₹{p.priceMin}–{p.priceMax}L
                        </span>
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

                  {/* Placeholder row — signals room for more */}
                  <tr className="border-t border-dashed border-border">
                    <td colSpan={6} className="px-4 py-4">
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
