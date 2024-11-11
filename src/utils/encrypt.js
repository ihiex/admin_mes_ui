import JSEncrypt from 'jsencrypt'
let Base64 = require('js-base64').Base64
import CryptoJS from 'crypto-js'

/* let privateKey =
  'MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBAMFPa+v52FkSUXvcUnrGI/XzW3EpZRI0s9BCWJ3oNQmEYA5luWW5p8h0uadTIoTyYweFPdH4hveyxlwmS7oefvbIdiP+o+QIYW/R4Wjsb4Yl8MhR4PJqUE3RCy6IT9fM8ckG4kN9ECs6Ja8fQFc6/mSl5dJczzJO3k1rWMBhKJD/AgMBAAECgYEAucMakH9dWeryhrYoRHcXo4giPVJsH9ypVt4KzmOQY/7jV7KFQK3x//27UoHfUCak51sxFw9ek7UmTPM4HjikA9LkYeE7S381b4QRvFuf3L6IbMP3ywJnJ8pPr2l5SqQ00W+oKv+w/VmEsyUHr+k4Z+4ik+FheTkVWp566WbqFsECQQDjYaMcaKw3j2Zecl8T6eUe7fdaRMIzp/gcpPMfT/9rDzIQk+7ORvm1NI9AUmFv/FAlfpuAMrdL2n7p9uznWb7RAkEA2aP934kbXg5bdV0R313MrL+7WTK/qdcYxATUbMsMuWWQBoS5irrt80WCZbG48hpocJavLNjbtrjmUX3CuJBmzwJAOJg8uP10n/+ZQzjEYXh+BszEHDuw+pp8LuT/fnOy5zrJA0dO0RjpXijO3vuiNPVgHXT9z1LQPJkNrb5ACPVVgQJBALPeb4uV0bNrJDUb5RB4ghZnIxv18CcaqNIft7vuGCcFBAIPIRTBprR+RuVq+xHDt3sNXdsvom4h49+Hky1b0ksCQBBwUtVaqH6ztCtwUF1j2c/Zcrt5P/uN7IHAd44K0gIJc1+Csr3qPG+G2yoqRM8KVqLI8Z2ZYn9c+AvEE+L9OQY='
let publicKey = `MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCzr7wcrBMtmcdOK/Ln3POImTbJO84NsQ5nkvcV/d26z5a+dXZfu5pFIQv9AArM5Pe55PxHxQIVUhQxwpkykzJ8KWlazoNIrkIQGndPhtOdDYa/DADpkNOZIIPBAkr7GBgpvFFc5VR0BwWy77MzWVn870W+jlcJ5PjLli+Svb4I+wIDAQAB`

 */

