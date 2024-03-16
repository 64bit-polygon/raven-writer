import fetch from "cross-fetch";
import { makeText as text } from "../MakeText/index.js";

export const MALFORMED_LOCALIZATIONS_ERROR_MESSAGE = "localizations are malformed";
export const TOKEN_ERROR_MESSAGE = "POEditor was instantiated without a api token and therefore cannot fetch";
export const PROJECT_ID_ERROR_MESSAGE = "POEditor project id parameter is missing or malformed";
export const LANGUAGES_ERROR_MESSAGE = "languages array parameter is missing or malformed";
export const MISSING_LOCALIZATIONS_ERROR_MESSAGE =
  "localizations were not cached via .fetchLocalizations({...}) or added during instantiation: no dictionary can be made";

const isObject = val => Object.prototype.toString.call(val) === "[object Object]";

export class Raven {
  token;
  defaultUrl = "https://api.poeditor.com/v2/terms/list";
  timeoutId;
  allowKeepAlive = true;
  localizations;
  
  constructor(localizations) {
    this.setLocalizations(localizations);
  }

  setLocalizations(localizations) {
    if (localizations && !isObject(localizations)) throw new TypeError(MALFORMED_LOCALIZATIONS_ERROR_MESSAGE);
    this.localizations = localizations;
  }

  getLocalizations(language) {
    if (!language) return this.localizations;
    const localizationsInLanguage = this.localizations[language];
    return localizationsInLanguage ?? {};
  }

  normalizeResponseData(responseData, languages) {
    return languages.reduce((result, language, i) => {
      const normalizedData = Object.values(responseData[i].result.terms).reduce((keyValMap, term) => ({
        ...keyValMap,
        [term.term]: term.translation.content
      }), {});

      return {
        ...result,
        [language]: normalizedData
      }
    }, {});
  }

  async fetchFromPOEditorApi({id, token: api_token, languages}) {
    const isMissingToken = !api_token || typeof api_token !== "string";

    if (isMissingToken) throw new TypeError(TOKEN_ERROR_MESSAGE);
    if (!id || typeof id !== "string") throw new TypeError(PROJECT_ID_ERROR_MESSAGE);
    if (!languages || !languages.length || !Array.isArray(languages)) {
      throw new TypeError(LANGUAGES_ERROR_MESSAGE);
    }

    const fetchOptions = languages.map(language => ({
      method: "POST",
      body: new URLSearchParams({id, api_token, language})
    }));

    try {
      let responses = fetchOptions.map(options => fetch(this.defaultUrl, options));
      responses = await Promise.all(responses);
  
      let localizations = responses.map(response => response.json());
      localizations = await Promise.all(localizations);

      return this.normalizeResponseData(localizations, languages);

    } catch (err) {
      console.log(`could not cache localizations for POEditor with project id ${id}`, err);
    }
  }

  async fetchFromUrl(url) {
    const response = await fetch(url);
    const localizations = await response.json();

    return localizations;
  }

  async fetchLocalizations({id, token, languages, keepAlive, url}) {
    let localizations;

    if (!url || url === this.defaultUrl) {
      localizations = await this.fetchFromPOEditorApi({id, token, languages});
    } else {
      localizations = await this.fetchFromUrl(url);
    }

    this.setLocalizations(localizations);
    
    if (keepAlive && this.allowKeepAlive) {
      this.timeoutId = setTimeout(() => {
        this.fetchLocalizations({id, token, languages, keepAlive, url});
      }, keepAlive)
    }
  }

  kill() {
    clearTimeout(this.timeoutId);
    this.allowKeepAlive = false;
  }

  makeText(str, interpolations) {
    return text(str, interpolations)
  }

  makeDictionary(language) {
    if (!isObject(this.localizations)) throw new TypeError(MISSING_LOCALIZATIONS_ERROR_MESSAGE);

    return (key, interpolations) => {
      const values = this.localizations[language];
      const value = values[key];
      if (value === undefined) return key;
      return this.makeText(value, interpolations);
    }
  }
};