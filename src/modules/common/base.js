import Fastclick from 'fastclick';
import {log} from 'common/logger';

Fastclick.attach(document.body);
log(`Running in ${process.env.NODE_ENV} mode.`);
