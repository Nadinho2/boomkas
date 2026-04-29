"use client";

import * as React from "react";
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";

import { createTool, deleteTool, updateTool } from "@/app/admin/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export type AdminToolRow = {
  id: string;
  name: string | null;
  slug: string | null;
  category: string | null;
  pricing: string | null;
  autonomyLevel: string | null;
  rating: number | null;
  bestFor?: string | null;
  keyFeatures?: string[] | null;
  affiliateLink?: string | null;
  logo?: string | null;
  description?: string | null;
  updated_at?: string | null;
};

type AutonomyLevel = "Low" | "Medium" | "High";

function toFeaturesText(features: string[] | null | undefined) {
  if (!features?.length) return "";
  return features.join("\n");
}

function ratingText(rating: number | null | undefined) {
  if (rating == null || Number.isNaN(rating)) return "—";
  return rating.toFixed(2).replace(/\.00$/, "");
}

function autonomyBadgeVariant(level: string | null | undefined) {
  if (level === "High") return "cyan" as const;
  if (level === "Medium") return "yellow" as const;
  if (level === "Low") return "gray" as const;
  return "default" as const;
}

const AUTONOMY_OPTIONS: AutonomyLevel[] = ["Low", "Medium", "High"];

export default function ToolsTable({ tools }: { tools: AdminToolRow[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "name", desc: false },
  ]);
  const [query, setQuery] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState<string>("All");

  const [createOpen, setCreateOpen] = React.useState(false);
  const [editTool, setEditTool] = React.useState<AdminToolRow | null>(null);
  const [deleteToolRow, setDeleteToolRow] = React.useState<AdminToolRow | null>(
    null
  );

  const [createAutonomy, setCreateAutonomy] =
    React.useState<AutonomyLevel>("High");
  const [editAutonomy, setEditAutonomy] = React.useState<AutonomyLevel>("High");

  React.useEffect(() => {
    if (!editTool) return;
    const level =
      editTool.autonomyLevel === "Low" ||
      editTool.autonomyLevel === "Medium" ||
      editTool.autonomyLevel === "High"
        ? (editTool.autonomyLevel as AutonomyLevel)
        : "High";
    setEditAutonomy(level);
  }, [editTool]);

  const categories = React.useMemo(() => {
    const set = new Set<string>();
    tools.forEach((t) => {
      if (t.category) set.add(t.category);
    });
    return ["All", ...Array.from(set).sort()];
  }, [tools]);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return tools.filter((t) => {
      if (categoryFilter !== "All" && (t.category ?? "") !== categoryFilter) {
        return false;
      }
      if (!q) return true;
      const haystack = [
        t.name ?? "",
        t.slug ?? "",
        t.category ?? "",
        t.pricing ?? "",
        t.autonomyLevel ?? "",
        t.bestFor ?? "",
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [tools, query, categoryFilter]);

  const columns = React.useMemo<ColumnDef<AdminToolRow>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <div className="min-w-[200px]">
            <div className="truncate font-medium text-foreground">
              {row.original.name ?? "Untitled"}
            </div>
            <div className="mt-1 truncate text-xs text-muted-foreground">
              {row.original.slug ? `/${row.original.slug}` : "—"}
            </div>
          </div>
        ),
      },
      {
        accessorKey: "category",
        header: "Category",
        cell: ({ row }) => (
          <span className="text-sm text-foreground">
            {row.original.category ?? "—"}
          </span>
        ),
      },
      {
        accessorKey: "pricing",
        header: "Pricing",
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {row.original.pricing ?? "—"}
          </span>
        ),
      },
      {
        accessorKey: "autonomyLevel",
        header: "Autonomy",
        cell: ({ row }) => (
          <Badge variant={autonomyBadgeVariant(row.original.autonomyLevel)}>
            {row.original.autonomyLevel ?? "—"}
          </Badge>
        ),
      },
      {
        accessorKey: "rating",
        header: "Rating",
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {ratingText(row.original.rating)}
          </span>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setEditTool(row.original)}
            >
              <Pencil className="h-4 w-4" />
              Edit
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setDeleteToolRow(row.original)}
              className="text-[color:var(--secondary)] hover:text-[color:var(--secondary)]"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: filtered,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <Card>
      <CardHeader className="gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div>
          <CardTitle>All Tools</CardTitle>
          <div className="mt-1 text-sm text-muted-foreground">
            {filtered.length} tool{filtered.length === 1 ? "" : "s"}
          </div>
        </div>

        <div className="flex w-full flex-col gap-3 sm:min-w-0 sm:flex-1 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
          <div className="grid w-full gap-3 sm:min-w-0 sm:flex-1 sm:grid-cols-2">
            <div className="relative w-full sm:min-w-[14rem] sm:flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tools…"
                className="pl-11"
              />
            </div>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:min-w-[12rem] sm:w-auto">
                <SelectValue placeholder="Filter category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button type="button" variant="primary" size="sm">
                <Plus className="h-4 w-4" />
                Create New Tool
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Tool</DialogTitle>
                <DialogDescription>
                  Add a new tool entry for the public site.
                </DialogDescription>
              </DialogHeader>

              <form action={createTool} className="mt-4 space-y-4">
                <input type="hidden" name="autonomyLevel" value={createAutonomy} />

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="create-name">Name</Label>
                    <Input id="create-name" name="name" placeholder="Tool name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="create-slug">Slug</Label>
                    <Input id="create-slug" name="slug" placeholder="cursor" />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="create-category">Category</Label>
                    <Input
                      id="create-category"
                      name="category"
                      placeholder="IDE Agents"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Autonomy Level</Label>
                    <Select
                      value={createAutonomy}
                      onValueChange={(v) => setCreateAutonomy(v as AutonomyLevel)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        {AUTONOMY_OPTIONS.map((level) => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="create-pricing">Pricing</Label>
                    <Input
                      id="create-pricing"
                      name="pricing"
                      placeholder="$20/mo"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="create-rating">Rating</Label>
                    <Input
                      id="create-rating"
                      name="rating"
                      inputMode="decimal"
                      placeholder="4.5"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="create-bestfor">Best For</Label>
                  <Input
                    id="create-bestfor"
                    name="bestFor"
                    placeholder="Everyday coding, multi-file edits…"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="create-affiliate">Affiliate Link</Label>
                    <Input
                      id="create-affiliate"
                      name="affiliateLink"
                      placeholder="https://..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="create-logo">Logo URL</Label>
                    <Input id="create-logo" name="logo" placeholder="https://..." />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="create-features">Key Features (one per line)</Label>
                  <Textarea
                    id="create-features"
                    name="keyFeatures"
                    placeholder={"Composer\nAgent mode\nCodebase context"}
                    className="min-h-[120px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="create-description">Description</Label>
                  <Textarea
                    id="create-description"
                    name="description"
                    placeholder="Short description used in admin and future public pages."
                    className="min-h-[140px]"
                  />
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setCreateOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary">
                    Create
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent>
        <div className="w-full overflow-x-auto">
          <Table className="min-w-[860px]">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className={cn(
                        header.column.id === "actions" ? "text-right" : undefined
                      )}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={cn(
                          cell.column.id === "actions" ? "text-right" : undefined
                        )}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="py-16 text-center"
                  >
                    <div className="text-sm text-muted-foreground">
                      No tools found.
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <Dialog
        open={Boolean(editTool)}
        onOpenChange={(open) => (open ? null : setEditTool(null))}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Tool</DialogTitle>
            <DialogDescription>Update details for this tool.</DialogDescription>
          </DialogHeader>

          {editTool ? (
            <form action={updateTool} className="mt-4 space-y-4">
              <input type="hidden" name="id" value={editTool.id} />
              <input type="hidden" name="autonomyLevel" value={editAutonomy} />

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Name</Label>
                  <Input
                    id="edit-name"
                    name="name"
                    defaultValue={editTool.name ?? ""}
                    placeholder="Tool name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-slug">Slug</Label>
                  <Input
                    id="edit-slug"
                    name="slug"
                    defaultValue={editTool.slug ?? ""}
                    placeholder="cursor"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="edit-category">Category</Label>
                  <Input
                    id="edit-category"
                    name="category"
                    defaultValue={editTool.category ?? ""}
                    placeholder="IDE Agents"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Autonomy Level</Label>
                  <Select
                    value={editAutonomy}
                    onValueChange={(v) => setEditAutonomy(v as AutonomyLevel)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      {AUTONOMY_OPTIONS.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="edit-pricing">Pricing</Label>
                  <Input
                    id="edit-pricing"
                    name="pricing"
                    defaultValue={editTool.pricing ?? ""}
                    placeholder="$20/mo"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-rating">Rating</Label>
                  <Input
                    id="edit-rating"
                    name="rating"
                    inputMode="decimal"
                    defaultValue={editTool.rating ?? ""}
                    placeholder="4.5"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-bestfor">Best For</Label>
                <Input
                  id="edit-bestfor"
                  name="bestFor"
                  defaultValue={editTool.bestFor ?? ""}
                  placeholder="Everyday coding, multi-file edits…"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="edit-affiliate">Affiliate Link</Label>
                  <Input
                    id="edit-affiliate"
                    name="affiliateLink"
                    defaultValue={editTool.affiliateLink ?? ""}
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-logo">Logo URL</Label>
                  <Input
                    id="edit-logo"
                    name="logo"
                    defaultValue={editTool.logo ?? ""}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-features">Key Features (one per line)</Label>
                <Textarea
                  id="edit-features"
                  name="keyFeatures"
                  defaultValue={toFeaturesText(editTool.keyFeatures)}
                  placeholder={"Composer\nAgent mode\nCodebase context"}
                  className="min-h-[120px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  name="description"
                  defaultValue={editTool.description ?? ""}
                  placeholder="Short description used in admin and future public pages."
                  className="min-h-[140px]"
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setEditTool(null)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(deleteToolRow)}
        onOpenChange={(open) => (open ? null : setDeleteToolRow(null))}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Tool</DialogTitle>
            <DialogDescription>This action cannot be undone.</DialogDescription>
          </DialogHeader>

          {deleteToolRow ? (
            <form action={deleteTool} className="mt-4 space-y-4">
              <input type="hidden" name="id" value={deleteToolRow.id} />

              <div className="rounded-2xl bg-white/5 px-4 py-3 text-sm shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]">
                <div className="font-medium">
                  {deleteToolRow.name ?? "Untitled"}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {deleteToolRow.category ?? "—"} •{" "}
                  {deleteToolRow.slug ? `/${deleteToolRow.slug}` : "—"}
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setDeleteToolRow(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="secondary"
                  className="shadow-[0_0_0_1px_rgba(255,107,0,0.28),0_10px_30px_rgba(255,107,0,0.12)]"
                >
                  Delete
                </Button>
              </DialogFooter>
            </form>
          ) : null}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
