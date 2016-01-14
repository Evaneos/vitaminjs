import koa from 'koa';
import {createServer} from 'http';
import {renderToString} from 'react-dom/server';
import path from 'path';

// Need commonJS for dynamic modules
const serverDescriptor = require(path.resolve(process.cwd(), 'src', 'server_descriptor'));
const app = koa();
app.use(function *(){
  this.body = `
	<body>
		<div id="test">${renderToString(serverDescriptor.rootComponent)}</div>
		<script src="bundle.js"></script>
	</body>
  `;
});

app.listen(3000);