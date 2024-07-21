import path from 'path';
import fs from 'fs';
import {
  contentTemplate,
  contentTemplateRule,
  supportedService,
  targetSrtSaveName,
  translateConfig,
  translateServiceProvider,
  requestTimesPerSecond,
  targetSrtFormat,
} from './config.js';
import { renderTemplate } from './utils.js';

function sleep(ms) {  
  return new Promise(resolve => setTimeout(resolve, ms));  
}

export async function translateText(source)
{
  let text;
  let timesPersecond = -1;
  const requestTime = Date.now();
  switch (translateServiceProvider) {
    case supportedService.volc:
      const volc = await import('./service/volc.js');
      text = await volc.default(source);
      timesPersecond = requestTimesPerSecond.volc;
      break;
    case supportedService.baidu:
      const baidu = await import('./service/baidu.js');
      text = await baidu.default(source);
      break;
    case supportedService.deeplx:
      const deeplx = await import('./service/deeplx.js');
      text = await deeplx.default(source);
      break;
    case supportedService.tencent:
      const tencent = await import('./service/tencent.js');
      text = await tencent.default(source);
      timesPersecond = requestTimesPerSecond.tencent;
    break;
    default:
      text = 'no supported service';
      timesPersecond = -1;
  }
  const endTime = Date.now();
  const costTime = endTime - requestTime - 100;
  const targetTime = (1 / timesPersecond) * 1000
  if(timesPersecond > 0 && costTime < targetTime)
  {
    await sleep(targetTime - costTime);
  }
  return text;
}

export async function translate(folder, fileName, absolutePath) {
  const renderContentTemplate = contentTemplate[contentTemplateRule];
  return new Promise(async (resolve, reject) => {
    try {
      const result = fs.readFileSync(absolutePath, 'utf8');
      const data = result.split('\n');
      const items = [];
      if (targetSrtFormat == "srt")
      {
        for (var i = 0; i < data.length; i += 4) {
          const source = data[i + 2];
          if (!source) continue;
          const text = await translateText(source);
          items.push({
            id: data[i],
            startEndTime: data[i + 1],
            targetContent: text,
            sourceContent: source,
          });
        }
      }
      else if (targetSrtFormat == "vtt")
      {
        for (var j = 0; j < data.length;) {
          let source = data[j];
          if(!source || source.trim().length === 0)
          {
            j++
            continue
          }
          if(source.indexOf("-->") < 0)
          {
            j++
            continue;
          }

          let i = 1
          let content = ""
          while(true)
          {
            source = data[j + i];
            if(!source || source.trim().length === 0)
            {
              break
            }
            content += source + " "
            i++
          }
          if(content != "")
          {
            let id = data[j - 1].trim()
            if(id.length == 0) 
              id = null
            const text = await translateText(content);
            items.push({
              id: id,
              startEndTime: data[j],
              targetContent: text,
              sourceContent: content,
            });
          }
          j += i;
        }
      }
      console.log(fileName)
      const fileSave = path.join(folder, `${renderTemplate(targetSrtSaveName, { fileName, ...translateConfig })}.${targetSrtFormat}`);
      if(targetSrtFormat == "vtt")
      {
        fs.appendFileSync(fileSave, "WEBVTT\n\n", (err) => {
          if (err) {
            console.error(err);
          }
        });
      }
      for (let i = 0; i <= items.length - 1; i++) {
        const item = items[i];
        let id = ""
        if (item.id)
        {
          id = `${item.id}\n`
        }
        const content = id + `${item.startEndTime}\n${renderTemplate(renderContentTemplate, item)}`;
        fs.appendFileSync(fileSave, content, (err) => {
          if (err) {
            console.error(err);
          }
        });
      }
      resolve();
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
}
