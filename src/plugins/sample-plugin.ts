export class SamplePlugin {
	constructor(readonly logger: Console) {
	}

	returnText() {
		this.logger.log('hello')
	}
}