import SyntaxerPlugin from "../plugin-manager"

const lib = new SyntaxerPlugin()

// Register a handler for `hook2`
lib.hook('test', async () => { console.log('Plugin system is working!') })