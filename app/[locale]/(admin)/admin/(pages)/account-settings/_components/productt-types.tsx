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

const ProductTypes = () => {
  const [productTypes, setProductTypes] = useState<string[]>([
    "Electronics",
    "Clothing",
  ]);

  const [newProductType, setNewProductType] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState("");

  const handleAdd = () => {
    const trimmed = newProductType.trim();
    if (trimmed === "") return;
    setProductTypes([...productTypes, trimmed]);
    setNewProductType("");
  };

  const handleDelete = (index: number) => {
    setProductTypes(productTypes.filter((_, i) => i !== index));
    if (editingIndex === index) {
      setEditingIndex(null);
      setEditingValue("");
    }
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setEditingValue(productTypes[index]);
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditingValue("");
  };

  const handleSaveEdit = () => {
    if (editingValue.trim() === "") return;
    setProductTypes((prev) =>
      prev.map((item, i) => (i === editingIndex ? editingValue.trim() : item))
    );
    setEditingIndex(null);
    setEditingValue("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Types</CardTitle>
        <CardDescription>Create and manage product types</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between gap-2">
          <Input
            value={newProductType}
            onChange={(e) => setNewProductType(e.target.value)}
            placeholder="Add new product type"
          />
          <Button variant={"lightGreen"} onClick={handleAdd}>
            Add
          </Button>
        </div>

        <div className="mt-4 space-y-2">
          {productTypes.length === 0 && (
            <p className="text-center text-gray-500">
              No product types added yet.
            </p>
          )}
          {productTypes.map((productType, index) => (
            <div
              key={index}
              className="flex items-center justify-between border p-2 rounded-full bg-Secondary text-light-green"
            >
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
                <p className="text-sm">{productType}</p>
              )}

              <div className="flex gap-2">
                {editingIndex === index ? (
                  <>
                    <button
                      onClick={handleSaveEdit}
                      aria-label="Save"
                      className="hover:text-light-green-500"
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

export default ProductTypes;
