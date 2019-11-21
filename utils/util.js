export default class Util {
  /**
   * 接受一个长度参数，生成[start, ..., end] 步长为step
   * @param {number} length
   */
  static range(start = 0, end = 0, step = 1) {
    let result = [];
    if (end > start) {
      for (let i = start; i <= end; i += step) {
        result.push(i);
      }
    }
    return result;
  }
}
