import fs from "fs-extra";
import path from "path";
import temp from "temp";

temp.track();

module.exports = t => {
	t.context.tempDir = temp.mkdirSync("iv-");
	fs.copySync(path.join(__dirname, "../fixtures/myApp"), t.context.tempDir);
	process.chdir(t.context.tempDir);
};
