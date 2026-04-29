"use server";

import { revalidatePath } from "next/cache";

import { createSupabaseServerClient } from "@/lib/supabase";

type AutonomyLevel = "Low" | "Medium" | "High";

function getFormString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getFormNumber(formData: FormData, key: string) {
  const raw = getFormString(formData, key);
  if (!raw) return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function parseFeatures(input: string) {
  const lines = input
    .split(/\r?\n/g)
    .map((l) => l.trim())
    .filter(Boolean);
  return lines.length ? lines : null;
}

function getAutonomyLevel(formData: FormData): AutonomyLevel | null {
  const value = getFormString(formData, "autonomyLevel");
  if (value === "Low" || value === "Medium" || value === "High") return value;
  return null;
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

export async function createTool(formData: FormData) {
  const { supabase } = await requireUser();

  const name = getFormString(formData, "name");
  const slugRaw = getFormString(formData, "slug");
  const slug = slugRaw ? slugify(slugRaw) : slugify(name);
  const category = getFormString(formData, "category") || null;
  const bestFor = getFormString(formData, "bestFor") || null;
  const pricing = getFormString(formData, "pricing") || null;
  const autonomyLevel = getAutonomyLevel(formData);
  const keyFeatures = parseFeatures(getFormString(formData, "keyFeatures"));
  const rating = getFormNumber(formData, "rating");
  const affiliateLink = getFormString(formData, "affiliateLink") || null;
  const logo = getFormString(formData, "logo") || null;
  const description = getFormString(formData, "description") || null;

  if (!name) {
    throw new Error("Name is required");
  }
  if (!slug) {
    throw new Error("Slug is required");
  }

  const { error } = await supabase.from("tools").insert({
    name,
    slug,
    category,
    bestFor,
    pricing,
    autonomyLevel,
    keyFeatures,
    rating,
    affiliateLink,
    logo,
    description,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/tools");
  revalidatePath("/tools");
  revalidatePath(`/tools/${slug}`);
}

export async function updateTool(formData: FormData) {
  const { supabase } = await requireUser();

  const id = getFormString(formData, "id");
  const name = getFormString(formData, "name");
  const slugRaw = getFormString(formData, "slug");
  const slug = slugRaw ? slugify(slugRaw) : slugify(name);
  const category = getFormString(formData, "category") || null;
  const bestFor = getFormString(formData, "bestFor") || null;
  const pricing = getFormString(formData, "pricing") || null;
  const autonomyLevel = getAutonomyLevel(formData);
  const keyFeatures = parseFeatures(getFormString(formData, "keyFeatures"));
  const rating = getFormNumber(formData, "rating");
  const affiliateLink = getFormString(formData, "affiliateLink") || null;
  const logo = getFormString(formData, "logo") || null;
  const description = getFormString(formData, "description") || null;

  if (!id) {
    throw new Error("Missing tool id");
  }
  if (!name) {
    throw new Error("Name is required");
  }
  if (!slug) {
    throw new Error("Slug is required");
  }

  const { data: previous } = await supabase
    .from("tools")
    .select("slug")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase
    .from("tools")
    .update({
      name,
      slug,
      category,
      bestFor,
      pricing,
      autonomyLevel,
      keyFeatures,
      rating,
      affiliateLink,
      logo,
      description,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/tools");
  revalidatePath("/tools");
  if (previous?.slug && previous.slug !== slug) {
    revalidatePath(`/tools/${previous.slug}`);
  }
  revalidatePath(`/tools/${slug}`);
}

export async function deleteTool(formData: FormData) {
  const { supabase } = await requireUser();

  const id = getFormString(formData, "id");
  if (!id) {
    throw new Error("Missing tool id");
  }

  const { data: previous } = await supabase
    .from("tools")
    .select("slug")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("tools").delete().eq("id", id);
  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/tools");
  revalidatePath("/tools");
  if (previous?.slug) {
    revalidatePath(`/tools/${previous.slug}`);
  }
}
