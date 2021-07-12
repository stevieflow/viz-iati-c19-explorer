# Covid-19 visualisation

A simple visualisation using published IATI data on Covid-19.

Data is generated nightly by the [OCHA-DAP/hdx-scraper-iati-viz](https://github.com/ocha-dap/hdx-scraper-iati-viz) repository.

## Build Setup

``` bash
# install dependencies
$ npm i

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, checkout [Nuxt.js docs](https://nuxtjs.org).

## Generate a Github Pages static site and push to Github

```bash
$ npm run generate
$ npm run deploy
```

## Linting

Note that linting is enabled, and will automatically fix a number of issues in your code. However, sometimes this can feel a bit aggressive or annoying while you are working through something, so if you want to disable linting, you can comment out the 3 indicated lines in `nuxt.config.js`.

You can manage linting rules in `.eslintrc.js`. I disabled a few rules but you may have other preferences.

## Overview

There are three "tabs" in the visualisation: Commmitments/Spending; Spending Flows; About. Each of these tabs is accessible from the top navigation bar. The navigation bar is found in `default.vue`.

### Commmitments/Spending (`pages/index.vue`)



### Spending Flows (`pages/spending_flows.vue`)



### About (`pages/about.vue`)

The About tab contains a description and background of the visualisation. It describes data sources and provides some high-level technical details.

## Tooltips

Tooltips can be used throughout the site to provide more information where required.

* Tooltips should be saved as a CSV file, with a unique `key` column and a `tooltip` column. You might want to namespace the `key` column (e.g. prefix all existing tooltips with `activities_table__`)
* Tooltips are loaded when `activities.vue` loads and stored in the Vuex store. This means they are available to all other parts of the visualisation through `this.$store.state.tooltips` - for the example below, the value of this is assigned to the computed property `tooltips`.
* You can add a tooltip wherever you want using something like the following code:
```
<b-badge
  v-b-tooltip.hover
  variant="secondary"
  pill
  :title="tooltips['theTooltipKey']">
  ?
</b-badge>
```

You can easily load tooltips in any tab by adding relevant functionality within the `loadData()` method of each tab. Alternatively, you could consider moving this retrieval to the Vuex store and call it from within the [nuxtServerInit](https://nuxtjs.org/docs/2.x/directory-structure/store#the-nuxtserverinit-action) action, though this is a bit fiddly.

