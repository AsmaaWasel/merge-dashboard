"use client";

import type React from "react";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ConfirmationModal from "./ConfirmationModal";

interface Service {
  _id: string;
  name: string;
  description: string;
  url: string;
  favourite: any[];
}

interface ServiceTableProps {
  services: Service[];
  categoryId: string;
  onServiceUpdated: () => void;
}

const ServiceTable: React.FC<ServiceTableProps> = ({
  services,
  categoryId,
  onServiceUpdated,
}) => {
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);

  const handleEdit = (service: Service) => {
    setEditingService(service);
  };

  const handleCancelEdit = () => {
    setEditingService(null);
  };

  const handleSaveEdit = async () => {
    if (!editingService) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://api.merge.ws:8000/api/auth/category/${categoryId}/service/${editingService._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: editingService.name,
            description: editingService.description,
            url: editingService.url,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update service");
      }

      setEditingService(null);
      onServiceUpdated();
    } catch (error) {
      console.error("Error updating service:", error);
      // Handle error (e.g., show an error message to the user)
    }
  };

  const handleDelete = (service: Service) => {
    setServiceToDelete(service);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!serviceToDelete) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://api.merge.ws:8000/api/auth/category/${categoryId}/service/${serviceToDelete._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete service");
      }

      setIsDeleteModalOpen(false);
      setServiceToDelete(null);
      onServiceUpdated();
    } catch (error) {
      console.error("Error deleting service:", error);
      // Handle error (e.g., show an error message to the user)
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>URL</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.map((service) => (
            <TableRow key={service._id}>
              <TableCell>
                {editingService?._id === service._id ? (
                  <Input
                    value={editingService.name}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        name: e.target.value,
                      })
                    }
                  />
                ) : (
                  service.name
                )}
              </TableCell>
              <TableCell>
                {editingService?._id === service._id ? (
                  <Input
                    value={editingService.description}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        description: e.target.value,
                      })
                    }
                  />
                ) : (
                  service.description
                )}
              </TableCell>
              <TableCell>
                {editingService?._id === service._id ? (
                  <Input
                    value={editingService.url}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        url: e.target.value,
                      })
                    }
                  />
                ) : (
                  service.url
                )}
              </TableCell>
              <TableCell>
                {editingService?._id === service._id ? (
                  <>
                    <Button onClick={handleSaveEdit} className="mr-2">
                      Save
                    </Button>
                    <Button onClick={handleCancelEdit} variant="outline">
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={() => handleEdit(service)}
                      className="mr-2"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(service)}
                      variant="destructive"
                    >
                      Delete
                    </Button>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Confirm Delete"
        description="Are you sure you want to delete this service? This action cannot be undone."
      />
    </>
  );
};

export default ServiceTable;
