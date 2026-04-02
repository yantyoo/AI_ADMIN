#!/usr/bin/env node

require("next/dist/server/lib/cpu-profile");

const path = require("path");
const { getProjectDir } = require("next/dist/lib/get-project-dir");
const { fileExists, FileType } = require("next/dist/lib/file-exists");
const loadConfig = require("next/dist/server/config").default;
const { PHASE_DEVELOPMENT_SERVER } = require("next/dist/shared/lib/constants");
const { setGlobal, traceId } = require("next/dist/trace/shared");
const { startServer } = require("next/dist/server/lib/start-server");

async function main() {
  const dir = getProjectDir(process.env.NEXT_PRIVATE_DEV_DIR || process.cwd());

  if (!(await fileExists(dir, FileType.Directory))) {
    console.error(`> No such directory exists as the project root: ${dir}`);
    process.exit(1);
  }

  const config = await loadConfig(PHASE_DEVELOPMENT_SERVER, dir, {
    silent: false
  });

  const port = Number.parseInt(process.env.PORT || "3000", 10);
  const hostname = process.env.HOSTNAME;
  const distDir = path.join(dir, config.distDir ?? ".next");

  setGlobal("phase", PHASE_DEVELOPMENT_SERVER);
  setGlobal("distDir", distDir);
  setGlobal("traceId", traceId);

  await startServer({
    dir,
    port,
    allowRetry: true,
    isDev: true,
    hostname
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
