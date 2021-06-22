<template lang="md">

## About this Tool

The <a href="https://iatistandard.org/" target="_blank">International Aid Transparency Initiative</a> (IATI) is a global effort to improve the transparency of development and humanitarian financing to address poverty and crises. More than 1,000 donors, international and local aid organizations, governments and other stakeholders publish their data using the IATI standard.

Following the World Health Organization’s declaration of a pandemic on 11 March 2020, the IATI Secretariat issued a <a href="https://iatistandard.org/en/news/updated-covid-19-guidance-iati-publishers/" target="_blank">Guidance Note on how to publish data on COVID-19 using the IATI Standard</a>, writing that:

>Organisations who are involved in the international effort to address the COVID-19 pandemic are strongly encouraged to publish data on all their spending and activities. By publishing timely and comprehensive data, you will be providing partners across the globe with better information to plan, coordinate and evaluate the response to the pandemic.

**This tool was created to visualize, explore and analyze all of the published IATI data that is related to the coronavirus pandemic.** It was developed by the <a href="https://centre.humdata.org/" target="_blank">OCHA Centre for Humanitarian Data</a> with the support of the <a href="https://www.usaid.gov/" target="_blank">United States Agency for International Development</a>, and it builds on previous work by Mark Brough at <a href="https://devinit.org/" target="_blank">Development Initiatives</a>.

---

### Methodology Notes

In building this tool, we have been guided by the goal of “holding up a mirror to IATI data”. In other words, we have tried to minimize any alterations or transformations of the raw data as it has been shared by IATI publishers. That said, some transformations and inferences are necessary in order to make sense of incomplete or incorrect data and avoid duplication. The sections below provide a detailed explanation of our methodology.

##### How we obtain the data used in this visualization

Coming soon.

##### How we transform the data used in this visualization

Coming soon.

##### Additional notes on the Commitments and Spending tab

Coming soon.

##### Additional notes on the Financial Flows tab

Coming soon.

---

### Technical Details / Resources for Developers

Everything that we have developed is shared as open source software. The <nuxt-link :to="{name: 'index'}" no-prefetch>Commitments and Spending</nuxt-link> and <nuxt-link :to="{name: 'financial_flows'}" no-prefetch>Financial Flows</nuxt-link> tabs were built using <a href="https://vuejs.org/" target="_blank">Vue.js</a> and are hosted as a static site on <a href="https://github.com/" target="_blank">GitHub</a>. Data is extracted from <a href="http://d-portal.org/" target="_blank">d-portal.org</a>, reprocessed, and condensed every night using scripts written in <a href="https://www.python.org/" target="_blank">Python</a> and run on <a href="https://travis-ci.org/" target="_blank">Travis</a>.

For more information, view our GitHub repositories for the:
* <a href="https://github.com/OCHA-DAP/covid19-data" target="_blank">Data processing scripts</a> (in Python)
* <a href="https://github.com/OCHA-DAP/covid19-data/tree/gh-pages" target="_blank">Reprocessed data</a> (automatically generated every 24 hours)
* <a href="https://github.com/OCHA-DAP/viz-iati-c19-explorer" target="_blank">Data visualization front end</a> (in Vue.js)

---

### Terms of Service / Privacy Notice

The <a href="https://data.humdata.org/" target="_blank">Humanitarian Data Exchange</a> (HDX) <a href="https://data.humdata.org/about/terms" target="_blank">Terms of Service</a> govern your use of this website.

---

### Get in Touch

If you have any further questions or comments, please get in touch with us at <a href="mailto:centrehumdata@un.org">centrehumdata@un.org</a>.

</template>
<style>
.logos-section {
  padding: 25px 15px;
  background-color: #007bff;
}
blockquote {
  font-style: italic;
  margin-left: 30px;
}
</style>
<script>
import config from '../nuxt.config'
export default {
  components: {
  },
  data () {
    return {
      title: config.head.title
    }
  },
  head () {
    return {
      title: config.head.title + ': About this Tool'
    }
  }
}
</script>
