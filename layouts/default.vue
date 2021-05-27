<template>
  <b-container class="iati-viz my-4">
    <b-container>
      <b-row>
        <b-col cols="9">
          <b-navbar-brand :to="'/'">
            {{ pageTitle }}
          </b-navbar-brand>

          <p class="mt-3">
            The <a href="https://iatistandard.org/" target="_blank">International Aid Transparency Initiative (IATI)</a> is a global effort to improve the transparency of development and humanitarian resources and their results to address poverty and crises. In March 2020, the IATI Secretariat issued a <a href="https://bit.ly/2wNwAzN" target="_blank">Guidance Note</a> on how to publish data on COVID-19 using the <a href="https://iatistandard.org/en/iati-standard/" target="_blank">IATI Standard</a>. <b>This website allows you to explore, visualize, and analyze all of the published IATI data that is related to coronavirus pandemic.</b>
          </p>
        </b-col>
      </b-row>
    </b-container>
    <b-navbar toggleable="lg" type="light" variant="bg-white" class="navbar-iati">
      <b-navbar-toggle target="nav-collapse" />

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item :to="{name: 'index'}" exact-active-class="active" no-prefetch>
            Commitments and Spending
          </b-nav-item>
          <!-- <b-nav-item :to="{name: 'contributions'}" active-class="active" no-prefetch>
              Contributions
            </b-nav-item>
            <b-nav-item :to="{name: 'activities'}" active-class="active" no-prefetch>
              Activities
            </b-nav-item> -->
          <b-nav-item :to="{name: 'flows'}" active-class="active" no-prefetch>
            Financial Flows
          </b-nav-item>
        </b-navbar-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-item :to="{name: 'about'}" active-class="active" class="ml-auto" no-prefetch>
            About this Tool
          </b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <nuxt />
  </b-container>
</template>

<style lang='scss'>
.nuxt-progress {
  background-color: #CCC;
}
.settings {
  width: 300px;
}
.navbar-brand {
  color: #000;
  font-family: 'Gotham Bold', sans-serif;
  font-size: 24px;
}
.navbar-iati {
  box-shadow: inset 0px -3px 0px 0px #D8D8D8;
  margin: 26px 0 32px;
  padding: 0 27px;
  .nav-item {
    color: #888;
    font-family: 'Gotham Bold', sans-serif;
    font-size: 14px;
    .nav-link {
      padding: 8px 30px;
      &.active {
        border-bottom: 3px solid #F2645A;
        color: #F2645A;
      }
    }
  }
}
.displaySummaryControls label {
  cursor: pointer;
}
.number-value {
  text-align: right;
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
  computed: {
    pageTitle () {
      let isProd = true
      if (process.client) {
        isProd = !!(window.location.host.includes('ocha-dap'))
      }
      return (isProd) ? 'IATI COVID-19 Data Explorer' : '*STAGE* IATI COVID-19 Data Explorer'
    }
  }
}
</script>
