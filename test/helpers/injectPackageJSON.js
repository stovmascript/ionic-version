import fs from "fs-extra";
import myAppPackageJSON from "../fixtures/myApp/package";

/**
 * Saves a new package.json with injected scripts
 * @param {Object} t Test object
 * @param {Object} script npm scripts to merge
 */
function injectPackageJSON(t, script) {
	fs.writeFileSync(
		"package.json",
		`${JSON.stringify(
			Object.assign({}, myAppPackageJSON, {
				scripts: Object.assign({}, myAppPackageJSON.scripts, script)
			}),
			null,
			2
		)}\n`,
		{
			cwd: t.context.tempDir
		}
	);
}

module.exports = injectPackageJSON;
