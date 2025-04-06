import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Bundle } from "./bundleApi";

interface BundleFormProps {
  bundle?: Bundle | null;
  onSubmit: (
    bundleData: Omit<Bundle, "_id" | "createdAt" | "updatedAt" | "userId">
  ) => void;
  onCancel: () => void;
}

export function BundleForm({ bundle, onSubmit, onCancel }: BundleFormProps) {
  const [name, setName] = useState(bundle?.name || "");
  const [price, setPrice] = useState(bundle?.price.toString() || "");
  const [credits, setCredits] = useState(bundle?.credits.toString() || "");
  const [discount, setDiscount] = useState(bundle?.discount.toString() || "0");
  const [validity, setValidity] = useState(bundle?.validity.toString() || "");
  const [support, setSupport] = useState(bundle?.support || "Basic support");
  const [features, setFeatures] = useState(bundle?.features.join("\n") || "");
  const [activationDate, setActivationDate] = useState(() => {
    if (bundle?.activationDate instanceof Date) {
      return bundle.activationDate.toISOString().split("T")[0];
    } else if (typeof bundle?.activationDate === "string") {
      return new Date(bundle.activationDate).toISOString().split("T")[0];
    }
    return "";
  });
  const [bonus, setBonus] = useState(bundle?.bonus || "5");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      price: Number.parseFloat(price),
      credits: Number.parseInt(credits),
      discount: Number.parseFloat(discount),
      validity: Number.parseInt(validity),
      support: support as Bundle["support"],
      features: features.split("\n").filter((feature) => feature.trim() !== ""),
      activationDate: activationDate ? new Date(activationDate) : undefined,
      bonus: bonus as Bundle["bonus"],
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">
            Name
          </Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="h-8 text-sm"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price" className="text-sm font-medium">
            Price
          </Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="h-8 text-sm"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="credits" className="text-sm font-medium">
            Credits
          </Label>
          <Input
            id="credits"
            type="number"
            value={credits}
            onChange={(e) => setCredits(e.target.value)}
            required
            className="h-8 text-sm"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="discount" className="text-sm font-medium">
            Discount (%)
          </Label>
          <Input
            id="discount"
            type="number"
            step="0.01"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            className="h-8 text-sm"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="validity" className="text-sm font-medium">
            Validity (months)
          </Label>
          <Input
            id="validity"
            type="number"
            value={validity}
            onChange={(e) => setValidity(e.target.value)}
            required
            className="h-8 text-sm"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="support" className="text-sm font-medium">
            Support
          </Label>
          <Select value={support} onValueChange={setSupport}>
            <SelectTrigger className="h-8 text-sm">
              <SelectValue placeholder="Select support type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="VIP">VIP</SelectItem>
              <SelectItem value="Dedicated account manager">
                Dedicated account manager
              </SelectItem>
              <SelectItem value="24/7 support">24/7 support</SelectItem>
              <SelectItem value="Basic support">Basic support</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="activationDate" className="text-sm font-medium">
            Activation Date
          </Label>
          <Input
            id="activationDate"
            type="date"
            value={activationDate}
            onChange={(e) => setActivationDate(e.target.value)}
            className="h-8 text-sm"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bonus" className="text-sm font-medium">
            Bonus
          </Label>
          <Select value={bonus} onValueChange={setBonus}>
            <SelectTrigger className="h-8 text-sm">
              <SelectValue placeholder="Select bonus" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5%</SelectItem>
              <SelectItem value="10">10%</SelectItem>
              <SelectItem value="20">20%</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="features" className="text-sm font-medium">
          Features (one per line)
        </Label>
        <Textarea
          id="features"
          value={features}
          onChange={(e) => setFeatures(e.target.value)}
          rows={3}
          className="text-sm"
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="h-8 text-sm"
        >
          Cancel
        </Button>
        <Button type="submit" className="h-8 text-sm">
          {bundle ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  );
}
