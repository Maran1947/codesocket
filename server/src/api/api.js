import { executeCompiler } from "./compiler/compiler.js";
import fileUtils from "../utils/file_utils.js";
import { createJob, getJobById } from "./controllers/jobController.js";

const initApiRoutes = (app) => {
  app.get("/", (_req, res) => {
    return res.status(200).send("Welcome to CodeSocket APIs");
  });

  app.post("/api/code/execute", async (req, res) => {
    const { language, extension, code } = req.body;
    let job = null;
    try {
      const filePath = await fileUtils.generateFile(extension, code);

      job = await createJob({ filePath, language });
      res.status(201).json({ success: true, jobId: job._id });

      job.startedAt = new Date();
      const response = await executeCompiler(filePath, language);
      job.completedAt = new Date();
      job.status = "success";
      job.output = response;

      await job.save();
    } catch (error) {
      job.status = "failed";
      job.output = JSON.stringify(error);
      await job.save();
      console.log(error);
      return res.status(500).json({ error });
    }
  });

  app.get("/api/code/status/:jobId", async (req, res) => {
    const { jobId } = req.params;
    if (!jobId) {
      return res
        .status(400)
        .json({ success: false, message: "Bad request: job Id not found!" });
    }
    try {
      const job = await getJobById(jobId);
      return res.status(200).json({ success: false, job });
    } catch (error) {
      return res.status(500).json({ error });
    }
  });
};

export { initApiRoutes };
