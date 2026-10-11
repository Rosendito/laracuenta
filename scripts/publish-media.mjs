// Commits and pushes public/media if it changed, then prints the jsDelivr base URL
// pinned to the pushed commit. The build reads it from PUBLIC_MEDIA_BASE.
import { execSync } from "node:child_process";

const sh = (cmd) => execSync(cmd, { encoding: "utf8" }).trim();
const repo = process.env.MEDIA_REPO ?? "Rosendito/laracuenta";

if (sh("git status --porcelain -- public/media")) {
  sh("git add public/media");
  sh('git commit -m "Update optimized media" -- public/media');
}
const sha = sh("git rev-parse HEAD");
if (!sh(`git branch -r --contains ${sha}`)) {
  console.error("Media commit is not on GitHub yet. Push, then rerun.");
  process.exit(1);
}
console.log(`https://cdn.jsdelivr.net/gh/${repo}@${sha}/public`);
