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
import { createPlatform } from "@/service/admin/settings/create-platform";
import { deleteListItem } from "@/service/admin/settings/delete-list-items";
import { updateListItem } from "@/service/admin/settings/update-list-item";

type PlatformItem = {
  id: string;
  name: string;
};

type Props = {
  initialPlatforms: PlatformItem[];
};

const PlatformsList = ({ initialPlatforms }: Props) => {
  const router = useRouter();

  const [platforms, setPlatforms] = useState<PlatformItem[]>(
    initialPlatforms || []
  );
  const [newPlatform, setNewPlatform] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleAdd = async () => {
    const trimmed = newPlatform.trim();
    if (!trimmed) return;

    try {
      setIsAdding(true);

      const created = await createPlatform({ name: trimmed });

      setPlatforms((prev) => [
        ...prev,
        {
          id: created.id,
          name: trimmed,
        },
      ]);

      setNewPlatform("");
      toast.success("Platform added");
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
      toast.error("Failed to add platform");
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (itemId: string, index: number) => {
    try {
      setDeletingId(itemId);

      await deleteListItem(itemId);

      setPlatforms((prev) => prev.filter((item) => item.id !== itemId));

      if (editingIndex === index) {
        setEditingIndex(null);
        setEditingValue("");
      }

      toast.success("Platform deleted");
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete platform");
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setEditingValue(platforms[index].name);
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditingValue("");
  };

  const handleSaveEdit = async () => {
    if (editingIndex === null) return;

    const trimmed = editingValue.trim();
    if (!trimmed) return;

    const currentItem = platforms[editingIndex];
    if (!currentItem) return;

    try {
      setUpdatingId(currentItem.id);

      const updated = await updateListItem(currentItem.id, {
        name: trimmed,
      });

      setPlatforms((prev) =>
        prev.map((item) => (item.id === currentItem.id ? updated.data : item))
      );

      setEditingIndex(null);
      setEditingValue("");
      toast.success("Platform updated");
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
      toast.error("Failed to update platform");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Platforms</CardTitle>
        <CardDescription>Create and manage platforms</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex items-center justify-between gap-2">
          <Input
            value={newPlatform}
            onChange={(e) => setNewPlatform(e.target.value)}
            placeholder="Add new platform"
            disabled={isAdding}
          />
          <Button variant="lightGreen" onClick={handleAdd} disabled={isAdding}>
            {isAdding ? "Adding..." : "Add"}
          </Button>
        </div>

        <div className="mt-4 space-y-2">
          {platforms.length === 0 && (
            <p className="text-center text-gray-500">No platforms added yet.</p>
          )}

          {platforms.map((platform, index) => {
            const isEditing = editingIndex === index;
            const isDeleting = deletingId === platform.id;
            const isUpdating = updatingId === platform.id;

            return (
              <div
                key={platform.id}
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
                  <p className="text-sm">{platform.name}</p>
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
                        onClick={() => handleDelete(platform.id, index)}
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

export default PlatformsList;
