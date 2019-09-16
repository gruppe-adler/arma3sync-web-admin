import app from './Server';
import {logger} from './shared';
import {get} from 'config';

// Start the server
const port = get('port');
app.listen(port, () => {
    logger.info('Express server started on port: ' + port);
});
