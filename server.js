const browserSync = require( 'browser-sync' )

const bs = browserSync.create()
const serverPath = __dirname

const serverconfig = {
	server: {
		baseDir: serverPath,
		directory: true,
	},
	files: [
		`${serverPath}/build/**`
	],
	port: 8900,
	open: true,
}


function init() {
	try {
		bs.init( serverconfig )
	} catch( e ) {
		init()
	}
}

init()


