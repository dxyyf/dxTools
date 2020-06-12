module.exports = {
  /**
   * Build url string. Example '/list/:id/detail' with params={id:2}, get return value '/list/2/detail'. Replace '/:w+/' by params gives.
   * @param  {url} url
   * @param  {{[key:string]:string|number}} params
   */

  buildUrl(url, params) {
    let str = url;
    for (const i in params) {
      if (str.indexOf(":" + i) > -1) {
        str = str.replace(":" + i, params[i]);
        delete params[i];
      }
    }
    return str;
  },
};
