export const BASIC_KEY = "MY_FIRST_KEY";
export const BASIC_VAL = "my first value";
export const MD_AND_INTERPOLATIONS_KEY = "VAL_WITH_MD_AND_INTERPOLATIONS";
export const MD_AND_INTERPOLATIONS_VAL = "some **bold** text, some *italic* text, a [link](http://example.com), and some interpolations: {{val1}}, {{val2}}";

export default {
  "response": {
    "status": "success",
    "code": "200",
    "message": "OK"
  },
  "result": {
    "terms": [
      {
        "term": BASIC_KEY,
        "context": "my first value",
        "plural": "",
        "created": "2024-03-12T20:28:51+0000",
        "updated": "",
        "translation": {
          "content": BASIC_VAL,
          "fuzzy": 0,
          "updated": "2024-03-12T20:31:49+0000"
        },
        "reference": "",
        "tags": [],
        "comment": ""
      },
      {
        "term": "MY_SECOND_KEY",
        "context": "",
        "plural": "",
        "created": "2024-03-13T20:12:05+0000",
        "updated": "",
        "translation": {
          "content": "my second value",
          "fuzzy": 0,
          "updated": "2024-03-13T20:12:24+0000"
        },
        "reference": "",
        "tags": [],
        "comment": ""
      },
      {
        "term": "VAL_WITH_INTERPOLATIONS",
        "context": "",
        "plural": "",
        "created": "2024-03-14T22:05:31+0000",
        "updated": "",
        "translation": {
          "content": "a first name: {{firstname}}, a last name: {{lastname}}",
          "fuzzy": 0,
          "updated": "2024-03-14T22:08:28+0000"
        },
        "reference": "",
        "tags": [],
        "comment": ""
      },
      {
        "term": "VAL_WITH_BOLD",
        "context": "",
        "plural": "",
        "created": "2024-03-14T22:05:44+0000",
        "updated": "",
        "translation": {
          "content": "some **bold** text",
          "fuzzy": 0,
          "updated": "2024-03-14T22:09:02+0000"
        },
        "reference": "",
        "tags": [],
        "comment": ""
      },
      {
        "term": "VAL_WITH_ITALIC",
        "context": "",
        "plural": "",
        "created": "2024-03-14T22:05:58+0000",
        "updated": "",
        "translation": {
          "content": "some **italic** text",
          "fuzzy": 0,
          "updated": "2024-03-14T22:09:11+0000"
        },
        "reference": "",
        "tags": [],
        "comment": ""
      },
      {
        "term": "VAL_WITH_LINK",
        "context": "",
        "plural": "",
        "created": "2024-03-14T22:06:07+0000",
        "updated": "",
        "translation": {
          "content": "a [link](http://example.com)",
          "fuzzy": 0,
          "updated": "2024-03-14T22:09:34+0000"
        },
        "reference": "",
        "tags": [],
        "comment": ""
      },
      {
        "term": "VAL_WITH_BOLD_ITALIC_AND_LINK",
        "context": "",
        "plural": "",
        "created": "2024-03-14T22:06:24+0000",
        "updated": "",
        "translation": {
          "content": "some **bold** text, some **italic** text, a [link](http://example.com)",
          "fuzzy": 0,
          "updated": "2024-03-14T22:10:09+0000"
        },
        "reference": "",
        "tags": [],
        "comment": ""
      },
      {
        "term": MD_AND_INTERPOLATIONS_KEY,
        "context": "",
        "plural": "",
        "created": "2024-03-14T22:06:45+0000",
        "updated": "",
        "translation": {
          "content": MD_AND_INTERPOLATIONS_VAL,
          "fuzzy": 0,
          "updated": "2024-03-14T22:10:54+0000"
        },
        "reference": "",
        "tags": [],
        "comment": ""
      }
    ]
  }
}