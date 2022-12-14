/**Sytem package*/
const CryptoJS = require("crypto-js");
const crypto = require('crypto');
/**User package*/
const config = require('../config/default');

class AesHelper {
    constructor() {
    }
    /*AES Encrypt*/
    Encrypt(data) {
        const dataStr = data
        const encrypted = CryptoJS.AES.encrypt(dataStr, CryptoJS.enc.Latin1.parse(config.aesKey), {
            iv: CryptoJS.enc.Latin1.parse(config.aseIv),
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        })
        return encrypted.toString()
    }
    
    /*AES Decrypt*/
    Decrypt(data) {
        const data2 = data.replace(/\n/gm, "");
        const decrypted = CryptoJS.AES.decrypt(data2, CryptoJS.enc.Latin1.parse(config.aesKey), {
            iv: CryptoJS.enc.Latin1.parse(config.aseIv),
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        })
        return decrypted.toString(CryptoJS.enc.Utf8)
    }
    
    /*AES EncryptECB*/
    EncryptECB(data) {
        const dataStr = data
        const encrypted = CryptoJS.AES.encrypt(dataStr,  CryptoJS.enc.Latin1.parse(config.aesEcbKey), {
            keySize: 128 / 8,
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        })
        const base64Cipher = encrypted.ciphertext.toString(CryptoJS.enc.Base64).replace(/[+]/gm, ' ');
        return base64Cipher;
    }

    /*AES DecryptECB*/
    DecryptECB(data) {
        const dataStr =  data.replace(/[ ]/gm, "+") 
        console.log(dataStr);
        const decrypted = CryptoJS.AES.decrypt(dataStr,  CryptoJS.enc.Latin1.parse(config.aesEcbKey), {
            keySize: 128 / 8,
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        })
        const base64Cipher = decrypted.toString(CryptoJS.enc.Utf8)
        return base64Cipher;
    }
}
module.exports = AesHelper