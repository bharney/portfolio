import { createServer } from './server';
import { PORT } from './configuration';
// Keep bootstrap minimal and reuse createServer() so middleware order stays consistent.
const server = createServer();

server.listen(PORT, () => {
	console.log(`Server listening to port http://localhost:${PORT}`);
});
