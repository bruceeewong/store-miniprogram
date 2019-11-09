class Validate {
  static isNumber(item) {
    return typeof item === 'number';
  }
  static isString(item) {
    return typeof item === 'string';
  }
  static isUndefined(item) {
    return typeof item === 'undefined';
  }
  static isArray(item) {
    return Array.isArray(item);
  }
  static isObject(item) {
    return Object.prototype.toString.call(item) === '[object Object]';
  }
  static isFunction(item) {
    return Object.prototype.toString.call(item) === '[object Function]';
  }
  static isNull(item) {
    return Object.prototype.toString.call(item) === '[object Null]';
  }
}

export default Validate;
