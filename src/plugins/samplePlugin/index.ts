import { SyntaxerPlugin } from '../../index'
// import { SyntaxerPlugin } from 'syntaxer'

class SamplePlugin extends SyntaxerPlugin {
  convertCommand(text: string): string {
	  return text + ' converted'
  }
}

export default SamplePlugin