#!/usr/bin/env node

import pkg from "../package";
import program from "commander";
import version from "./";

program
	.version(pkg.version)
	.description(pkg.description)
	.arguments("[projectPath]")
	.option(
		"-a, --amend",
		`Amend the previous commit. Also updates the latest Git tag to point to the amended commit. This is done automatically when ${pkg.name} is run from the "version" or "postversion" npm script. Use "--never-amend" if you never want to amend.`
	)
	.option(
		"--skip-tag",
		`For use with "--amend", if you don't want to update Git tags.`
	)
	.option("-A, --never-amend", "Never amend the previous commit.")
	.option("-q, --quiet", "Be quiet, only report errors.")
	.parse(process.argv);

version(program);
