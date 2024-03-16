import {
  Localize,
  MALFORMED_LOCALIZATIONS_ERROR_MESSAGE,
  TOKEN_ERROR_MESSAGE,
  PROJECT_ID_ERROR_MESSAGE,
  LANGUAGES_ERROR_MESSAGE,
  MISSING_LOCALIZATIONS_ERROR_MESSAGE
} from "./index.js";
import enUsMock, {
  BASIC_KEY,
  BASIC_VAL,
  MD_AND_INTERPOLATIONS_KEY
} from "./fixtures/enUsMock.js";
import enGbMock from "./fixtures/enGbMock.js";
import customUrlMock from "./fixtures/customUrlMock.js";

const EN_US = "en-us";
const EN_GB = "en_gb";
const INTERPOLATION_1 = "first";
const INTERPOLATION_2 = "second";
const HTML_STR_WITH_INTERPOLATIONS =
  `some <b>bold</b> text, some <i>italic</i> text, a <a href='http://example.com' target='_blank'>link</a>, and some interpolations: ${INTERPOLATION_1}, ${INTERPOLATION_2}`;

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

describe("Localize", () => {
  let POE;
  beforeEach(() => {
    fetch.resetMocks();
    POE = new Raven();
  });

  afterEach(() => {
    POE = undefined;
  });

  it("should store API responses correctly", async () => {
    fetch.mockResponseOnce(JSON.stringify(enUsMock));
    await POE.fetchLocalizations({id: "xyz", token: "abc", languages: [EN_US]});
    expect(fetch).toHaveBeenCalledTimes(1);
    const cachedLanguages = Object.keys(POE.localizations);
    const terms = Object.values(POE.localizations);
    expect(cachedLanguages.length).toBe(1);
    expect(cachedLanguages[0]).toBe(EN_US);
    expect(enUsMock.result.terms[0].content).toBe(POE.localizations[terms[0]]);
  });

  it("should refresh the cached localizations", async () => {
    fetch.mockResponseOnce(JSON.stringify(enUsMock));
    fetch.mockResponseOnce(JSON.stringify(enUsMock));
    await POE.fetchLocalizations({id: "xyz", token: "abc", languages: [EN_US], keepAlive: 2000});
    await delay(3000);
    POE.kill();
    expect(fetch).toHaveBeenCalledTimes(2);
    const cachedLanguages = Object.keys(POE.localizations);
    const terms = Object.values(POE.localizations);
    expect(cachedLanguages.length).toBe(1);
    expect(cachedLanguages[0]).toBe(EN_US);
    expect(enUsMock.result.terms[0].content).toBe(POE.localizations[terms[0]]);
  });

  it("should store 2 languages' API responses", async () => {
    fetch.mockResponseOnce(JSON.stringify(enUsMock));
    fetch.mockResponseOnce(JSON.stringify(enGbMock));
    await POE.fetchLocalizations({id: "xyz", token: "abc", languages: [EN_US, EN_GB]});
    expect(fetch).toHaveBeenCalledTimes(2);
    const cachedLanguages = Object.keys(POE.localizations);
    expect(cachedLanguages.length).toBe(2);
    expect(cachedLanguages[0]).toBe(EN_US);
    expect(cachedLanguages[1]).toBe(EN_GB);
  });

  it("should create a dictionary of stored localizations", async () => {
    fetch.mockResponseOnce(JSON.stringify(enUsMock));
    fetch.mockResponseOnce(JSON.stringify(enGbMock));
    await POE.fetchLocalizations({id: "xyz", token: "abc", languages: [EN_US, EN_GB]});
    const Translate = POE.makeDictionary(EN_US);
    expect(Translate(BASIC_KEY)).toBe(BASIC_VAL);
    expect(Translate(MD_AND_INTERPOLATIONS_KEY, {val1: INTERPOLATION_1, val2: INTERPOLATION_2})).toBe(HTML_STR_WITH_INTERPOLATIONS);
    const SOME_NON_EXISTANT_KEY = "random_text";
    expect(Translate(SOME_NON_EXISTANT_KEY)).toBe(SOME_NON_EXISTANT_KEY);
  });

  it("should allow for preloading localizations during instantiation", () => {
    const language = "xx_xx";
    const key = "MY_KEY";
    const val = "my *val* {{dynamic}}";
    const insertedStr = "123";
    const localizations = {
      [language]: {
        [key]: val
      }
    };
    POE = new Raven(localizations);
    const Translate = POE.makeDictionary(language);
    expect(POE.localizations[language][key]).toBe(val);
    expect(Translate(key, {dynamic: insertedStr})).toBe(`my <i>val</i> ${insertedStr}`);
  });

  it("should allow for preloading localizations during instantiation", () => {
    const language = "xx_xx";
    const key = "MY_KEY";
    const val = "my *val* {{dynamic}}";
    const insertedStr = "123";
    const localizations = {
      [language]: {
        [key]: val
      }
    };
    POE = new Raven(localizations);
    const Translate = POE.makeDictionary(language);
    expect(POE.localizations[language][key]).toBe(val);
    expect(Translate(key, {dynamic: insertedStr})).toBe(`my <i>val</i> ${insertedStr}`);
  });

  it("should fetch from a custom URL", async () => {
    fetch.mockResponseOnce(JSON.stringify(customUrlMock));
    await POE.fetchLocalizations({url: "http://example.com"});
    const cachedLanguages = Object.keys(POE.localizations);
    const terms = Object.values(POE.localizations);
    expect(cachedLanguages.length).toBe(2);
    expect(cachedLanguages[0]).toBe(EN_US);
    expect(enUsMock.result.terms[0].content).toBe(POE.localizations[terms[0]]);
  });

  it("should throw an error if a POEditor is instantiated with a truthy non object value", () => {
    expect(() => new Raven(1)).toThrow(MALFORMED_LOCALIZATIONS_ERROR_MESSAGE);
    expect(() => new Raven(true)).toThrow(MALFORMED_LOCALIZATIONS_ERROR_MESSAGE);
    expect(() => new Raven("abc")).toThrow(MALFORMED_LOCALIZATIONS_ERROR_MESSAGE);
  });

  it("should throw an error if a dictionary is created without localizations", () => {
    expect(() => POE.makeDictionary("en_us")).toThrow(MISSING_LOCALIZATIONS_ERROR_MESSAGE);
  });

  it("should throw an error if a POEditor token is missing in fetchLocalizations({...})", () => {
    expect(async () => await POE.fetchLocalizations({token: undefined, id: "xyz", languages: [EN_US]})).rejects.toThrow(TOKEN_ERROR_MESSAGE);
    expect(async () => await POE.fetchLocalizations({token: null, id: "xyz", languages: [EN_US]})).rejects.toThrow(TOKEN_ERROR_MESSAGE);
    expect(async () => await POE.fetchLocalizations({token: 1, id: "xyz", languages: [EN_US]})).rejects.toThrow(TOKEN_ERROR_MESSAGE);
  });

  it("should throw an error if the project id param is missing in fetchLocalizations({...})", () => {
    expect(async () => await POE.fetchLocalizations({token: "abc", id: undefined, languages: [EN_US]})).rejects.toThrow(PROJECT_ID_ERROR_MESSAGE);
    expect(async () => await POE.fetchLocalizations({token: "abc", id: null, languages: [EN_US]})).rejects.toThrow(PROJECT_ID_ERROR_MESSAGE);
    expect(async () => await POE.fetchLocalizations({token: "abc", id: 1, languages: [EN_US]})).rejects.toThrow(PROJECT_ID_ERROR_MESSAGE);
  });

  it("should throw an error if the languages param is missing in fetchLocalizations({...})", () => {
    expect(async () => await POE.fetchLocalizations({token: "abc", id: "xyz", languages: undefined})).rejects.toThrow(LANGUAGES_ERROR_MESSAGE);
    expect(async () => await POE.fetchLocalizations({token: "abc", id: "xyz", languages: null})).rejects.toThrow(LANGUAGES_ERROR_MESSAGE);
    expect(async () => await POE.fetchLocalizations({token: "abc", id: "xyz", languages: []})).rejects.toThrow(LANGUAGES_ERROR_MESSAGE);
    expect(async () => await POE.fetchLocalizations({token: "abc", id: "xyz", languages: 1})).rejects.toThrow(LANGUAGES_ERROR_MESSAGE);
  });
});