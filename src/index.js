const core = require("@actions/core");
const github = require("@actions/github");
const { installConftest } = require("./lib/installer");
const { scan } = require("./lib/scanner");
const { generateSarif } = require("./lib/sarif");
const {
  sendSlackNotification
} = require("./lib/notifications/slack");
const {
  sendGoogleChatNotification
} = require("./lib/notifications/googlechat");
const {
  sendTeamsNotification
} = require("./lib/notifications/teams");

async function run() {

  try {
    const scanType =
      core.getInput("scan-type");

    const files =
      core.getInput("files");

    const policyPath =
      core.getInput("policy-path");

    const version =
      core.getInput("conftest-version");

    const uploadSarif =
      core.getInput("upload-sarif") === "true";

    const slackWebhook =
      core.getInput("slack-webhook");

    const googleChatWebhook =
      core.getInput("google-chat-webhook");

    const teamsWebhook =
      core.getInput("teams-webhook");

    core.info("Installing Conftest");
    const conftest =
      await installConftest(version);

    core.info("Running policy scan");
    const results = await scan({
      conftest,
      scanType,
      files,
      policyPath
    });

    if (uploadSarif) {
      core.info("Generating SARIF");
      await generateSarif(results);
    }

    const findings = [];
    for (const result of results) {
      if (!result.failures) {
        continue;
      }
      findings.push(...result.failures);
    }

    if (findings.length > 0) {
      const payload = {
        repository:
          `${github.context.repo.owner}/${github.context.repo.repo}`,
        workflow:
          github.context.workflow,
        runId:
          github.context.runId,
        findings,
        branch:
          github.context.ref,
        actor:
          github.context.actor
      };

      await sendSlackNotification({
        webhook: slackWebhook,
        ...payload
      });

      await sendGoogleChatNotification({
        webhook: googleChatWebhook,
        ...payload
      });

      await sendTeamsNotification({
        webhook: teamsWebhook,
        ...payload
      });
      core.setFailed(
        `Conftest violations found: ${findings.length}`
      );
    }
    core.info("Policy scan completed");
  } catch (err) {

    core.setFailed(err.message);
  }
}

run();
