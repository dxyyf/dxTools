module.exports = {
  /**
   * Deep clone JsonType data
   * @param  {JSON} data
   * @returns {JSON}
   */
  cloneJson(data) {
    return JSON.parse(JSON.stringify(data));
  },

  /**
   * Get if string is JSON like
   * @param  {string} str
   * @returns {boolean}
   */
  isJsonString(str) {
    try {
      const obj = JSON.parse(str);
      if (typeof obj === "object") {
        return obj;
      }
    } catch (e) {}
    return false;
  },
};
