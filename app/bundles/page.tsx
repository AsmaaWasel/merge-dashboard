"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { BundleForm } from "./BundleForm";
import {
  type Bundle,
  getBundles,
  createBundle,
  updateBundle,
  deleteBundle,
} from "./bundleApi";

export default function BundlesPage() {
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentBundle, setCurrentBundle] = useState<Bundle | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchBundles();
  }, []);

  const fetchBundles = async () => {
    setIsLoading(true);
    try {
      const fetchedBundles = await getBundles();
      setBundles(fetchedBundles);
    } catch (error) {
      console.error("Error fetching bundles:", error);
      toast({ title: "Failed to fetch bundles", variant: "destructive" });
      setBundles([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (
    bundleData: Omit<Bundle, "_id" | "createdAt" | "updatedAt" | "userId">
  ) => {
    try {
      if (currentBundle) {
        const updatedBundle = await updateBundle(currentBundle._id, bundleData);
        setBundles(
          bundles.map((b) => (b._id === updatedBundle._id ? updatedBundle : b))
        );
        toast({ title: "Bundle updated successfully" });
      } else {
        const newBundle = await createBundle(bundleData);
        setBundles([...bundles, newBundle]);
        toast({ title: "New bundle created successfully" });
      }
      setIsFormOpen(false);
      setCurrentBundle(null);
    } catch (error) {
      console.error("Error saving bundle:", error);
      toast({ title: "Failed to save bundle", variant: "destructive" });
    }
  };

  const handleDelete = async () => {
    if (deleteId) {
      try {
        await deleteBundle(deleteId);
        setBundles(bundles.filter((b) => b._id !== deleteId));
        toast({ title: "Bundle deleted successfully" });
      } catch (error) {
        console.error("Error deleting bundle:", error);
        toast({ title: "Failed to delete bundle", variant: "destructive" });
      } finally {
        setIsDeleteDialogOpen(false);
        setDeleteId(null);
      }
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Bundles</h1>
      <Button onClick={() => setIsFormOpen(true)} className="mb-5">
        <Plus className="mr-2 h-4 w-4" /> Add New Bundle
      </Button>

      {isLoading ? (
        <p>Loading bundles...</p>
      ) : bundles.length === 0 ? (
        <p>No bundles found.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Credits</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Validity</TableHead>
              <TableHead>Support</TableHead>
              <TableHead>Features</TableHead>
              <TableHead>Activation Date</TableHead>
              <TableHead>Bonus</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bundles.map((bundle) => (
              <TableRow key={bundle._id}>
                <TableCell>{bundle.name}</TableCell>
                <TableCell>${bundle.price.toFixed(2)}</TableCell>
                <TableCell>{bundle.credits}</TableCell>
                <TableCell>{bundle.discount}%</TableCell>
                <TableCell>{bundle.validity} months</TableCell>
                <TableCell>{bundle.support}</TableCell>
                <TableCell>{bundle.features.join(", ")}</TableCell>
                <TableCell>
                  {bundle.activationDate
                    ? new Date(bundle.activationDate).toLocaleDateString()
                    : "N/A"}
                </TableCell>
                <TableCell>{bundle.bonus}%</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setCurrentBundle(bundle);
                      setIsFormOpen(true);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setDeleteId(bundle._id);
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentBundle ? "Edit Bundle" : "Create New Bundle"}
            </DialogTitle>
          </DialogHeader>
          <BundleForm
            bundle={currentBundle}
            onSubmit={handleSubmit}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this bundle? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
