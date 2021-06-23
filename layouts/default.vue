<template>
  <div class="iati-viz my-4">
    <b-container>
      <b-navbar-brand :to="'/'">
        <span v-html="pageTitle" />
      </b-navbar-brand>
      <b-navbar toggleable="lg" type="light" variant="bg-white" class="navbar-iati">
        <b-navbar-toggle target="nav-collapse" />

        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav>
            <b-nav-item :to="{name: 'index'}" exact-active-class="active" class="nav-index" no-prefetch>
              Commitments and Spending
            </b-nav-item>
            <b-nav-item :to="{name: 'financial_flows'}" active-class="active" class="nav-flows" no-prefetch>
              Financial Flows
            </b-nav-item>
          </b-navbar-nav>
          <b-navbar-nav class="ml-auto">
            <b-nav-item :to="{name: 'about'}" active-class="active" class="ml-auto nav-about" no-prefetch>
              About this Tool
            </b-nav-item>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </b-container>
    <nuxt />
  </div>
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
  line-height: 28px;
  white-space: normal;
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
sup {
  font-size: 11px;
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
        this.$store.commit('setProd', isProd)
      }
      return (isProd) ? 'IATI COVID-19 Data Explorer <sup>ALPHA</sup>' : '*STAGE* IATI COVID-19 Data Explorer <sup>ALPHA</sup>'
    }
  }
}
</script>
