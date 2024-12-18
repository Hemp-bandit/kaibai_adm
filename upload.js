const ObsClient = require("esdk-obs-nodejs");
const fs = require('fs');
const path = require('path');
const axios = require('axios');

let obsClient = null

async function init() {
  // 创建ObsClient实例
  let res = await axios.get("http://kaibai.cloud:30000/api/obs/get_keys")
  if (res.data.code === 0) {
    let credential = res.data.data.credential;

    obsClient = new ObsClient({
      access_key_id: credential.access,
      secret_access_key: credential.secret,
      security_token: credential.securitytoken,
      server: "https://obs.cn-east-3.myhuaweicloud.com",
    });
    console.log('[ obsClient ] >', obsClient)
    const dir = fs.readdirSync(path.resolve(__dirname, './dist'))
    for (const d of dir) {
      const f_name = `adm/${d}`;
      console.log('[ f_name ] >', f_name)
      const content = fs.readFileSync(path.resolve(__dirname, `./dist/${d}`));
      await putObject(f_name, content);
    }


  }
}
async function putObject(Key, Body) {
  try {
    const params = {
      // 指定存储桶名称
      Bucket: "kaibai-admin",
      // 指定对象名，此处以 example/objectname 为例
      Key,
      // 指定文本对象
      Body
    };
    // 文本上传对象
    const result = await obsClient.putObject(params);
    if (result.CommonMsg.Status <= 300) {
      console.log("Put object(%s) under the bucket(%s) successful!!", params.Key, params.Bucket);
      console.log("RequestId: %s", result.CommonMsg.RequestId);
      console.log("StorageClass:%s, ETag:%s", result.InterfaceResult.StorageClass, result.InterfaceResult.ETag);
      return;
    };
    console.log("An ObsError was found, which means your request sent to OBS was rejected with an error response.");
    console.log("Status: %d", result.CommonMsg.Status);
    console.log("Code: %s", result.CommonMsg.Code);
    console.log("Message: %s", result.CommonMsg.Message);
    console.log("RequestId: %s", result.CommonMsg.RequestId);
  } catch (error) {
    console.log("An Exception was found, which means the client encountered an internal problem when attempting to communicate with OBS, for example, the client was unable to access the network.");
    console.log(error);
  };
};

init();

