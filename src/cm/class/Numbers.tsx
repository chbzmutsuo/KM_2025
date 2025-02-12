export class Numbers {
  static getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }
}
