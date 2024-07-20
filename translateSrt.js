
import path from 'path'
import fs from 'fs';
import { translate } from './translate.js';
import { sourceSrtSaveName, translateServiceProvider, videoDir, whisperModel, srtConfig, targetSrtFormat } from './config.js';
import { extractAudio, renderFilePath, installWhisper, formatTime } from './utils.js';
import { glob, globSync, globStream, globStreamSync, Glob } from 'glob'
const { log, error } = console;

function checkIsDir()
{
  const stat = fs.lstatSync(videoDir);
  return stat.isDirectory()
}

async function translateFile(nameWithPath)
{
  const file = path.basename(nameWithPath)
  const dir = path.dirname(nameWithPath)

  const lastIndex = file.indexOf(srtConfig.sourceLanguage + "." + targetSrtFormat);
  const fileName = file.substring(0, lastIndex);
  const srtFile = `${renderFilePath(dir, sourceSrtSaveName, fileName)}`;
  console.log(srtFile)
  try {
    log('开始翻译:', fileName)
    if (translateServiceProvider) {
      await translate(dir, fileName, `${srtFile}.${targetSrtFormat}`);
    }
    log('翻译完成');
  } catch (err) {
    log('执行出错', err);
  }
}
export async function translateSrt()
{
  const startTime = Date.now();
  
  if(!checkIsDir()){
    await translateFile(videoDir)
    return
  }

  const srtfile = await glob(videoDir + '/**/*' + srtConfig.sourceLanguage + '.' + targetSrtFormat, { ignore: 'node_modules/**' })
  srtfile.sort()
  let i = 0
  for await (const nameWithPath of srtfile) {
    i++
    log('%s (%d / %d)', path.basename(nameWithPath), i, srtfile.length);
    await translateFile(nameWithPath)
  }
  const endTime = Date.now();
  log('全部翻译完成, cost time: %s', formatTime(endTime - startTime));
}