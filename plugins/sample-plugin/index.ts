import { SyntaxerPlugin } from '../../src/index'
// import { SyntaxerPlugin } from 'syntaxer'

class SamplePlugin extends SyntaxerPlugin {
  commands = {}
  convertCommand(text: string): string {
	  return text + ' converted'
  }
}

export default SamplePlugin