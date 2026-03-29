"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import { createNiche } from "@/service/admin/settings/create-niche";
import { deleteListItem } from "@/service/admin/settings/delete-list-items";
import { updateListItem } from "@/service/admin/settings/update-list-item";

type NicheItem = {
  id: string;
  name: string;
};

type Props = {
  initialNiches: NicheItem[];
};

const NicheListCard = ({ initialNiches }: Props) => {
  const router = useRouter();

  const [niches, setNiches] = useState<NicheItem[]>(initialNiches || []);
  const [newNiche, setNewNiche] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleAdd = async () => {
    const trimmed = newNiche.trim();
    if (!trimmed) return;

    try {
      setIsAdding(true);

      const created = await createNiche({ name: trimmed });

      setNiches((prev) => [
        ...prev,
        {
          id: created.id,
          name: trimmed,
        },
      ]);

      setNewNiche("");
      toast.success("Niche added");
      router.refresh();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;

        if (
          typeof message === "string" &&
          message.toLowerCase().includes("already exists")
        ) {
          toast.error("Already exists");
          return;
        }
      }
      toast.error("Failed to add niche");
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (itemId: string, index: number) => {
    try {
      setDeletingId(itemId);

      await deleteListItem(itemId);

      setNiches((prev) => prev.filter((item) => item.id !== itemId));

      if (editingIndex === index) {
        setEditingIndex(null);
        setEditingValue("");
      }

      toast.success("Niche deleted");
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete niche");
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setEditingValue(niches[index].name);
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditingValue("");
  };

  const handleSaveEdit = async () => {
    if (editingIndex === null) return;

    const trimmed = editingValue.trim();
    if (!trimmed) return;

    const currentItem = niches[editingIndex];
    if (!currentItem) return;

    try {
      setUpdatingId(currentItem.id);

      const updated = await updateListItem(currentItem.id, {
        name: trimmed,
      });

      setNiches((prev) =>
        prev.map((item) =>
          item.id === currentItem.id ? updated.data : item
        )
      );

      setEditingIndex(null);
      setEditingValue("");
      toast.success("Niche updated");
      router.refresh();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;

        if (
          typeof message === "string" &&
          message.toLowerCase().includes("already exists")
        ) {
          toast.error("Already exists");
          return;
        }
      }
      toast.error("Failed to update niche");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Niche List</CardTitle>
        <CardDescription>Create and manage Niche List</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex items-center justify-between gap-2">
          <Input
            value={newNiche}
            onChange={(e) => setNewNiche(e.target.value)}
            placeholder="Add new niche"
            disabled={isAdding}
          />
          <Button
            variant="lightGreen"
            onClick={handleAdd}
            disabled={isAdding}
          >
            {isAdding ? "Adding..." : "Add"}
          </Button>
        </div>

        <div className="mt-4 space-y-2">
          {niches.length === 0 && (
            <p className="text-center text-gray-500">No niches added yet.</p>
          )}

          {niches.map((niche, index) => {
            const isEditing = editingIndex === index;
            const isDeleting = deletingId === niche.id;
            const isUpdating = updatingId === niche.id;

            return (
              <div
                key={niche.id}
                className="flex items-center justify-between rounded-full border bg-Secondary p-2 text-light-green"
              >
                {isEditing ? (
                  <Input
                    value={editingValue}
                    onChange={(e) => setEditingValue(e.target.value)}
                    className="rounded-full bg-Secondary text-light-green"
                    autoFocus
                    disabled={isUpdating}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveEdit();
                      if (e.key === "Escape") handleCancelEdit();
                    }}
                  />
                ) : (
                  <p className="text-sm">{niche.name}</p>
                )}

                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleSaveEdit}
                        aria-label="Save"
                        className="hover:text-light-green-500 disabled:opacity-50"
                        type="button"
                        disabled={isUpdating}
                      >
                        <FaCheck />
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        aria-label="Cancel"
                        className="hover:text-red-500 disabled:opacity-50"
                        type="button"
                        disabled={isUpdating}
                      >
                        <FaTimes />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEdit(index)}
                        aria-label="Edit"
                        className="hover:text-yellow-400"
                        type="button"
                        disabled={!!updatingId}
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(niche.id, index)}
                        aria-label="Delete"
                        className="hover:text-red-500 disabled:opacity-50"
                        type="button"
                        disabled={isDeleting}
                      >
                        <FaTrash />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default NicheListCard;