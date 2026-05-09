const core = require("@actions/core");
const github = require("@actions/github");

const {
  installConftest
} = require("./lib/installer.js");

const {
  scan
} = require("./lib/scanner.js");

const {
  generateSarif
} = require("./lib/sarif.js");

const {
  sendSlackNotification
} = require("./lib/notifications/slack.js");

const {
  sendGoogleChatNotification
} = require("./lib/notifications/googlechat.js");

const {
  sendTeamsNotification
} = require("./lib/notifications/teams.js");

const {
  printBanner,
  printSummary,
  printViolations,
  generateScore,
  printComplianceScore,
  writeGithubSummary

} = require("./lib/logger.js");


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

    printBanner(scanType);

    core.info(
      "⬇️ Installing Conftest"
    );

    const conftest =
      await installConftest(version);

    core.info(
      "🔍 Running policy scan"
    );

    const results = await scan({
      conftest,
      scanType,
      files,
      policyPath
    });


    if (uploadSarif) {
      core.info(
        "🧠 Generating SARIF report"
      );

      await generateSarif(results);
    }

    const findings = [];
    for (const result of results) {
      if (!result.failures) {
        continue;
      }

      findings.push(...result.failures);
    }

    const scannedFiles =
      results.length;

    const violations =
      findings.length;

    const warnings = 0;

    printSummary({
      scannedFiles,
      violations,
      warnings
    });

    printViolations(results);

    const score =
      generateScore(
        scannedFiles,
        violations
      );


    printComplianceScore(score);

    await writeGithubSummary({
      scanType,
      violations,
      score
    });


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

      core.info(
        "💬 Sending Slack notification"
      );

      await sendSlackNotification({
        webhook: slackWebhook,
        ...payload
      });

      core.info(
        "💬 Sending Google Chat notification"
      );

      await sendGoogleChatNotification({
        webhook: googleChatWebhook,
        ...payload
      });

      core.info(
        "💬 Sending Teams notification"
      );
      await sendTeamsNotification({
        webhook: teamsWebhook,
        ...payload
      });

      core.setFailed(
        `❌ Conftest violations found: ${violations}`
      );
      return;
    }

    core.info("");
    core.info("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    core.info("✅ POLICY SCAN PASSED");
    core.info("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    core.info("☁️ Infrastructure guardrails active");
    core.info("");
  } catch (err) {
    core.setFailed(err.message);
  }
}

run();
