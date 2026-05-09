const axios = require("axios");

async function sendTeamsNotification({
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
          `${i + 1}. ${f.msg}`
      )
      .join("\n");

  const payload = {

    "@type":
      "MessageCard",

    "@context":
      "http://schema.org/extensions",

    themeColor:
      "FF0000",

    summary:
      "Conftest Policy Violations",

    sections: [
      {
        activityTitle:
          "🚨 Conftest Policy Violations",
        facts: [
          {
            name: "Repository",
            value: repository
          },
          {
            name: "Workflow",
            value: workflow
          },
          {
            name: "Branch",
            value: branch
          },
          {
            name: "Actor",
            value: actor
          }
        ],

        text:
          `### Findings\n\n${violations}`
      }
    ],

    potentialAction: [
      {
        "@type":
          "OpenUri",
        name:
          "View GitHub Run",
        targets: [
          {
            os: "default",
            uri: githubUrl
          }
        ]
      }
    ]
  };

  await axios.post(webhook, payload);
}

module.exports = {
  sendTeamsNotification
};
