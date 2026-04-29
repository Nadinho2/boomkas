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

import { createPost, deletePost, updatePost } from "./actions";
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

export type AdminPostRow = {
  id: string;
  title: string | null;
  slug?: string | null;
  category: string | null;
  status: string | null;
  published_at: string | null;
  excerpt?: string | null;
  content?: string | null;
  updated_at?: string | null;
};

type PostStatus = "draft" | "published";

const CATEGORY_OPTIONS = [
  "All",
  "Coding Agents",
  "Workflow Automation",
  "Multi-Agent Systems",
  "Beginner Guides",
  "Tool Comparisons",
  "Productivity Tips",
] as const;

function formatDate(iso: string | null | undefined) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
}

function statusBadgeVariant(status: string | null | undefined) {
  if (status === "published") return "cyan" as const;
  if (status === "draft") return "gray" as const;
  return "default" as const;
}

export default function PostsTable({ posts }: { posts: AdminPostRow[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "published_at", desc: true },
  ]);
  const [query, setQuery] = React.useState("");

  const [createOpen, setCreateOpen] = React.useState(false);
  const [editPost, setEditPost] = React.useState<AdminPostRow | null>(null);
  const [deletePostRow, setDeletePostRow] = React.useState<AdminPostRow | null>(
    null
  );

  const [createStatus, setCreateStatus] = React.useState<PostStatus>("draft");
  const [createCategory, setCreateCategory] = React.useState<string>("Tool Comparisons");

  const [editStatus, setEditStatus] = React.useState<PostStatus>("draft");
  const [editCategory, setEditCategory] = React.useState<string>("Tool Comparisons");

  React.useEffect(() => {
    if (!editPost) return;
    setEditStatus(editPost.status === "published" ? "published" : "draft");
    setEditCategory(editPost.category ?? "Tool Comparisons");
  }, [editPost]);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter((p) => {
      const haystack = [
        p.title ?? "",
        p.slug ?? "",
        p.category ?? "",
        p.status ?? "",
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [posts, query]);

  const columns = React.useMemo<ColumnDef<AdminPostRow>[]>(
    () => [
      {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => (
          <div className="min-w-[220px]">
            <div className="truncate font-medium text-foreground">
              {row.original.title ?? "Untitled"}
            </div>
            <div className="mt-1 truncate text-xs text-muted-foreground">
              {row.original.excerpt ?? "—"}
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
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <Badge variant={statusBadgeVariant(row.original.status)}>
            {row.original.status ?? "—"}
          </Badge>
        ),
      },
      {
        accessorKey: "published_at",
        header: "Published",
        cell: ({ row }) => (
          <span className="whitespace-nowrap text-sm text-muted-foreground">
            {formatDate(row.original.published_at)}
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
              onClick={() => setEditPost(row.original)}
            >
              <Pencil className="h-4 w-4" />
              Edit
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setDeletePostRow(row.original)}
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
          <CardTitle>All Posts</CardTitle>
          <div className="mt-1 text-sm text-muted-foreground">
            {filtered.length} post{filtered.length === 1 ? "" : "s"}
          </div>
        </div>

        <div className="flex w-full flex-col gap-3 sm:min-w-0 sm:flex-1 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
          <div className="relative w-full sm:min-w-[14rem] sm:flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search posts…"
              className="pl-11"
            />
          </div>

          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button type="button" variant="primary" size="sm">
                <Plus className="h-4 w-4" />
                Create New Post
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Post</DialogTitle>
                <DialogDescription>
                  Create a new post. Save as draft or publish immediately.
                </DialogDescription>
              </DialogHeader>

              <form action={createPost} className="mt-4 space-y-4">
                <input type="hidden" name="status" value={createStatus} />
                <input type="hidden" name="category" value={createCategory} />

                <div className="space-y-2">
                  <Label htmlFor="create-title">Title</Label>
                  <Input id="create-title" name="title" placeholder="Post title" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="create-slug">Slug</Label>
                  <Input
                    id="create-slug"
                    name="slug"
                    placeholder="Optional (auto-generated if empty)"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select value={createCategory} onValueChange={setCreateCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORY_OPTIONS.filter((c) => c !== "All").map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select
                      value={createStatus}
                      onValueChange={(v) => setCreateStatus(v as PostStatus)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="create-excerpt">Excerpt</Label>
                  <Textarea
                    id="create-excerpt"
                    name="excerpt"
                    placeholder="Short summary for cards and previews"
                    className="min-h-[90px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="create-content">Content</Label>
                  <Textarea
                    id="create-content"
                    name="content"
                    placeholder="Post content"
                    className="min-h-[180px]"
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
          <Table className="min-w-[720px]">
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
                      No posts found.
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <Dialog open={Boolean(editPost)} onOpenChange={(open) => (open ? null : setEditPost(null))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Post</DialogTitle>
            <DialogDescription>Update post details and status.</DialogDescription>
          </DialogHeader>

          {editPost ? (
            <form action={updatePost} className="mt-4 space-y-4">
              <input type="hidden" name="id" value={editPost.id} />
              <input type="hidden" name="status" value={editStatus} />
              <input type="hidden" name="category" value={editCategory} />

              <div className="space-y-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  name="title"
                  defaultValue={editPost.title ?? ""}
                  placeholder="Post title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-slug">Slug</Label>
                <Input
                  id="edit-slug"
                  name="slug"
                  defaultValue={editPost.slug ?? ""}
                  placeholder="Optional"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={editCategory} onValueChange={setEditCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORY_OPTIONS.filter((c) => c !== "All").map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={editStatus}
                    onValueChange={(v) => setEditStatus(v as PostStatus)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-excerpt">Excerpt</Label>
                <Textarea
                  id="edit-excerpt"
                  name="excerpt"
                  defaultValue={editPost.excerpt ?? ""}
                  placeholder="Short summary for cards and previews"
                  className="min-h-[90px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-content">Content</Label>
                <Textarea
                  id="edit-content"
                  name="content"
                  defaultValue={editPost.content ?? ""}
                  placeholder="Post content"
                  className="min-h-[180px]"
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setEditPost(null)}
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
        open={Boolean(deletePostRow)}
        onOpenChange={(open) => (open ? null : setDeletePostRow(null))}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Post</DialogTitle>
            <DialogDescription>
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {deletePostRow ? (
            <form action={deletePost} className="mt-4 space-y-4">
              <input type="hidden" name="id" value={deletePostRow.id} />

              <div className="rounded-2xl bg-white/5 px-4 py-3 text-sm shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]">
                <div className="font-medium">{deletePostRow.title ?? "Untitled"}</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {deletePostRow.category ?? "—"} • {deletePostRow.status ?? "—"}
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setDeletePostRow(null)}
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
