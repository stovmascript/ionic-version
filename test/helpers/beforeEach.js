import fs from "fs-extra";
import path from "path";
import tar from "tar";
import temp from "temp";

temp.track();

module.exports = t => {
	t.context.tempDir = temp.mkdirSync("iv-");
	fs.copySync(path.join(__dirname, "../fixtures/myApp"), t.context.tempDir);
	process.chdir(t.context.tempDir);
	tar.x({ file: "node_modules.tgz", sync: true });
};
