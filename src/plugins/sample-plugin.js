"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SamplePlugin = void 0;
class SamplePlugin {
    logger;
    constructor(logger) {
        this.logger = logger;
    }
    returnText() {
        this.logger.log('hello');
    }
}
exports.SamplePlugin = SamplePlugin;
