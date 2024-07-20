import {translate, translateText} from './translate.js';
import { extractAudio, renderFilePath, installWhisper, formatTime } from './utils.js';
import { sourceSrtSaveName, translateServiceProvider, videoDir, whisperModel, targetSrtFormat } from './config.js';
import path from 'path'
import { glob, globSync, globStream, globStreamSync, Glob } from 'glob'
import fs from 'fs';

const strs = [
    "nice to meet you",
    "nice to meet you",
    "nice to meet you",
    "nice to meet you",
    "nice to meet you",
    "nice to meet you",
    "nice to meet you",
    "nice to meet you",
    "nice to meet you",
    "nice to meet you",
];

// for await (const str of strs) {
//     const ss = await translateText(str);
//     console.log(ss);
// }

// const dir = "/Users/zlqiu/Documents/translating/7 Udemy - Master Pointers, Memory Management and Smart Pointers in C++20 2024-2/7. Pointers and Functions/"
// const fileName = "8. Arrays to Functions";

const files = await glob(process.argv[2] + '/**/*.mp4', { ignore: 'node_modules/**' })
console.log(files)
for await (const nameWithPath of files) {
    const file = path.basename(nameWithPath)
    const lastIndex = file.lastIndexOf('.');
    const fileName = file.substring(0, lastIndex);

    const dir = path.dirname(nameWithPath)
    const srtFile = `${renderFilePath(dir, sourceSrtSaveName, fileName)}`;
    await translate(dir, fileName, `${srtFile}.${targetSrtFormat}`);
    console.log(fileName + " done!")
    // fs.unlink(nameWithPath, (err) => {
    // if (err) {
    //     console.error(err);
    // } else {
    //     console.log('删除wav文件', nameWithPath);
    // }
    // });
}
