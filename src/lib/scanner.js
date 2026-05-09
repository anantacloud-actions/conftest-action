const exec = require("@actions/exec");

const {
  prepareTerraform
} = require("./terraform");

const {
  prepareHelm
} = require("./helm");

async function scan({
  conftest,
  scanType,
  files,
  policyPath
}) {

  let target = files;

  switch (scanType) {

    case "terraform":
      target = await prepareTerraform(files);
      break;

    case "helm":
      target = await prepareHelm(files);
      break;

    case "dockerfile":
      target = files;
      break;

    case "kubernetes":
      target = files;
      break;

    default:
      throw new Error(
        `Unsupported scan type ${scanType}`
      );
  }

  let output = "";

  await exec.exec(
    conftest,
    [
      "test",
      target,
      "--policy",
      policyPath,
      "--output",
      "json"
    ],
    {
      ignoreReturnCode: true,

      listeners: {

        stdout: data => {
          output += data.toString();
        }
      }
    }
  );

  return JSON.parse(output);
}

module.exports = {
  scan
};
