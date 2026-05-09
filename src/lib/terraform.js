const exec = require("@actions/exec");
const fs = require("fs");

async function prepareTerraform(path) {
  await exec.exec(
    "terraform",
    [
      "-chdir=" + path,
      "init",
      "-input=false"
    ]
  );

  await exec.exec(
    "terraform",
    [
      "-chdir=" + path,
      "plan",
      "-refresh=false",
      "-lock=false",
      "-out=tfplan"
    ]
  );

  let output = "";

  await exec.exec(
    "terraform",
    [
      "-chdir=" + path,
      "show",
      "-json",
      "tfplan"
    ],
    {
      listeners: {
        stdout: data => {
          output += data.toString();
        }
      }
    }
  );

  fs.writeFileSync(
    `${path}/tfplan.json`,
    output
  );

  return `${path}/tfplan.json`;
}

module.exports = {
  prepareTerraform
};
