import { SyntaxerPlugin } from '../../plugin-manager'

class SamplePlugin extends SyntaxerPlugin {
  convertCommand(text: string): string {
	  return text + ' converted'
  }
}

export default SamplePlugin