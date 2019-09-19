import app from './Server';
import {logger} from './shared';
import {get} from 'config';

process.umask(0o002); // let user group read-write whatever we change

// Start the server
const port = get('port');
app.listen(port, () => {
    logger.info('Express server started on port: ' + port);
});
