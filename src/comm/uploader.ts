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
      console.log('[ Key ] >', Key)
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



export class HwUpload {
  clientInfo: ObsRes;
  client: any;
  uploadResult: any;
  async initClient() {
    let res = await user_instance.get<any, T_basic_rsp<ObsRes>>("/obs/get_keys");
    const clientInfo = res.data;
    this.clientInfo = clientInfo;
    this.client = new ObsClient({
      access_key_id: clientInfo.credential.access,
      secret_access_key: clientInfo.credential.secret,
      server: "https://obs.cn-east-3.myhuaweicloud.com",
      security_token: clientInfo.credential.securitytoken
    });
  }

  /**
   * 直接上传
   */
  async singleUpload(name: string, file: File) {
    const Key = `store/${name}`;
    // fake 一个进度
    let percent = 0;
    const uploadCofing = {
      Bucket: "kaibai-admin",
      Key,
      SourceFile: file,
      ACL: this.client.enums.AclPublicRead
    };
    const result = await this.client.putObject(uploadCofing);
    console.log('CommonMsg:', result.CommonMsg);
    if (result.InterfaceResult) {
      console.log('InterfaceResult:', result.InterfaceResult);
    }
    if (result.CommonMsg.Status === 200) {
      console.log(result.InterfaceResult);
      return `https://kaibai-admin.obs.cn-east-3.myhuaweicloud.com/${Key}`
    }
  }

  /**
   * 分片上传
   */
  multipartUpload(name: string, file: File) {
    const uploadResult = this.uploadResult;
    const Key = `store/${name}`;
    let cp = null;
    const uploadCofing = {
      Bucket: "kaibai-admin",
      Key,
      SourceFile: file,
      ACL: this.client.enums.AclPublicRead,
      PartSize: 3000,
      ProgressCallback: function (transferredAmount, totalAmount, totalSeconds) {
        console.log(transferredAmount * 1.0 / totalSeconds / 1024);
        console.log(transferredAmount * 100.0 / totalAmount);
        // option.onProgress({ percent: transferredAmount * 100.0 / totalAmount });
      },
      EventCallback: function () {
        // 处理事件响应
      },
      ResumeCallback: function (resumeHook, uploadCheckpoint) {
        // 获取取消断点续传上传任务控制参数
        // 记录断点
        cp = uploadCheckpoint;
      }
    };
    // 解决上传报服务器错误
    const clientInfo = this.clientInfo;
    const client = new ObsClient({
      access_key_id: clientInfo.credential.access,
      secret_access_key: clientInfo.credential.secret,
      server: "https://obs.cn-east-3.myhuaweicloud.com",
      security_token: clientInfo.credential.securitytoken,
      useRawXhr: true,
    });

    client.uploadFile(uploadCofing, (err, result) => {
      console.log('Error-->' + err);
      // 出现错误，再次调用断点续传接口，继续上传任务
      if (err) {
        client.uploadFile({
          UploadCheckpoint: cp,
          ProgressCallback: function (transferredAmount, totalAmount, totalSeconds) {
            console.log(transferredAmount * 1.0 / totalSeconds / 1024);
            console.log(transferredAmount * 100.0 / totalAmount);
            // option.onProgress({ percent: transferredAmount * 100.0 / totalAmount });
          },
          EventCallback: function () {
            // 处理事件响应
          }
        }, function (err, result) {
          if (err) {
            console.log('Error-->' + err);
            // option.onError(err);
          } else {
            if (result.CommonMsg.Status < 300) {
              console.log('InterfaceResult:', result.InterfaceResult);
              // option.onSuccess(uploadResult, result.InterfaceResult);
            } else {
              console.log('Code-->' + result.CommonMsg.Code);
              console.log('Message-->' + result.CommonMsg.Message);
              // option.onError(err);
            }
          }
        });
      } else {
        console.log('Status-->' + result.CommonMsg.Status);
        if (result.CommonMsg.Status < 300 && result.InterfaceResult) {
          console.log(result);
          console.log('RequestId-->' + result.InterfaceResult.RequestId);
          console.log('ETag-->' + result.InterfaceResult.ETag);
          // option.onSuccess(uploadResult, result.InterfaceResult);
        } else {
          console.log(err);

        }
      }
    });
  }
}
