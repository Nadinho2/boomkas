import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";

import { authorSchema, postSchema } from "./sanity/schema";

const projectId = "uhplk2ta";
const dataset = "production";

export default defineConfig({
  name: "default",
  title: "Boomkas Studio",
  projectId,
  dataset,
  basePath: "/",
  plugins: [deskTool(), visionTool()],
  schema: {
    types: [postSchema, authorSchema],
  },
});
