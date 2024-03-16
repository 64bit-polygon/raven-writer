import {
  mdToHtmlStr,
  makeAnchorTags,
  makeBoldTags,
  makeItalicTags
} from "../MD";

describe("mdToHtmlStr", () => {
  it("should produce an html string with <b> tag, <i> tag, and <a> tag", () => {
    expect(
      mdToHtmlStr("Hello **World**! It *is* a [great day](http://example.com)")
    ).toMatch(
      "Hello <b>World</b>! It <i>is</i> a <a href='http://example.com' target='_blank'>great day</a>"
    );
  });
});

describe("anchor tag", () => {
  it("should produce a basic <a> tag", () =>
    expect(makeAnchorTags("[name](url)")).toMatch(
      "<a href='url' target='_blank'>name</a>"
    )
  );

  it("should produce multiple <a> tags", () =>
    expect(makeAnchorTags("[name1](url1) [name2](url2)")).toMatch(
      "<a href='url1' target='_blank'>name1</a> <a href='url2' target='_blank'>name2</a>"
    )
  );

  it("should produce an <a> tag when it appears at the start of text", () =>
    expect(makeAnchorTags("[name](url) hello world")).toMatch(
      "<a href='url' target='_blank'>name</a> hello world"
    )
  );

  it("should produce an <a> tag when it appears at the end of text", () =>
    expect(makeAnchorTags("hello world [name](url)")).toMatch(
      "hello world <a href='url' target='_blank'>name</a>"
    )
  );

  it("should produce an <a> tag when it's surrounded by text", () => 
    expect(makeAnchorTags("hello[name](url)world")).toMatch(
      "hello<a href='url' target='_blank'>name</a>world"
    )
  );

  it("should produce <a> tags with absolute urls", () => {
    expect(makeAnchorTags("[x](http://example.com)")).toMatch(
      "<a href='http://example.com' target='_blank'>x</a>"
    );
    expect(makeAnchorTags("[x](https://example.com)")).toMatch(
      "<a href='https://example.com' target='_blank'>x</a>"
    );
    expect(makeAnchorTags("[x](mailto:app@example.com)")).toMatch(
      "<a href='mailto:app@example.com' target='_blank'>x</a>"
    );
  });

  it("should produce <a> tags with relative urls", () => {
    expect(makeAnchorTags("[x](/page)")).toMatch(
      "<a href='/page' target='_blank'>x</a>"
    );
    expect(makeAnchorTags("[x](#fragment)")).toMatch(
      "<a href='#fragment' target='_blank'>x</a>"
    );
    expect(makeAnchorTags("[x](/page?b=1&a=2)")).toMatch(
      "<a href='/page?b=1&a=2' target='_blank'>x</a>"
    );
  });

  it("should not work when both name and url are invalid", () => {
    const input = "[]()";
    expect(makeAnchorTags(input)).toMatch(input);
  });

  it("should not work when just name is invalid", () => {
    const input = "[aaa]()";
    expect(makeAnchorTags(input)).toMatch(input);
  });

  it("should not work when just url is invalid", () => {
    const input = "[](aaa)";
    expect(makeAnchorTags(input)).toMatch(input);
  });
});

describe("bold", () => {
  it("should produce a basic <b> tag", () => 
    expect(makeBoldTags("**str**"))
      .toMatch("<b>str</b>")
  );

  it("should produce multiple <b>s", () =>
    expect(makeBoldTags("**hello** **world**"))
      .toMatch("<b>hello</b> <b>world</b>")
  );

  it("should produce multiple <b> at begining of text", () =>
    expect(makeBoldTags("**hello** filler filler"))
      .toMatch("<b>hello</b> filler filler")
  );

  it("should produce multiple <b> at end of text", () =>
    expect(makeBoldTags("filler filler **hello**"))
      .toMatch("filler filler <b>hello</b>")
  );

  it("should work when surrounded by text", () =>
    expect(makeBoldTags("word**str**word"))
      .toMatch("word<b>str</b>word")
  );

  it("should work with 3 *s", () =>
    expect(makeBoldTags("***str***"))
      .toMatch("*<b>str</b>*")
  );

  it("should not produce a <b> with leading white space", () => {
    const input = "** str**";
    expect(makeBoldTags(input)).toMatch(input);
  });

  it("should not produce a <b> with trailing white space", () => {
    const input = "** str **";
    expect(makeBoldTags(input)).toMatch(input);
  });

  it("should not produce a <b> with spaces between the *s", () => {
    const input = "* * str * *";
    expect(makeBoldTags(input)).toMatch(input);
  });
});

describe("italics", () => {
  it("should produce a basic <i> tag", () =>
    expect(makeItalicTags("*str*")).toMatch("<i>str</i>")
  );

  it("should produce multiple <i> tags", () =>
    expect(makeItalicTags("*hello* *world*")).toMatch(
      "<i>hello</i> <i>world</i>"
    )
  );

  it("should produce an <i> tag at the start of text", () =>
    expect(makeItalicTags("*hello* filler filler")).toMatch(
      "<i>hello</i> filler filler"
    )
  );

  it("should produce an <i> tag at the end of text", () =>
    expect(makeItalicTags("filler filler *hello*")).toMatch(
      "filler filler <i>hello</i>"
    )
  );

  it("should produce an <i> tag when surrounded by text", () =>
    expect(makeItalicTags("word*str*word")).toMatch(
      "word<i>str</i>word"
    )
  );

  it("should produce a single <i> tag when surrounded by 3 *s", () =>
    expect(makeItalicTags("***str***")).toMatch("*<i>str</i>*")
  );

  it("should not produce an <i> tag with leading white space", () =>
    expect(makeItalicTags("** str**")).toMatch("** str**")
  );

  it("should not produce an <i> tag when surrounded by white space", () =>
    expect(makeItalicTags("** str **")).toMatch("** str **")
  );

  it("should not produce an <i> tag with white space between *s", () =>
    expect(makeItalicTags("* * str * *")).toMatch("* * str * *")
  )
});


