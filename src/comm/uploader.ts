import ObsClient from 'esdk-obs-browserjs';
import { user_instance } from "@/comm/request"
import { ObsRes, T_basic_rsp } from './entity';

export default class Uploader {
  client = null
  async init() {
    let res = await user_instance.get<any, T_basic_rsp<ObsRes>>("/obs/get_keys");
    const credential = res.data.credential;

    this.client = new ObsClient({
      access_key_id: credential.access,
      secret_access_key: credential.secret,
      security_token: credential.securitytoken,
      server: "https://obs.cn-east-3.myhuaweicloud.com",
    });

  }

  upload(name: string, file: File) {
    return new Promise((resolve, reject) => {
      const Key = `store/${name}`;
      this.client.putObject({
        Bucket: "kaibai-admin",
        Key,
        SourceFile: file
      }, function (err, result) {
        if (err) {
          console.error('Error-->' + err);
          reject(err)
        } else {
          console.log('Status-->' + result.CommonMsg.Status);
          resolve(result.CommonMsg.Status)
        }
      });
    })

  }

}