let publicKey = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC6Gyj4Irm7SvRLYFv0HLkj6sfr
TE+YzAe4uG5FBoied2mC85ZlvENzyxkrgag8i8ufLGb0g2vcMvy1lZsxtxg+9Cos
pz1IVwjt1D6jZfyHgEkfjei0ufdJ0/V3gBwXyW1ewRdB1LTE929HMaRmCLXFMnjq
swQSAr/1ZDEEcRFw1QIDAQAB
-----END PUBLIC KEY-----`
let privateKey = `-----BEGIN PRIVATE KEY-----
MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBALobKPgiubtK9Etg
W/QcuSPqx+tMT5jMB7i4bkUGiJ53aYLzlmW8Q3PLGSuBqDyLy58sZvSDa9wy/LWV
mzG3GD70KiynPUhXCO3UPqNl/IeASR+N6LS590nT9XeAHBfJbV7BF0HUtMT3b0cx
pGYItcUyeOqzBBICv/VkMQRxEXDVAgMBAAECgYAFQ8tu6ZyTfdVXZIx1ZXKfX370
Wx5NVkhJo34LGdo3kW08tSNmEWNfHTnDD1HxFItYH2tyM12TxyV7BZZ0W5el8+qO
P/gBWkvE6b1lM/lY+o+jX1vb+t5RHaafcdEvPxJuHDhkW7o55cX1SvAXeQoPmGux
Q7Y9ZLTjSxh9JcZJaQJBAOKftWwcPpyJ7dDfP51478Fv86C49sZz36bfVJzJjOT7
F63AqBBMGoV4zdN1x3/30t3w1ZWu7AWWi1UjqKAsFvMCQQDSOuipAV+Skv4l2Zkr
TZwtOhzgUCTbuP3tDbNCPAbaRe3JQhW/FMPaGEtm0/txm+Qt97HHg/FjTVCnhbsO
AVsXAkBXCIDzSRGeqrYDfol+36AsSONmuUJEyuF8w85J/Hm4wtnAJ/ojcCbLVa6u
ZFA+zB1WkRRlzOzl5IAULYKoKOaTAkAcl1hnC8HEvGsGGMblBcQUvo+Izj2FCG64
W6Gig2lnLBV/xpYQi7FrKtyuWmwa8lmhCsvJ157vo2cxsVVUPUj3AkEA3LdMeERB
Ug/Rh+ujZMPa/8KqvgVgBg1x+Jz3w+Gmng795JWH4v6tqgfO9WC6ud5x1Lmp5I8E
3PEY4II1kZ3wxA==
-----END PRIVATE KEY-----`

/**
 * @author Jason.zou 305043598@qq.com
 * @description RSA加密
 * @param data
 * @param {*} isSerialization=false 字符串时可以不用转
 * @returns {Promise<{param: PromiseLike<ArrayBuffer>}|*>}
 */
export function encryptedData(data, isSerialization = false) {
  let encrypt = new JSEncrypt()
  /*  encrypt.setPublicKey(
     `-----BEGIN PUBLIC KEY-----${publicKey}-----END PUBLIC KEY-----`
   ) */
  encrypt.setPublicKey(publicKey)
  data = encrypt.encrypt(isSerialization ? JSON.stringify(data) : data)
  return data
}

/**
 * @author Jason.zou 305043598@qq.com
 * @description RSA解密
 * @param data
 * @param {*} isSerialization=false 字符串时可以不用转
 * @returns {PromiseLike<ArrayBuffer>}
 */
export function decryptedData(data, isSerialization = false) {
  if (!data) return '';

  let decrypt = new JSEncrypt()
  /*  decrypt.setPrivateKey(
     `-----BEGIN RSA PRIVATE KEY-----${privateKey}-----END RSA PRIVATE KEY-----`
   ) */
  decrypt.setPrivateKey(privateKey)
  let DData = decrypt.decrypt(isSerialization ? JSON.stringify(data) : data)
  return DData ? isSerialization ? JSON.parse(DData) : DData : ''
}

export function encryptedBase64(data) {
  return Base64.encode(data)
}

export function decryptedBase64(data) {
  return Base64.decode(data)
}
/**
 * RAS加密 密钥以参数方式传入
 * @author Jason.zou 305043598@qq.com
 * @param {*} publicKey
 * @param {*} data
 * @param {*} isSerialization=false 字符串时可以不用转
 * @returns
 */
export function encryptedJSEncryptData(publicKey, data, isSerialization = false) {
  let encrypt = new JSEncrypt()
  encrypt.setPublicKey(publicKey)
  /*  encrypt.setPublicKey(
     `-----BEGIN PUBLIC KEY-----${publicKey}-----END PUBLIC KEY-----`
   ) */
  data = encrypt.encrypt(isSerialization ? JSON.stringify(data) : data)
  return data
}

/**
 * RAS解密 密钥以参数方式传入
 * @author Jason.zou 305043598@qq.com
 * @param {*} privateKey
 * @param {*} data
 * @param {*} isSerialization=false 字符串时可以不用转
 * @returns
 */
export function decryptedJSEncryptData(privateKey, data, isSerialization = false) {
  let decrypt = new JSEncrypt()
  decrypt.setPrivateKey(privateKey)
  /*  decrypt.setPrivateKey(
     `-----BEGIN RSA PRIVATE KEY-----${privateKey}-----END RSA PRIVATE KEY-----`
   ) */
  data = decrypt.decrypt(isSerialization ? JSON.stringify(data) : data)
  return JSON.parse(data)
}

/**
 * AES加密方法，默认CBC模式
 * @author Jason.zou 305043598@qq.com
 * @param {*} content 需加密字符串
 * @param {*} key 密钥
 * @returns 返回已加密字符串
 */
export function aesEncrypt(content, key) {
  return CryptoJS.AES.encrypt(content, key).toString()
}

/**
 * AES解密方法
 * @author Jason.zou 305043598@qq.com
 * @param {*} content 已加密字符串
 * @param {*} key 密钥
 * @returns 返回已解密字符串
 */
export function aesDecrypt(content, key) {
  const bytes = CryptoJS.AES.decrypt(content, key)
  return bytes.toString(CryptoJS.enc.Utf8)
}
