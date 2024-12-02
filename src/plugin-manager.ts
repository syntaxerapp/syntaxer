// import * as ShelfDependency from 'shelf-dependency'
// import { SamplePlugin } from './plugins/sample-plugin'

// const container = new ShelfDependency.Container()

// container.register('sample', SamplePlugin)
// container.register('logger', console)

// export { container }

import {PluginManager} from 'live-plugin-manager'

const manager = new PluginManager()

async function run() {
  await manager.install('sample-plugin')

  const moment = manager.require('moment')
  console.log(moment().format())

  await manager.uninstall('moment')
}

run()  