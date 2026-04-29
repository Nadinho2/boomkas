"use server";

import { revalidatePath } from "next/cache";

import { createSupabaseServerClient } from "@/lib/supabase";

type PostStatus = "draft" | "published";

function getFormString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function slugify(input: string) {
  const slug = input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return slug || `post-${Date.now().toString(36)}`;
}

function getFormStatus(formData: FormData): PostStatus {
  const status = getFormString(formData, "status");
  return status === "published" ? "published" : "draft";
}

async function requireUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  return { supabase, user };
}

export async function createPost(formData: FormData) {
  const { supabase } = await requireUser();

  const title = getFormString(formData, "title");
  const slugInput = getFormString(formData, "slug");
  const category = getFormString(formData, "category") || null;
  const excerpt = getFormString(formData, "excerpt") || null;
  const content = getFormString(formData, "content") || null;
  const status = getFormStatus(formData);

  if (!title) {
    throw new Error("Title is required");
  }

  const published_at = status === "published" ? new Date().toISOString() : null;

  const baseSlug = slugInput ? slugify(slugInput) : slugify(title);
  let finalSlug = baseSlug;

  const { error } = await supabase.from("posts").insert({
    title,
    slug: baseSlug,
    category,
    excerpt,
    content,
    status,
    published_at,
  });

  if (error) {
    const message = error.message ?? "";
    if (message.toLowerCase().includes("duplicate") && message.toLowerCase().includes("slug")) {
      const fallbackSlug = `${baseSlug}-${Date.now().toString(36).slice(-4)}`;
      finalSlug = fallbackSlug;
      const { error: retryError } = await supabase.from("posts").insert({
        title,
        slug: fallbackSlug,
        category,
        excerpt,
        content,
        status,
        published_at,
      });

      if (retryError) {
        throw new Error(retryError.message);
      }
    } else {
      throw new Error(error.message);
    }
  }

  revalidatePath("/admin/posts");
  revalidatePath("/blog");
  revalidatePath(`/blog/${finalSlug}`);
}

export async function updatePost(formData: FormData) {
  const { supabase } = await requireUser();

  const id = getFormString(formData, "id");
  const title = getFormString(formData, "title");
  const slugInput = getFormString(formData, "slug");
  const category = getFormString(formData, "category") || null;
  const excerpt = getFormString(formData, "excerpt") || null;
  const content = getFormString(formData, "content") || null;
  const status = getFormStatus(formData);

  if (!id) {
    throw new Error("Missing post id");
  }

  if (!title) {
    throw new Error("Title is required");
  }

  const { data: existing, error: existingError } = await supabase
    .from("posts")
    .select("published_at,slug")
    .eq("id", id)
    .maybeSingle();

  if (existingError) {
    throw new Error(existingError.message);
  }

  const published_at =
    status === "published"
      ? (existing?.published_at as string | null) ?? new Date().toISOString()
      : null;

  const nextSlug = slugInput
    ? slugify(slugInput)
    : (existing?.slug as string | null) ?? slugify(title);

  const { error } = await supabase
    .from("posts")
    .update({
      title,
      slug: nextSlug,
      category,
      excerpt,
      content,
      status,
      published_at,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/posts");
  revalidatePath("/blog");
  revalidatePath(`/blog/${nextSlug}`);
  if (existing?.slug && existing.slug !== nextSlug) {
    revalidatePath(`/blog/${existing.slug}`);
  }
}

export async function deletePost(formData: FormData) {
  const { supabase } = await requireUser();

  const id = getFormString(formData, "id");
  if (!id) {
    throw new Error("Missing post id");
  }

  const { data: existing, error: existingError } = await supabase
    .from("posts")
    .select("slug")
    .eq("id", id)
    .maybeSingle();

  if (existingError) {
    throw new Error(existingError.message);
  }

  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/posts");
  revalidatePath("/blog");
  if (existing?.slug) {
    revalidatePath(`/blog/${existing.slug}`);
  }
}
