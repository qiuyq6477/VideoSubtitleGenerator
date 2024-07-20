import fs from 'fs';
import { videoDir, targetSrtFormat, srtConfig } from './config.js';
import { glob } from 'glob'



export async function deleteSrt()
{
    const path = `${videoDir}/**/*${srtConfig.targetLanguage}.${targetSrtFormat}`
    console.log(path)
    const srtFile = await glob(path, { ignore: 'node_modules/**' })
    let i = 0
    for (const nameWithPath of srtFile) {
        i++;
        console.log('%s (%d / %d)', nameWithPath, i, srtFile.length);
        fs.unlink(nameWithPath, (err) => {
            if (err) 
                error(err);
        });
    }
}