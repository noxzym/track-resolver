//source: https://github.com/AmandaDiscord/Volcano/blob/main/src/util/LimitedReadWriteStream.ts
const stream = require('stream');
module.exports = class LimitedReadWriteStream extends stream.Transform {
	chunkAmount = 0;

	constructor(chunkLimit) {
		super();
		this.limit = chunkLimit;
	}

	_transform(chunk, encoding, done) {
		if (!this.limit || this.chunkAmount < this.limit) this.push(chunk, encoding);
		if (this.limit && this.chunkAmount >= this.limit) this.end();
		this.chunkAmount++;
		done();
	}
}