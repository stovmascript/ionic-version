import CordovaConfig from "cordova-config";
import chalk from "chalk";
import child from "child_process";
import path from "path";
import resolveFrom from "resolve-from";

/**
 * Custom type definition for Promises
 * @typedef Promise
 * @property {*} result See the implementing function for the resolve type and description
 * @property {Error} result Rejection error object
 */

function log(msg, silent) {
	if (!silent) {
		console.log("[IV]", chalk[msg.style || "reset"](msg.text));
	}
}

/**
 * Versions your app
 * @param {Object} program commander/CLI-style options, camelCased
 * @param {string} projectPath Path to your Ionic project
 * @return {Promise<string|Error>} A promise which resolves with the last commit hash
 */
export function version(program, projectPath) {
	const programOpts = Object.assign({}, program || {});

	const projPath = path.resolve(
		process.cwd(),
		projectPath || programOpts.args[0] || ""
	);

	const appPkgJSONPath = path.join(projPath, "package.json");
	let appPkg;

	try {
		resolveFrom(projPath, "@ionic/app-scripts");
		appPkg = require(appPkgJSONPath);
	} catch (err) {
		if (err.message === "Cannot find module '@ionic/app-scripts'") {
			log({
				style: "red",
				text: `Is this the right folder? ${err.message} in ${projPath}`
			});
		} else {
			log({
				style: "red",
				text: err.message
			});

			log({
				style: "red",
				text:
					"Is this the right folder? Looks like there isn't a package.json here."
			});
		}

		log({
			style: "yellow",
			text: "Pass the project path as an argument, see --help for usage."
		});

		if (program.outputHelp) {
			program.outputHelp();
		}

		process.exit(1);
	}

	const cordovaConfig = new CordovaConfig(path.join(projPath, "config.xml"));

	cordovaConfig.setVersion(appPkg.version);

	return cordovaConfig
		.write()
		.then(() => {
			const gitCmdOpts = {
				cwd: projPath
			};

			if (
				programOpts.amend ||
				(process.env.npm_lifecycle_event &&
					process.env.npm_lifecycle_event.indexOf("version") > -1 &&
					!programOpts.neverAmend)
			) {
				log({ text: "Amending..." }, programOpts.quiet);

				switch (process.env.npm_lifecycle_event) {
					case "version":
						child.spawnSync("git", ["add", "."], gitCmdOpts);
						break;

					case "postversion":
					default:
						child.execSync("git commit -a --amend --no-edit", gitCmdOpts);

						if (!programOpts.skipTag) {
							log({ text: "Adjusting Git tag..." }, programOpts.quiet);

							child.execSync(
								"git tag -f $(git tag --sort=v:refname | tail -1)",
								gitCmdOpts
							);
						}
				}
			}

			log({ style: "green", text: "Done." }, programOpts.quiet);
			return child.execSync("git log -1 --pretty=%H", gitCmdOpts).toString();
		})
		.catch(err => {
			if (process.env.IV_ENV === "ava") {
				console.error(err);
			}

			log({
				style: "red",
				text: "Done, with errors."
			});

			process.exit(1);
		});
}

export default version;
