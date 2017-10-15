import child from "child_process";

/**
 * Promisified child_process.exec
 * @param {string} cmd child_process.exec command
 * @param {Object} opts child_process.exec options
 * @return {Promise} ChildProcess Promise object
 */
function execAsync(cmd, opts) {
	return new Promise((resolve, reject) => {
		child.exec(cmd, opts, (err, stdout) => {
			if (err) {
				reject(err);
			} else {
				resolve(stdout.trim());
			}
		});
	})
		.then(result => {
			return result;
		})
		.catch(err => {
			console.error(err);
		});
}

module.exports = execAsync;
