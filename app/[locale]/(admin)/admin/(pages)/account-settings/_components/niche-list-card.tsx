"use client";

import React, { useState } from "react";
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

const NicheListCard = () => {
  const [niches, setNiches] = useState<string[]>([
    "Health & Wellness",
    "Fashion",
  ]);

  const [newNiche, setNewNiche] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState("");

  // Add new niche
  const handleAdd = () => {
    const trimmed = newNiche.trim();
    if (trimmed === "") return;
    setNiches([...niches, trimmed]);
    setNewNiche("");
  };

  // Delete niche by index
  const handleDelete = (index: number) => {
    setNiches(niches.filter((_, i) => i !== index));
    // If deleting currently editing item, cancel editing
    if (editingIndex === index) {
      setEditingIndex(null);
      setEditingValue("");
    }
  };

  // Start editing a niche
  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setEditingValue(niches[index]);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditingValue("");
  };

  // Save editing changes
  const handleSaveEdit = () => {
    if (editingValue.trim() === "") return;
    setNiches((prev) =>
      prev.map((item, i) => (i === editingIndex ? editingValue.trim() : item))
    );
    setEditingIndex(null);
    setEditingValue("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Niche List</CardTitle>
        <CardDescription>Create and manage Niche List</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Add new niche input + button */}
        <div className="flex items-center justify-between gap-2">
          <Input
            value={newNiche}
            onChange={(e) => setNewNiche(e.target.value)}
            placeholder="Add new niche"
          />
          <Button variant={"lightGreen"} onClick={handleAdd}>
            Add
          </Button>
        </div>

        {/* List of niches */}
        <div className="mt-4 space-y-2">
          {niches.length === 0 && (
            <p className="text-center text-gray-500">No niches added yet.</p>
          )}
          {niches.map((niche, index) => (
            <div
              key={index}
              className="flex items-center justify-between border p-2 rounded-full bg-Secondary text-light-green"
            >
              {/* Niche text or input when editing */}
              {editingIndex === index ? (
                <Input
                  value={editingValue}
                  onChange={(e) => setEditingValue(e.target.value)}
                  className="bg-Secondary text-light-green rounded-full"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSaveEdit();
                    }
                    if (e.key === "Escape") {
                      handleCancelEdit();
                    }
                  }}
                />
              ) : (
                <p className="text-sm">{niche}</p>
              )}

              <div className="flex gap-2">
                {editingIndex === index ? (
                  <>
                    <button
                      onClick={handleSaveEdit}
                      aria-label="Save"
                      className="hover:text-green-500"
                    >
                      <FaCheck />
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      aria-label="Cancel"
                      className="hover:text-red-500"
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
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(index)}
                      aria-label="Delete"
                      className="hover:text-red-500"
                    >
                      <FaTrash />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default NicheListCard;
