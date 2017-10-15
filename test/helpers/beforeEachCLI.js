import beforeEach from "./beforeEach";
import tempInitAndVersion from "./tempInitAndVersion";

module.exports = t => {
	beforeEach(t);
	delete process.env.npm_lifecycle_event;
	tempInitAndVersion();
};
