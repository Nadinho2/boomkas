import { defineCliConfig } from "sanity/cli";

const projectId = "uhplk2ta";
const dataset = "production";

export default defineCliConfig({
  api: { projectId, dataset },
  deployment: {
    appId: "x5pgmxl2btk4mpzdpdn46q3m",
  },
});
