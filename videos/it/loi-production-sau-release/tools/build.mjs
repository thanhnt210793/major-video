#!/usr/bin/env node
// Rebuilds the playable project after any change to storyboard.json, the voice files or the
// generators: docs → frames → captions (+ phrase regrouping) → index → transitions. Narration and SFX files are
// produced separately (tools/make-voice.mjs, scripts/build-audio-meta.mjs + tools/fix-timings.mjs,
// tools/sfx-plan.mjs).
//
//   node tools/build.mjs        (run from the HyperFrames project root; ffmpeg on PATH)

import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const SK = join(homedir(), ".claude/plugins/cache/claude-plugins-official/hyperframes/0.8.61/skills/faceless-explainer/scripts");
const run = (cmd, args) => { console.log(`$ ${cmd} ${args.join(" ")}`); execFileSync(cmd, args, { stdio: "inherit" }); };

run("node", ["tools/gen-docs.mjs"]);
run("node", ["tools/gen-frames.mjs"]);
run("node", [join(SK, "captions.mjs"), "build", "--storyboard", "./STORYBOARD.md", "--audio-meta", "./audio_meta.json", "--hyperframes", ".", "--out", "./caption_groups.json"]);
run("node", ["tools/caption-phrases.mjs"]);   // regroup at Vietnamese phrase breaks
run("node", [join(SK, "assemble-index.mjs"), "--storyboard", "./STORYBOARD.md", "--hyperframes", "."]);
// the assembler leaves the caption mount unmarked; tag it so Studio groups it on the caption track
const idx = readFileSync("index.html", "utf8");
if (!idx.includes('data-track-kind="captions"')) writeFileSync("index.html", idx.replace('id="el-captions"', 'id="el-captions"\n        data-track-kind="captions"'));
run("node", [join(SK, "transitions.mjs"), "inject", "--storyboard", "./STORYBOARD.md", "--hyperframes", "."]);
run("node", [join(SK, "transitions.mjs"), "verify", "--storyboard", "./STORYBOARD.md", "--index", "./index.html"]);
