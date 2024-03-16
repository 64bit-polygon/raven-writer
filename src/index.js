import { Raven } from "./RavenWriter/index.js";
const id = "689264";
const token = "4a32be4cf1cd3460299ec4f06f4c6c23";
const POE = new Raven();
async function setUp() {
  await POE.fetchLocalizations({id, token, languages: ["en-us", "en-gb"], keepAlive: 1000});
  const enUs = POE.makeDictionary("en-us");
  console.log(enUs("MY_FIRST_KEY"))
  setTimeout(() => {
    console.log(enUs("MY_FIRST_KEY"))
  }, 4000);
}
setUp();