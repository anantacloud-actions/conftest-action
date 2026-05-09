const core = require("@actions/core");
function printBanner(scanType) {

  core.info("");
  core.info("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  core.info("🛡️ ADVANCED CONTFEST POLICY SCAN");
  core.info("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  core.info(`📦 Scan Type: ${scanType}`);
  core.info("");
}

function printSummary({
  scannedFiles,
  violations,
  warnings
}) {

  core.info("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  core.info(
    `✅ Files Scanned: ${scannedFiles}`
  );
  core.info(
    `❌ Violations: ${violations}`
  );
  core.info(
    `⚠️ Warnings: ${warnings}`
  );
  core.info("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  core.info("");
}

function printViolations(results) {
  core.startGroup(
    "🚨 POLICY VIOLATIONS"
  );

  for (const result of results) {

    if (!result.failures) {
      continue;
    }

    for (const failure of result.failures) {

      core.error(
        `❌ ${failure.msg}`,
        {
          file: result.filename
        }
      );

      core.info(
        `   └─ File: ${result.filename}`
      );
    }
  }

  core.endGroup();
}

function generateScore(total, failed) {
  if (total === 0) {
    return 100;
  }

  return Math.max(
    0,
    Math.round(
      ((total - failed) / total) * 100
    )
  );
}

function printComplianceScore(score) {
  const totalBars = 20;
  const filled =
    Math.round(
      (score / 100) * totalBars
    );

  const empty =
    totalBars - filled;

  const progress =
    "█".repeat(filled) +
    "░".repeat(empty);

  core.info("");
  core.info("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  core.info("📊 COMPLIANCE SCORE");
  core.info("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  core.info(
    `${progress} ${score}%`
  );
  core.info("");
}

async function writeGithubSummary({
  scanType,
  violations,
  score
}) {

  await core.summary
    .addHeading(
      "🛡️ Advanced Conftest Scan"
    )
    .addTable([
      [
        {
          data: "Metric",
          header: true
        },
        {
          data: "Value",
          header: true
        }
      ],
      [
        "Scan Type",
        scanType
      ],
      [
        "Violations",
        violations.toString()
      ],
      [
        "Compliance Score",
        `${score}%`
      ]
    ])
    .addBreak()
    .addQuote(
      "Infrastructure should fail policy validation before it fails production."
    )
    .write();
}

module.exports = {
  printBanner,
  printSummary,
  printViolations,
  generateScore,
  printComplianceScore,
  writeGithubSummary
};
