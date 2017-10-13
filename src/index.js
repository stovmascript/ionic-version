import CordovaConfig from "cordova-config";
import chalk from "chalk";
import child from "child_process";
import path from "path";

function log(msg, silent) {
	if (!silent) {
		console.log("[IV]", chalk[msg.style || "reset"](msg.text));
	}
}

export default function version(program, projectPath) {
	const prog = Object.assign({}, program || {});

	const projPath = path.resolve(
		process.cwd(),
		projectPath || prog.args[0] || ""
	);

	const programOpts = Object.assign({}, prog, {
		// android: path.join(projPath, prog.android),
		// ios: path.join(projPath, prog.ios)
	});

	const appPkgJSONPath = path.join(projPath, "package.json");
	const MISSING_IONIC_DEP = "MISSING_IONIC_DEP";
	let appPkg;

	try {
		appPkg = require(appPkgJSONPath);

		if (!appPkg.devDependencies["@ionic/app-scripts"]) {
			throw new Error(MISSING_IONIC_DEP);
		}
	} catch (err) {
		if (err.message === MISSING_IONIC_DEP) {
			log({
				style: "red",
				text: `Is this the right folder? Ionic (@ionic/app-scripts) isn't listed in devDependencies of ${appPkgJSONPath}`
			});
		} else {
			log({
				style: "red",
				text: err.message
			});

			log({
				style: "red",
				text:
					"Is this the right folder? Looks like there isn't a package.json here"
			});
		}

		log({
			style: "yellow",
			text: "Pass the project path as an argument, see --help for usage"
		});

		if (program.outputHelp) {
			program.outputHelp();
		}

		process.exit(1);
	}

	const cordovaConfig = new CordovaConfig(path.join(projPath, "config.xml"));

	cordovaConfig.setVersion(appPkg.version);

	cordovaConfig.write().then(() => {
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

		log({ style: "green", text: "Done" }, programOpts.quiet);
		return child.execSync("git log -1 --pretty=%H", gitCmdOpts).toString();
	});
}
