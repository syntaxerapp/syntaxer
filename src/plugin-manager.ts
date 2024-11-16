import * as ShelfDependency from 'shelf-dependency'
import { SamplePlugin } from './plugins/sample-plugin'

const container = new ShelfDependency.Container()

container.register('sample', SamplePlugin)
container.register('logger', console)

export { container }