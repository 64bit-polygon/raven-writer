import { isMD, mdToHtmlStr } from "../MD/index.js";

export const addInterpolatedValues = (str, interpolatedValues) => {
  let result = str;
  Object.keys(interpolatedValues).forEach(value => {
    const variableTemplate = `{{${value}}}`;
    result = result.replace(
      new RegExp(variableTemplate, "g"),
      interpolatedValues[value]
    );
  });
  return result;
}

export const makeText = (str, interpolatedValues) => {
  if (isMD(str)) {
    str = mdToHtmlStr(str);
  }

  if (interpolatedValues !== undefined) {
    str = addInterpolatedValues(str, interpolatedValues);
  }

  return str;
}
