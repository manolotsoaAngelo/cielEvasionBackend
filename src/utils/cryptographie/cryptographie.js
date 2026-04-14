//import { crypter, decrypter } from '../utils/cryptographie/cryptographie.js'

export function crypter(message) {
  if (message) {
    return btoa(message);
  }
}

export function decrypter(message) {
  if (message) {
    return atob(message);
  }
}