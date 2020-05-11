
### Investigations Staging Status

[![Investigations Staging Status](https://api.netlify.com/api/v1/badges/f394d51d-9375-44a9-bb2e-39a671d37944/deploy-status)](https://app.netlify.com/sites/investigations/deploys)


### Exploding Stars Status

[![Exploding Stars Status](https://api.netlify.com/api/v1/badges/eff06c2a-4dac-4fe2-9e95-85b83cec506b/deploy-status)](https://app.netlify.com/sites/explodingstars/deploys)


### Expanding Universe Status

[![Expanding Universe Status](https://api.netlify.com/api/v1/badges/c6475c2b-ccca-4deb-a15d-741e74c53b8c/deploy-status)](https://app.netlify.com/sites/expandinguniverse/deploys)


### Observable Universe Status

[![Observable Universe Status](https://api.netlify.com/api/v1/badges/a765afa3-2f20-41ab-a723-7065ad075bd5/deploy-status)](https://app.netlify.com/sites/observableuniverse/deploys)


### Surveying the Solar System Status

[![Surveying the Solar System Status](https://api.netlify.com/api/v1/badges/8108e715-5050-47ef-b127-6ede62fb0477/deploy-status)](https://app.netlify.com/sites/surveyingthesolarsystem/deploys)


### Hazardous Asteroids Status

[![Hazardous Asteroids Status](https://api.netlify.com/api/v1/badges/19861625-40ab-44c8-8da0-a51f94878957/deploy-status)](https://app.netlify.com/sites/hazardousasteroids/deploys)


# Getting Started

We use `nodenv` to manage node versions, as such the target node version can be found in the `.node-version` file in the root of the project.

`yarn` is our package manager of choice but if you use `npm` you should be able to foloow these instructions with minimal changes.

---

Get the repo: `git clone https://github.com/lsst-epo/investigation-static.git`

Go to the repo: `cd investigation-static`

Install dependencies: `yarn`

Start the dev server: `yarn start`

Build the app: `yarn build`

Netlify build script: `yarn deploy`

---

Unit testing: `yarn test`

Watch tests: `yarn watch-test`

Lint JS: `yarn format`

Lint Styles: `yarn styles`

Clear built assets/cache: `yarn clean`

---

By default this app builds and serves all pages for all available investigations (currently all defined locally).

To only build/serve one investigation:

Create `.env.development` file in the project root

Add `env` variable to `.env.development`: `INVESTIGATION = 'investigation-name'` where `investigation-name` is one of any of the investigation ids found in `src/data/investigations/investigations.json`
