import { setRichMenu } from './line-rich-menu';
import { config } from '../config';

async function start() {
  await setRichMenu(config, '/menu.json', '/menu.png');
  console.log('completed');
}

start();