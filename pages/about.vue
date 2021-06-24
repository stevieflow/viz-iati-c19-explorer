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

            <p>A guiding principle for developing this tool has been to ‘hold up a mirror’ to IATI data. We present financial information as reported, without attempting any reconciliation among different publishing organisations or verification of those numbers from other sources.</p>

            <p>We apply the rules described below to determine which IATI transactions and activities are relevant to the global COVID-19 pandemic, and how we should aggregate them.</p>

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
          title: 'General methodology notes',
          value: '<h3>Source data</h3><p>We update our IATI source data from the <a href="https://d-portal.org/" target="_blank">D-Portal</a> service every 24 hours (<a href="https://github.com/OCHA-DAP/hdx-scraper-iati-viz/blob/main/config/project_configuration.yml" target="_blank">query</a>). We focus primarily on the IATI transaction level (where the financial data is), but pull default metadata from the parent activity when needed.</p><h3>Exclusions</h3><p>We do not make individual judgements about the accuracy of the financial amounts reported, only about whether the IATI is correctly formed and usable. We exclude IATI activities when they meet any of the following criteria:</p><ul><li>reporting organisation is a secondary reporter</li><li>reporting organisation is unspecified</li><li>reporting organisation is in a blocklist we maintain of those that share malformed IATI data</li><li>the activity lists related child activities</li></ul><p>We exclude any financial transactions that have a value of 0, or are not of types 1 (Incoming Funding), 2 (Outgoing Commitment), 3 (Disbursement), 4 (Expenditure), or 11 (Incoming Commitment) in the <a href="https://iatistandard.org/en/iati-standard/203/codelists/transactiontype/" target="_blank">IATI Transaction Type code list</a>. We also exclude all outgoing financial transactions (types 3 or 4) dated before 2020-01-01, since they are too early to be relevant to the pandemic.</p><h3>Currency conversion</h3><p>Unless they are already denominated in US dollars (USD), we convert all transaction values to USD before performing any other operations. We use the historical exchange rate from the value date in the IATI transaction.</p><h3>“Strict” and “loose” relevance to the COVID-19 pandemic</h3><p>When a transaction or its activity conforms to the <a href="https://iatistandard.org/en/news/updated-covid-19-guidance-iati-publishers/" target="_blank">IATI COVID-19 Guidance for IATI Publishers</a> or uses the new OECD-DAC sector code "12264", we consider it loosely relevant if the only indication is the string “COVID-19” in the activity-level description (or a similar string like “COVID” or “CORONAVIRUS”), or strictly relevant in other cases. We make the distinction because the string “COVID-19” is likely to appear in a long description for activities that are not primarily focused on the COVID-19 pandemic, so we are less confident in that activity’s relevance.</p><h3>Spending</h3><p>We do not make a distinction between disbursement and expense transactions, but treat both as “spending” for the sake of this tool.</p>'
        },
        {
          title: 'Additional notes for the Commitments and Spending tab',
          value: '<h3>Allocation of spending by sector and recipient country</h3><p>If an activity lists multiple sectors and/or recipient countries, we divide each transaction by the percentages given for both. We use the sectors and recipient countries for the transaction if provided, and otherwise default to those for the transaction\'s activity. For example, if a transaction with a value of $1,000,000 was assigned 30% to Senegal and 70% to Mali, and 50% to Health and 50% to education, we would split it into four virtual transactions:</p><ol><li>Senegal, Health: $150,000 (15%)</li><li>Senegal, Education: $150,000 (15%)</li><li>Mali, Health: $350,000 (35%)</li><li>Mali, Education: $350,000 (35%)</li></ol><p>We use OECD DAC3 and DAC5 purpose codes for our sectors, but roll them up one further level to DAC groups. See <a href="https://github.com/davidmegginson/c19-iati-data/blob/main/data/dac3-sector-map.json" target="_blank">data/dac3-sector-map.json</a> for the mappings.</p><h3>Deduplication of commitments and spending</h3><p>To avoid duplicate counting, we calculate a "net" value for new commitments and spending in each activity, as well as a "total" value for all commitments and spending. To come up with a net value, we take the following steps on relevant transactions:</p><ol><li>Start with the higher of the sum of all incoming commitments (type 11) or the sum of all incoming funding (type 1) as incoming money: if negative, use 0. We do not filter transactions by date for this step (but we do for all the others).</li><li>Add the values of all outgoing commitments (type 2) to get total commitments.</li><li>Subtract the incoming money from total commitments to get net (new) commitments (but replace a negative result with zero).</li><li>Add the values of all disbursements (type 3) and expenditures (type 4) to get total spending.</li><li>Subtract the incoming money from total spending to get net (new) spending (but replace a negative result with zero).</li></ol><h3>Total vs net money in the visualisation</h3><p>When we are filtering the data to just a single organisation, we display total commitments and total spending, because there is (or should be) no risk of duplicate counting; in every other situation, where we are potentially counting money reported by more than one organisation, we use net commitments and net spending, calculated as described above.</p><h3>Humanitarian flags</h3><p>If an activity is flagged positively as humanitarian, we use this to flag subsequent transactions.  When a transaction contains the humanitarian flag, we use this to override the activity level setting.</p>'
        },
        {
          title: 'Additional notes for the Spending Flows tab',
          value: '<h3>Monetary values for spending flows</h3><p>All values in the flows tab represent spending (disbursements and expenditures), not commitments. Because the flows tab is usually filtered by a single organisation, we report the total (not net) amounts for the organisation.</p><h3>Partner-organisation defaults</h3><p>If a transaction does not report a provider or receiver organisation (as appropriate), we default to the activity’s participating organisation with a “funding” role for an incoming transaction, or with an “implementing” role for an outgoing transaction.</p><h3>Internal transactions</h3><p>We ignore all transactions within the same organisation, when it is possible to detect them.</p><h3>Aggregation of flows</h3><p>We aggregate transactions with the same metadata (organisations, sector, recipient country, strictness, and humanitarian status) so that there is just one row for each combination.</p>'
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
