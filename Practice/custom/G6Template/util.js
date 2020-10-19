// import G6 from '@antv/g6'

const fittingString = (str, maxWidth, fontSize) => {
    let currentWidth = 0;
    let res = str;
    let lineCount = 1;
    let strArr = []
    // 匹配中文正则
    const pattern = new RegExp('[\u4E00-\u9FA5]+');
    str.split('').forEach((letter, i) => {
      if (pattern.test(letter)) {
        currentWidth += fontSize;
      } else {
        currentWidth += G6.Util.getLetterWidth(letter, fontSize);
      }
      if (currentWidth > maxWidth) {
        strArr.push(`${letter}\n`)
        lineCount ++
        currentWidth = 0
      } else {
        strArr.push(letter)
      }
    });
    res = strArr.join('')

    return {
      res,
      lineCount,
    };
};

const fittingStringEllipsis = (str, maxWidth, fontSize) => {
    const ellipsis = '...';
    const ellipsisLength = G6.Util.getTextSize(ellipsis, fontSize)[0];
    let currentWidth = 0;
    let res = str;
    const pattern = new RegExp('[\u4E00-\u9FA5]+');
    str.split('').forEach((letter, i) => {
        if (currentWidth > maxWidth - ellipsisLength) return;
        if (pattern.test(letter)) {
            currentWidth += fontSize;
        } else {
            currentWidth += G6.Util.getLetterWidth(letter, fontSize);
        }
        if (currentWidth > maxWidth - ellipsisLength) {
            res = `${str.substr(0, i)}${ellipsis}`;
        }
    });
    return res;
}