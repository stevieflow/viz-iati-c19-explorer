<template>
  <div class="about">
    <b-container>
      <b-row>
        <b-col cols="3">
          <ul class="jump-nav">
            <li>
              <nuxt-link :to="{ name: 'about', hash: '#methodology' }">
                Methodology Notes
              </nuxt-link>
            </li>
            <li>
              <nuxt-link :to="{ name: 'about', hash: '#developers' }">
                Technical Details / Resources for Developers
              </nuxt-link>
            </li>
            <li>
              <nuxt-link :to="{ name: 'about', hash: '#tos' }">
                Terms of Service / Privacy Notice
              </nuxt-link>
            </li>
            <li>
              <nuxt-link :to="{ name: 'about', hash: '#contact' }">
                Get in Touch
              </nuxt-link>
            </li>
          </ul>
        </b-col>
        <b-col cols="9">
          <section id="about" class="mb-5">
            <h2>About this Tool</h2>

            <p>The <a href="https://iatistandard.org/" target="_blank">International Aid Transparency Initiative</a> (IATI) is a global effort to improve the transparency of development and humanitarian financing to address poverty and crises. More than 1,000 donors, international and local aid organizations, governments and other stakeholders publish their data using the IATI standard.</p>

            <p>
              Following the World Health Organization’s declaration of a pandemic on 11 March 2020, the IATI Secretariat issued a <a href="https://iatistandard.org/en/news/updated-covid-19-guidance-iati-publishers/" target="_blank">Guidance Note on how to publish data on COVID-19 using the IATI Standard</a>, writing that:
            </p><blockquote>Organisations who are involved in the international effort to address the COVID-19 pandemic are strongly encouraged to publish data on all their spending and activities. By publishing timely and comprehensive data, you will be providing partners across the globe with better information to plan, coordinate and evaluate the response to the pandemic.</blockquote>
            </p>

            <p>
              <b>This tool was created to visualize, explore and analyze all of the published IATI data that is related to the coronavirus pandemic.</b> It was developed by the <a href="https://centre.humdata.org/" target="_blank">OCHA Centre for Humanitarian Data</a> with the support of the <a href="https://www.usaid.gov/" target="_blank">United States Agency for International Development</a>, and it builds on previous work by Mark Brough at <a href="https://devinit.org/" target="_blank">Development Initiatives</a>.
            </p>
          </section>

          <section id="methodology" class="mb-5">
            <h2>
              Methodology Notes
            </h2>

            <p>In building this tool, we have been guided by the goal of “holding up a mirror to IATI data”. In other words, we have tried to minimize any alterations or transformations of the raw data as it has been shared by IATI publishers. That said, some transformations and inferences are necessary in order to make sense of incomplete or incorrect data and avoid duplication. The sections below provide a detailed explanation of our methodology.</p>

            <client-only>
              <VueFaqAccordion
                class="about-faq"
                :items="faqs"
              />
            </client-only>
          </section>

          <section id="developers" class="mb-5">
            <h2>
              Technical Details / Resources for Developers
            </h2>

            <p>Everything that we have developed is shared as open source software. Data is extracted from <a href="https://d-portal.org/" target="_blank">d-portal.org</a> and transformed every 24 hours.</p>

            <p>
              For more information, view our GitHub repositories:
              <ul>
                <li><a href="https://github.com/ocha-dap/hdx-scraper-iati-viz" target="_blank">Data processing scripts</a></li>
                <li>
                  Prepared data (automatically updated every 24 hours)
                  <ul>
                    <li>Activities and transactions — <a href="https://ocha-dap.github.io/hdx-scraper-iati-viz/transactions.csv">transactions.csv</a> | <a href="https://ocha-dap.github.io/hdx-scraper-iati-viz/transactions.json">transactions.json</a></li>
                    <li>Financial flows — <a href="https://ocha-dap.github.io/hdx-scraper-iati-viz/flows.csv" target="_blank">flows.csv</a> | <a href="https://ocha-dap.github.io/hdx-scraper-iati-viz/flows.json">flows.json</a></li>
                  </ul>
                </li>
                <li><a href="https://github.com/OCHA-DAP/viz-iati-c19-explorer">Data visualization front end</a> (in Vue.js)</li>
              </ul>
            </p>
          </section>

          <section id="tos" class="mb-5">
            <h2>
              Terms of Service / Privacy Notice
            </h2>

            <p>The <a href="https://data.humdata.org/" target="_blank">Humanitarian Data Exchange</a> (HDX) <a href="https://data.humdata.org/about/terms" target="_blank">Terms of Service</a> govern your use of this website.</p>
          </section>

          <section id="contact" class="mb-5">
            <h2>
              Get in Touch
            </h2>

            <p>If you have any further questions or comments, please get in touch with us at <a href="mailto:centrehumdata@un.org">centrehumdata@un.org</a>.</p>
          </section>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<style lang='scss'>
.about {
  h2 {
    font-family: 'Gotham Bold', sans-serif;
    font-size: 18px;
    color: #007CE0;
  }
}
.jump-nav {
  list-style: none;
  position: sticky;
  top: 0;
  li {
    padding: 3px 0;
  }
  a {
    color: #333;
    letter-spacing: 0.01em;
    font-family: 'Gotham Book', sans-serif;
    font-size: 14px;
    line-height: 18px;
    padding: 0;
    &:hover {
      color: #007CE0;
      text-decoration: none;
    }
  }
}
.faq {
  &.about-faq {
    padding: 0 !important;
    .accordion {
      border: 0;
    }
    .accordion__item {
      border-bottom: 1px solid #CCC;
      &:hover {
        background-color: #EDF6FD;
      }
    }
    .accordion__title {
      color: #000;
      font-family: 'Source Sans Pro', sans-serif;
      font-weight: 400;
      font-size: 18px;
      letter-spacing: 0.01em;
      line-height: 24px;
      padding: 27px 10px;
      &:hover {
        color: #000;
      }
    }
    .accordion__toggle-button {
      display: none;
    }
  }
}
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
import VueFaqAccordion from 'vue-faq-accordion'
import config from '../nuxt.config'
export default {
  components: {
    VueFaqAccordion
  },
  data () {
    return {
      title: config.head.title,
      faqs: [
        {
          title: 'How we obtain the data used in this visualization',
          value: 'Coming soon'
        },
        {
          title: 'How we transform the data used in this visualization',
          value: 'Coming soon'
        },
        {
          title: 'Additional notes on the Commitments and Spending tab',
          value: 'Coming soon'
        },
        {
          title: 'Additional notes on the Spending Flows tab',
          value: 'Coming soon'
        }
      ]
    }
  },
  head () {
    return {
      title: config.head.title + ': About this Tool'
    }
  }
}
</script>
