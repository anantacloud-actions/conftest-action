const core = require("@actions/core");

const { installConftest } = require("./lib/installer");
const { scan } = require("./lib/scanner");
const { generateSarif } = require("./lib/sarif");

async function run() {
  try {
    const scanType = core.getInput("scan-type");
    const files = core.getInput("files");
    const policyPath = core.getInput("policy-path");
    const version = core.getInput("conftest-version");
    const uploadSarif =
      core.getInput("upload-sarif") === "true";

    const conftest = await installConftest(version);

    const results = await scan({
      conftest,
      scanType,
      files,
      policyPath
    });

    if (uploadSarif) {
      await generateSarif(results);
    }

    const failed = results.some(r => r.failures?.length);

    if (failed) {
      core.setFailed("Conftest policy violations found");
    }

  } catch (err) {
    core.setFailed(err.message);
  }
}

run();
