const axios = require("axios");

async function sendGoogleChatNotification({
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
      .join("<br>");

  const payload = {

    cardsV2: [

      {
        cardId:
          "conftest-alert",
        card: {
          header: {
            title:
              "🚨 Conftest Policy Violations",
            subtitle:
              repository
          },
          sections: [
            {
              widgets: [
                {
                  decoratedText: {
                    text:
                      `<b>Workflow:</b> ${workflow}`
                  }
                },
                {
                  decoratedText: {
                    text:
                      `<b>Branch:</b> ${branch}`
                  }
                },
                {
                  decoratedText: {
                    text:
                      `<b>Actor:</b> ${actor}`
                  }
                },
                {
                  textParagraph: {
                    text:
                      `<b>Findings:</b><br>${violations}`
                  }
                },
                {
                  buttonList: {
                    buttons: [
                      {
                        text:
                          "View GitHub Run",

                        onClick: {
                          openLink: {
                            url: githubUrl
                          }
                        }
                      }
                    ]
                  }
                }
              ]
            }
          ]
        }
      }
    ]
  };

  await axios.post(webhook, payload);
}

module.exports = {
  sendGoogleChatNotification
};
