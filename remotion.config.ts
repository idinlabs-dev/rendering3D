import { Config } from "@remotion/cli/config";
import fs from "node:fs";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);

// Browser dipakai dari `npx remotion browser ensure` (headless shell resmi
// Remotion). Chromium sistem (/opt/meta-chromium/chrome) TIDAK bisa dipakai:
// menolak start ("Hatch WebGL domain policy is required").
