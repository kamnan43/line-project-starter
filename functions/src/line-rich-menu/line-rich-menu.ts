import * as lineSDK from '@line/bot-sdk';
import * as fs from 'fs';


async function getCurrentMenu(lineClient) {
  return lineClient.getRichMenuList();
}

async function createMenu(lineClient, jsonPath, imagePath) {
  console.log('create RichMenu', __dirname);
  const jsonContent = fs.readFileSync(__dirname + jsonPath);
  const imageContent = fs.readFileSync(__dirname + imagePath);
  const richMenuId = await lineClient.createRichMenu(jsonContent);
  await lineClient.setRichMenuImage(richMenuId, imageContent, 'image/png');
  console.log('upload RichMenu Image');
  await lineClient.setDefaultRichMenu(richMenuId);
  console.log('set Default RichMenu to user');
}

async function deleteRichMenu(lineClient, richMenuId) {
  console.log('delete old RichMenu');
  await lineClient.deleteRichMenu(richMenuId);
}

export async function setRichMenu(config, jsonPath, imagePath) {
  const lineClient = new lineSDK.Client(config);
  const currentMenu = await getCurrentMenu(lineClient);
  console.log('get current RichMenu');
  if (currentMenu && currentMenu.length) {
    await deleteRichMenu(lineClient, currentMenu[0].richMenuId);
    await createMenu(lineClient, jsonPath, imagePath);
  } else {
    await createMenu(lineClient, jsonPath, imagePath);
  }
}