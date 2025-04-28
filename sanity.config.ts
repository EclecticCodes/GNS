import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import schemas from "./sanity/schemas";

const config = defineConfig({
  projectId: "evw8b7bx",
  dataset: "production",
  title: "Good Natured Souls",
  basePath: "/admin",
  plugins: [structureTool(), visionTool()],
  schema: { types: schemas },
});

export default config;