const ObsClient = require("esdk-obs-nodejs");
const fs = require('fs');
const path = require('path');
const urlLib = require('url');
const https = require('https')
console.log('[ ObsClient ] >', ObsClient)
// 创建ObsClient实例
const obsClient = new ObsClient({
  access_key_id: "HZZSCSRYJD9BZTQX0L8I",
  secret_access_key: "qLV1yUN1OAY2nNxdv7ZEAfP3V44kDNMlU6hFvFa9",
  server: "https://obs.cn-east-3.myhuaweicloud.com",
});

function createSignedUrlSync(fileName, fileContent) {
  // 指定HTTP方法类型, 这里以PUT为例
  const method = 'PUT';
  const params = {
    // 指定存储桶名称
    Bucket: "kaibai-admin",
    // 指定对象名，此处以 example/objectname 为例
    Key: fileName,
    // 指定HTTP方法类型
    Method: method,
    // 指定签名URL的过期时间，这里以3600为例，单位为秒
    Expires: 3600,
    // 指定请求中携带的头域
    Headers: {
      "Content-Type": "text/plain",
    }
  };

  // 生成上传对象的带授权信息的URL
  const res = obsClient.createSignedUrlSync(params);
  console.log("SignedUrl: %s", res.SignedUrl);
  console.log("ActualSignedRequestHeaders: %v", res.ActualSignedRequestHeaders);



  // 使用PUT请求上传对象
  var url = urlLib.parse(res.SignedUrl);
  var req = https.request({
    method: method,
    host: url.hostname,
    port: url.port,
    path: url.path,
    rejectUnauthorized: false,
    headers: res.ActualSignedRequestHeaders || {}
  });
  console.log('Creating object using url:' + res.SignedUrl);

  req.on('response', (serverback) => {
    var buffers = [];
    serverback.on('data', (data) => {
      buffers.push(data);
    }).on('end', () => {
      if (serverback.statusCode < 300) {
        console.log('Creating object using temporary signature succeed.');
      } else {
        console.log('Creating object using temporary signature failed!');
        console.log('status:' + serverback.statusCode);
        console.log('\n');
      };
      buffers = Buffer.concat(buffers);
      if (buffers.length > 0) {
        console.log(buffers.toString());
      };
      console.log('\n');
    });
  }).on('error', (err) => {
    console.log('Creating object using temporary signature failed!');
    console.log(err);
    console.log('\n');
  });

  if (fileContent) {
    req.write(fileContent);
  };
  req.end();
};

const dir = fs.readdirSync(path.resolve(__dirname, './dist'))
dir.forEach(d => {
  const f_name = `adm/${d}`;
  const content = fs.readFileSync(path.resolve(__dirname, `./dist/${d}`));
  createSignedUrlSync(f_name, content);
})


