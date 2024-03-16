import { makeText } from "./index.js";

describe("makeText", () => {
  it("should add interpolated values and transform markdown into tags", () => {
    expect(
      makeText("At **{{hour}}**, *reload* the page and click this [link](http://test.com)", {
        hour: "9"
      })
    ).toMatch(
      "At <b>9</b>, <i>reload</i> the page and click this <a href='http://test.com' target='_blank'>link</a>"
    );
  });
  
  it("should add interpolated values", async () => {
    const textWithInterpolations = "The time is {{hour}}{{type}}.";
    expect(makeText(textWithInterpolations, { hour: "9", type: "pm" })).toMatch(
      "The time is 9pm."
    );
    expect(makeText(textWithInterpolations)).toMatch(textWithInterpolations);
  });
});
