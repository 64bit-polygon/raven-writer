export const isMD = str => /[\[\*]/.test(str);

export const makeAnchorTags = str =>
  str.replace(
    /\[([^\]]+?)\]\((.+?)\)/gm,
    "<a href='$2' target='_blank'>$1</a>"
  );

export const makeBoldTags = str =>
  str.replace(/\*\*([^ \*].+?)\*\*/gm, "<b>$1</b>");

export const makeItalicTags = str =>
  str.replace(/\*([^\* ]*?[^\* ])\*/gm, "<i>$1</i>");

export const mdToHtmlStr = str => [makeBoldTags, makeItalicTags, makeAnchorTags].reduce(
  (strResult, func) => func(strResult)
, str);
