import CryptoJS from "crypto-js";
import Utf8 from "crypto-js/enc-utf8";
import AES from "crypto-js/aes";
import Pkcs7 from "crypto-js/pad-pkcs7";

class AESCipher {
  constructor(key, mode = CryptoJS.mode.ECB, padding = Pkcs7) {
    this.key = Utf8.parse(key);
    this.mode = mode;
    this.padding = padding;
  }

  // 加密函数
  encrypt(plaintext) {
    const encrypted = AES.encrypt(plaintext, this.key, {
      mode: this.mode,
      padding: this.padding,
    }).toString();
    return encrypted;
  }

  // 解密函数（可选）
  decrypt(encryptedText) {
    const decrypted = AES.decrypt(encryptedText, this.key, {
      mode: this.mode,
      padding: this.padding,
    }).toString(Utf8);
    return decrypted;
  }
}

export default AESCipher

