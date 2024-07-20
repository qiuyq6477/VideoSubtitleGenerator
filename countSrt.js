
import path from 'path'
import { translate } from './translate.js';
import { sourceSrtSaveName, translateServiceProvider, videoDir, whisperModel, srtConfig, targetSrtFormat } from './config.js';
import { extractAudio, renderFilePath, installWhisper, formatTime } from './utils.js';
import { glob, globSync, globStream, globStreamSync, Glob } from 'glob'
import fs from 'fs';
const { log, error } = console;



export async function countSrt()
{
  const srtfile = await glob(videoDir + '/**/*' + srtConfig.sourceLanguage + '.' + targetSrtFormat, { ignore: 'node_modules/**' })
  let i = 1
  let charCount = 0
  let lineCount = 0
  for await (const nameWithPath of srtfile) {
    const file = path.basename(nameWithPath)
    const dir = path.dirname(nameWithPath)

    const lastIndex = file.indexOf(srtConfig.sourceLanguage + "." + targetSrtFormat);
    const fileName = file.substring(0, lastIndex);
    const srtFile = `${renderFilePath(dir, sourceSrtSaveName, fileName)}`;
    i++;
    try {
      const absolutePath = `${srtFile}.${targetSrtFormat}`
      const result = fs.readFileSync(absolutePath, 'utf8');
      const data = result.split('\n');
      let tempCount = 0
      if (targetSrtFormat == "srt")
      {
        for (var j = 0; j < data.length; j += 4) {
          const source = data[j + 2];
          if (!source) continue;
          tempCount += source.length
          lineCount++
        }
      }
      else if (targetSrtFormat == "vtt")
      {
        let step = 3
        for (var j = 2; j < data.length; j += step) {
          let i = 1
          while(true)
          {
            const source = data[j + i];
            if(!source || source.trim().length === 0)
            {
              break
            }
            tempCount += source.length
            lineCount++
            i++
          }
          if(i > 2)
          {
            step += i - 2
          }
        }
      }
      charCount += tempCount
    } catch (err) {
      log('执行出错', err);
    }
  }
  log('全部统计完成, 行数：%d  字符数: %d', lineCount, charCount);
}