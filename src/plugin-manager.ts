import { Hookable } from 'hookable'

export default class SyntaxerPlugin extends Hookable {
  constructor() {
    // Call to parent to initialize
    super()
    // Initialize Hookable with custom logger
    // super(consola)
  }

  async someFunction() {
    // Call and wait for `hook1` hooks (if any) sequential
    await this.callHook('hook1')
  }
}
