import type { lib } from 'crypto-js'
import { AES, enc, HmacSHA256, mode, pad } from 'crypto-js'
import { v4 } from 'uuid'

/** 生成uuid v4 */
export const uuid_v4 = () => v4()
/**
 * SHA256(哈希碰撞几率少)
 * @param str 明文
 * @param salt 盐值
 * @returns {string} 哈希值
 */
export function sha256(str: string, salt: lib.WordArray): string {
  return HmacSHA256(str, salt).toString(enc.Hex)
}
/**
 * AES加密
 * @param str 明文
 * @param key 密钥
 * @param iv IV
 * @returns {string} 密文
 */
export function aesEncrypt(str: string, key: lib.WordArray, iv: lib.WordArray): string {
  return AES.encrypt(str, key, {
    mode: mode.CBC,
    padding: pad.Pkcs7,
    iv,
  }).toString()
}
/**
 * AES解密
 * @param str 密文
 * @param key 密钥
 * @param iv IV
 * @returns {string} 明文
 */
export function aesDecrypt(str: string, key: lib.WordArray, iv: lib.WordArray): string {
  return AES.decrypt(str, key, {
    mode: mode.CBC,
    padding: pad.Pkcs7,
    iv,
  }).toString(enc.Utf8)
}
/**
 * 字符串转WordArray
 * @param str 明文
 * @returns {lib.WordArray} WordArray
 */
export const wordArray = (str: string): lib.WordArray => enc.Hex.parse(str)
