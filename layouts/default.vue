<template>
  <b-container class="iati-viz my-4">
    <b-navbar-brand :to="'/'">
      {{ pageTitle }}
    </b-navbar-brand>
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
            Flows
          </b-nav-item>
        </b-navbar-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-item :to="{name: 'about'}" active-class="active" class="ml-auto" no-prefetch>
            About the page
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
      return (isProd) ? 'COVID-19 IATI Data' : 'STAGE COVID-19 IATI Data'
    }
  }
}
</script>
