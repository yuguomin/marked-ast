const replace = (regex: RegExp, opt = '') => {
  let regexSource = regex.source;
  return function self(name?: RegExp | string, val?: RegExp | string) {
    if (!name) { return new RegExp(regexSource, opt); }
    if (typeof val === 'object') {
      val = val.source;
    }
    val = val ? val.replace(/(^|[^\[])\^/g, '$1') : '';
    regexSource = regexSource.replace(name, val);
    return self;
  };
};

export default replace;