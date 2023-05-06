import esbuild from "esbuild";
import path from "path";

esbuild.build({
  platform: "node",
  outdir: path.resolve(__dirname, "build"),
  entryNames: "bundle",
  entryPoints: [path.resolve(__dirname, "src", "index.ts")],
  tsconfig: path.resolve(__dirname, "tsconfig.json"),
  bundle: true,
  minifyWhitespace: true,
  minifySyntax: true,
  treeShaking: true,
});
