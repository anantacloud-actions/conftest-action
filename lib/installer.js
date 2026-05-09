const tc = require("@actions/tool-cache");
const path = require("path");
const fs = require("fs");

async function installConftest(version) {

  const platform = process.platform;

  const arch =
    process.arch === "x64"
      ? "x86_64"
      : process.arch;

  let fileName;

  if (platform === "linux") {

    fileName =
      `conftest_${version}_Linux_${arch}.tar.gz`;

  } else if (platform === "darwin") {

    fileName =
      `conftest_${version}_Darwin_${arch}.tar.gz`;

  } else {

    throw new Error(
      `Unsupported platform ${platform}`
    );
  }

  const url =
    `https://github.com/open-policy-agent/conftest/releases/download/v${version}/${fileName}`;

  const download =
    await tc.downloadTool(url);

  const extracted =
    await tc.extractTar(download);

  const binary =
    path.join(extracted, "conftest");

  fs.chmodSync(binary, 0o755);

  return binary;
}

module.exports = {
  installConftest
};
