# `raven-writer`
 
`raven-writer` is a utility to allow for easy translations and interpolations for projects using the popular [POEditor](https://poeditor.com/) localization service.

What `raven-writer` does:

- GETs and caches localizations for your project
- Refreshes those localizations at a given interval
- Transforms simple markdown in your content into HTML strings
- Allows for dynamic interpolation of string values into your content
- Easily gets values by key

---

## Docs

- [`Installation`](#install)
- [`Basic example`](#basic)
- [`Instantiation`](#instantiation) - Creates the `POE instance`
  - [`instance.fetchLocalizations({...})`](#fetchLocalizations) - Fetches and caches localizations
  - [`instance.makeDictionary(language)`](#makeDictionary) - returns a dictionary function
  - [`instance.localizations(language)`](#localizations) - returns the raw localizations
  - [`instance.makeText(str, interpolations)`](#makeText) - helper method to add interpolations to any string value and transform simple markdown into an HTML string
  - [`instance.kill()`](#kill) - Kills all refreshing of localizations on a `POE instance`
- [`Dictionary(key, interpolations)`](#dictionary) - function that returns the value from a cached language
- [`Content markdown and interpolation syntax`](#contentSyntax) - How your POEditor content should be written for MD and interpolations
- [`Localizations structure`](#localizationsStructure)

## <a id="install"></a>Install

```
npm install raven-writer -S
```

## <a id="basic"></a>Basic example

Note: assume there's a term `GREETING` defined in the project with the following `content` values:
**`en_us`**: `"Hello, **{{name}}!**"`

```js
import Raven from "raven-writer";
const POE = new Raven();
await POE.fetchLocalizations({
  id: "<POEDITOR_PROJECT_ID>",
  token: "<YOUR_READ_ONLY_POEDITOR_API_TOKEN>",
  languages: ["en_us"]
});
const Translate = POE.makeDictionary("en_us");
console.log(Translate("GREETING", {name: "Nate"}))
// Logs: "Hello, <b>Nate!</b>"
```

## <a id="instantiation"></a>Instantiation

In most cases you'll instantiate the `POE instance` simply be calling `new Raven()`.

You can optionally pre-load the `POE instance` with localizations. You'd do this if you wanted
access to the `POE.makeDictionary(language)` functionality without having to make API calls.
Refer to the [`localizations structure`](#localizationsStructure) if you want to do this.

#### Props

| Prop              | Type     | Required? | Description |
| ----------------- | :------: | :-------: | ----------- |
| **localizations** | `Object` |           | The preloaded [`localizations`](#localizationsStructure) |

#### Returns

A `POE instance` that has the following methods:

```js
POE.getLocalizations(localizations);
POE.fetchLocalizations({id, token, languages, keepAlive, url});
POE.makeDictionary(language);
POE.makeText(string, interpolations);
POE.kill();
```

#### Usage

Most common case

```js
import Raven from "raven-writer";
const POE = new Raven();
```

Optional preloading

```js
import Raven from "raven-writer";

const localizations = {
  "en-us": {
    "GREETING": "Hi!"
  }
};

const PRELOADED = new Raven(localizations);
const Translate = POE.makeDictionary("en_us");
console.log(Translate("GREETING"))
// Logs: "Hi!"
```

## <a id="fetchLocalizations"></a>`instance.fetchLocalizations({...})`

Fetches and catches localizations.

#### Props

| Prop          | Type      | Required?               | Description |
| ------------- | :-------: | :---------------------: | ----------- |
| **token**     | `String`  | if `url` is `undefined` | The readonly `api_token` found in your [POEditor acct](https://poeditor.com/account/api) |
| **id**        | `String`  | if `url` is `undefined` | The project `id` found in your [POEditor acct](https://poeditor.com/account/api) |
| **languages** | `Array` of ISO 639-1 language codes | if `url` is `undefined` | The languages you want to fetch for the given project |
| **keepAlive** | `Integer` |                         | If present the localizations will be refreshed per milliseconds defined this value |
| **url**       | `String`  | if `url`, `id`, and `languages` are `undefined` | If present calls will be made to that url instead of hitting the POEditor endpoint |

#### Returns

A `promise` that once resolved will populate the `POE instance` with localizations.

#### Usage

Most common usage

```js
import Raven from "raven-writer";
const tenMins = 1000 * 1000 * 60 * 10;
const POE = new Raven();
await POE.fetchLocalizations({
  id: "<POEDITOR_PROJECT_ID>",
  token: "<YOUR_READ_ONLY_POEDITOR_API_TOKEN>",
  languages: ["en_us", "sp_mx"],
  keepAlive: tenMins // optional
});
```

Overwriting the endpoint

```js
import Raven from "raven-writer";
const POE = new Raven();
await POE.fetchLocalizations({
  url: "<YOUR_CUSTOM_GET_ENDPOINT>"
});
``` 

<u>Note</u>: *the response from your endpoint **must** have the same structure as the [`localizations structure`](#localizationsStructure)*

## <a id="makeDictionary"></a>`instance.makeDictionary(language)`

Makes a [`Dictionary function`](#dictionary) for a given language that has already been cached in the `POE instance`

#### Props

| Prop         | Type     | Required? | Description |
| ------------ | :------: | :-------: | ----------- |
| **language** | `String` |  yes      | A ISO 639-1 language code |

#### Returns

A [`Dictionary function`](#dictionary)

#### Usage

```js
import Raven from "raven-writer";
const POE = new Raven();
await POE.fetchLocalizations({..., languages: ["en-us", "sp-mx"]});
const enUsDictionary = POE.makeDictionary("en-us");
const spMxDictionary = POE.makeDictionary("sp-mx");
```

## <a id="localizations"></a>`instance.getLocalizations(language)`

Returns the raw localizations object. see: [`localizations structure`](#localizationsStructure).

#### Props

| Prop         | Type     | Required? | Description |
| ------------ | :------: | :-------: | ----------- |
| **language** | `String` | ✅        | A ISO 639-1 language code |

#### Returns

A [`localizations object`](#localizationsStructure)

#### Usage

Assume the cached localizations are the following:

```json
{
  "en-us": {
    "GREETING": "Hello"
  },
  "sp-mx": {
    "GREETING": "Hola"
  }
}
```

```js
import Raven from "raven-writer";
const POE = new Raven();
await POE.fetchLocalizations({..., languages: ["en_us", "sp_mx"]});
console.log(POE.getLocalizations()) // Logs the preceding full object
console.log(POE.getLocalizations("sp_mx")) // Logs { GREETING: "Hola" }
```

## <a id="makeText"></a>`instance.makeText(str, interolations)`

Adds interpolations and/or Markdown transformed into HTML string to a given string. See: [`Content markdown and interpolation syntax`](#contentSyntax).

#### Props

| Prop              | Type     | Required? | Description |
| ------------------| :------: | :-------: | ----------- |
| **str**           | `String` | ✅        | Any string value, ie not a POE term |
| **interolations** | `Object` |           | An object with key names that match the dynamic content markers in the `str` |

#### Returns

A string with interpolations and Markdown transformed into HTML str (if applicable).

#### Usage

```js
import Raven from "raven-writer";
const POE = new Raven();

// Logs: "Plain text"
console.log(POE.makeText("Plain text"));

// Logs: "Hello, Nate"
console.log(POE.makeText("Hello, {{name}}", { name: "Nate" }));

// Logs: "Some <i>italic text</i>"
console.log(POE.makeText("Some *italic text*"));

// Logs: "Hello, <b>Nate</b>"
console.log(POE.makeText("Hello, **{{name}}**", { name: "Nate" }));
```

## <a id="kill"></a>`instance.kill()`

If you called `POE.fetchLocalizations({...})` and set it to refresh localizations via `keepAlive`, this stops all refreshes on that instance.

#### Returns

`undefined`

#### Usage

```js
import Raven from "raven-writer";
const tenMins = 1000 * 1000 * 60 * 10;
const POE = new Raven();
await POE.fetchLocalizations({..., keepAlive: tenMins});
...
POE.kill();
```

## <a id="contentSyntax"></a>Content markdown and interpolation syntax

`raven-writer` supports a limited subset of markdown and a simple way of adding interpolations to your content. Use this as a guide when adding content values on the POEditor dashboard

#### Supported Markdown

| Style  | Markdown | Output |
| ------ | -------- | ------ |
| **bold** | `**bold**` | `<b>world</b>` |
| *italic* | `*italic*` | `<i>italic</i>`|
| ***bold italic*** | `***bold italics***` | `<b><i>bold italic</i></b>` |
| [name](#url) | `[name](https://example.com)` | `<a href="https://example.com" target="_blank">link</a>` |

#### Interpolations

Add variables into your content by using `interpolations` object.
The keys in the `interpolations` object wrapped between `{{` and `}}` can be used to represent dynamic content.

# <a id="localizationsStructure"></a>Localizations structure

The localizations are stored as a single nested object. Top level keys are [ISO 639-1 language codes](https://en.wikipedia.org/wiki/ISO_639-1), each holding that language's localizations in key/value pairs
where the key is what POEditor refers to as the `term` and value is what POEditor refers to as the `content`. See the [POEditor API](https://poeditor.com/docs/api#terms) for more details.

Here is an example assuming 3 languages in the project with only one entry in each:

```json
{
  "en-us": {
    "GREETING": "Hello"
  },
  "en-au": {
    "GREETING": "G'day"
  },
  "sp-mx": {
    "GREETING": "Hola"
  }
}
```
