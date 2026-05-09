const exec = require("@actions/exec");
const fs = require("fs");

async function prepareHelm(chartPath) {

  let output = "";

  await exec.exec("helm", [
    "template",
    chartPath
  ], {
    listeners: {

      stdout: data => {
        output += data.toString();
      }
    }
  });

  const rendered =
    "/tmp/helm-rendered.yaml";

  fs.writeFileSync(rendered, output);

  return rendered;
}

module.exports = {
  prepareHelm
};
