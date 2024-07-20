// 视频文件所在目录 如 /Users/demo/video
export const videoDir = process.argv[2]

/*
whisper.cpp 模型 支持以下
tiny.en
tiny
base.en
base
small.en
small
medium.en
medium
large-v1
large-v2
large-v3
 */
export const whisperModel = 'medium' //'base.en';

export const srtConfig = {
  sourceLanguage: '',
  targetLanguage: 'zh',
};

// 翻译配置，视频原语言与翻译后的目标语言
export const translateConfig = {
  sourceLanguage: '',
  targetLanguage: 'zh',
};

// 生成字幕的格式, 同时也是解析字幕的格式
// srt/vtt
export const targetSrtFormat = "vtt"

// 支持的翻译服务商
export const supportedService = {
  baidu: Symbol.for('baidu'),
  volc: Symbol.for('volc'),
  deeplx: Symbol.for('deeplx'),
  tencent: Symbol.for('tencent'),
};

// 并发请求数，N次/秒
export const requestTimesPerSecond = {
  baidu: 10,
  volc: 10,
  deeplx: 10,
  tencent: 5,
}

// 当前使用的翻译服务商，如果不配置，则不执行翻译流程
export const translateServiceProvider = supportedService.volc;

// 翻译结果字幕文件内容配置
export const contentTemplateRuleMap = {
  onlyTranslate: Symbol.for('onlyTranslate'), // 只输出翻译内容
  sourceAndTranslate: Symbol.for('sourceAndTranslate'), // 输出原始字幕和翻译字幕， 原始字幕在上面
  translateAndSource: Symbol.for('translateAndSource'), // 输出翻译后的字幕和原始字幕， 翻译字幕在上面
};

// 字幕文件内容模板 支持 ${sourceContent}, ${targetContent} 变量
export const contentTemplate = {
  [contentTemplateRuleMap.onlyTranslate]: '${targetContent}\n\n',
  [contentTemplateRuleMap.sourceAndTranslate]: '${sourceContent}\n${targetContent}\n\n',
  [contentTemplateRuleMap.translateAndSource]: '${targetContent}\n${sourceContent}\n\n',
};

// 翻译内容输出模板规则，默认只输出翻译内容, 支持 contentTemplateRuleMap 内的规则
export const contentTemplateRule = contentTemplateRuleMap.sourceAndTranslate;

// 原始字幕文件保存命名规则 支持 fileName, sourceLanguage, targetLanguage 变量
// 如果为空，将不保存原始字幕文件
// eg: '${fileName}.${sourceLanguage}' -> 对于视频名为 text.mp4 的英文视频原始字幕文件名为 text.en.srt
export const sourceSrtSaveName = '${fileName}${sourceLanguage}';

// 翻译后的字幕文件保存命名规则 支持 fileName, sourceLanguage, targetLanguage 变量
export const targetSrtSaveName = '${fileName}.${targetLanguage}';
