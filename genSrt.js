import fs from 'fs';
import path from 'path'
import { execSync } from 'child_process';
import { sourceSrtSaveName, translateServiceProvider, videoDir, whisperModel, targetSrtFormat } from './config.js';
import { extractAudio, renderFilePath, installWhisper, formatTime } from './utils.js';
import { glob } from 'glob'
const { log, error } = console;

export async function genSrt()
{
  const startTime = Date.now();
  console.log(videoDir)
  const mp4file = await glob(videoDir + '/**/*.mp4', { ignore: 'node_modules/**' })
  let i = 0
  for await (const nameWithPath of mp4file) {
    const file = path.basename(nameWithPath)
    const dir = path.dirname(nameWithPath)

    if (file.endsWith('.mp4')) {
      i++;
      log('%s (%d / %d)', file, i, mp4file.length);
      try {
        const lastIndex = file.lastIndexOf('.');
        const fileName = file.substring(0, lastIndex);
        const wavFile = `${dir}/${fileName}.wav`;
        const srtFile = `${renderFilePath(dir, sourceSrtSaveName, fileName)}`;
        await extractAudio(`${dir}/${file}`, `${wavFile}`);
        //execSync(`ffmpeg -v quiet -stats -i "${dir}/${file}" -ar 16000 -ac 1 -c:a pcm_s16le -y "${wavFile}"`);
        log('完成音频文件提取， 准备生成字幕文件');
        const format = "-o" + targetSrtFormat
        execSync(
          `"./whisper.cpp/main" -m ./whisper.cpp/models/ggml-${whisperModel}.bin -f "${wavFile}" ${format} -of "${srtFile}"`,
        );
        log('完成字幕文件生成');
        fs.unlink(wavFile, (err) => {
          if (err) {
            error(err);
          } else {
            log('删除wav文件', wavFile);
          }
        });
        if (!sourceSrtSaveName) {
          fs.unlink(`${srtFile}.${targetSrtFormat}`, () => {});
        }
      } catch (err) {
        log('执行出错', err);
      }
    }
  }
  const endTime = Date.now();
  log('全部转换完成, cost time: %s', formatTime(endTime - startTime));
}