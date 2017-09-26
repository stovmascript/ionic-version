#!/usr/bin/env node

import pkg from "../package";
import program from "commander";

program
  .version(pkg.version)
  .description(pkg.description)
  .parse(process.argv);
