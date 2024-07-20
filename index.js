
import { config } from 'dotenv';
import { translateSrt } from './translateSrt.js';
import { countSrt } from './countSrt.js';
import { genSrt } from './genSrt.js';
import { installWhisper } from './utils.js';


config();
await installWhisper();

if (process.argv.length == 2)
{
    await genSrt();
    await translateSrt();   
}
if (process.argv[3] == "-g") 
{
    await genSrt();
}
else if (process.argv[3] == "-t")
{
    await translateSrt();   
}
else if (process.argv[3] == "-c")
{
    await countSrt();
}

