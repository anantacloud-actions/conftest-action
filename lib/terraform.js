const exec = require("@actions/exec");

async function prepareTerraform(path) {

  await exec.exec("terraform", [
    "-chdir=" + path,
    "init",
    "-input=false"
  ]);

  await exec.exec("terraform", [
    "-chdir=" + path,
    "plan",
    "-out=tfplan"
  ]);

  await exec.exec("terraform", [
    "-chdir=" + path,
    "show",
    "-json",
    "tfplan"
  ], {
    listeners: {
      stdout: data => {
        require("fs").writeFileSync(
          `${path}/tfplan.json`,
          data
        );
      }
    }
  });

  return `${path}/tfplan.json`;
}

module.exports = {
  prepareTerraform
};
