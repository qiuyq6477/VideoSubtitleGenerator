// Depends on tencentcloud-sdk-nodejs version 4.0.3 or higher
import tencentcloud from "tencentcloud-sdk-nodejs-tmt"

const TmtClient = tencentcloud.tmt.v20180321.Client;

// 实例化一个认证对象，入参需要传入腾讯云账户 SecretId 和 SecretKey，此处还需注意密钥对的保密
// 代码泄露可能会导致 SecretId 和 SecretKey 泄露，并威胁账号下所有资源的安全性。以下代码示例仅供参考，建议采用更安全的方式来使用密钥，请参见：https://cloud.tencent.com/document/product/1278/85305
// 密钥可前往官网控制台 https://console.cloud.tencent.com/cam/capi 进行获取

const clientConfig = {
  credential: {
    secretId: "",
    secretKey: "",
  },
  region: "ap-guangzhou",
  profile: {
    httpProfile: {
      endpoint: "tmt.tencentcloudapi.com",
    },
  },
};

export default async function tencent(query) {  
  try {  
    const client = new TmtClient(clientConfig);  
    const params = {  
      "SourceText": query,  
      "Source": "en",  
      "Target": "zh",  
      "ProjectId": 0  
    };  
  
    // 使用 await 等待 TextTranslate 的结果  
    const data = await client.TextTranslate(params);  
  
    // 确保 TextTranslate 返回了正确的结构，并返回 TargetText  
    if (data && data.TargetText) {  
      return data.TargetText;  
    } else {  
      throw new Error('TextTranslate did not return a valid response');  
    }  
  } catch (err) {  
    // 捕获并重新抛出错误，以便调用者可以处理它  
    throw err;  
  }  
}