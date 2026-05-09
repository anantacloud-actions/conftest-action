const axios = require("axios");

async function sendSlackNotification({
  webhook,
  repository,
  workflow,
  runId,
  findings,
  branch,
  actor
}) {

  if (!webhook) {
    return;
  }

  const githubUrl =
    `https://github.com/${repository}/actions/runs/${runId}`;

  const violations =
    findings
      .slice(0, 10)
      .map(
        (f, i) =>
          `• ${i + 1}. ${f.msg}`
      )
      .join("\n");

  await axios.post(webhook, {
    text:
      "Conftest Policy Violations",

    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text:
            "🚨 Conftest Policy Violations"
        }
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text:
              `*Repository:*\n${repository}`
          },
          {
            type: "mrkdwn",
            text:
              `*Workflow:*\n${workflow}`
          },
          {
            type: "mrkdwn",
            text:
              `*Branch:*\n${branch}`
          },
          {
            type: "mrkdwn",
            text:
              `*Actor:*\n${actor}`
          }
        ]
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text:
            `*Findings:*\n${violations}`
        }
      },

      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "View Run"
            },

            url: githubUrl
          }
        ]
      }
    ]
  });
}

module.exports = {
  sendSlackNotification
};
