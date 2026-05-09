const fs = require("fs");

async function generateSarif(results) {

  const sarif = {

    version: "2.1.0",

    runs: [
      {
        tool: {
          driver: {
            name: "Conftest"
          }
        },

        results: []
      }
    ]
  };

  for (const fileResult of results) {

    if (!fileResult.failures) {
      continue;
    }

    for (const failure of fileResult.failures) {

      sarif.runs[0].results.push({

        ruleId:
          "conftest-policy",

        level:
          "error",

        message: {
          text: failure.msg
        },

        locations: [
          {
            physicalLocation: {
              artifactLocation: {
                uri: fileResult.filename
              }
            }
          }
        ]
      });
    }
  }

  fs.writeFileSync(
    "conftest-results.sarif",
    JSON.stringify(sarif, null, 2)
  );
}

module.exports = {
  generateSarif
};
