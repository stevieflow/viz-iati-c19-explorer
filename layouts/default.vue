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
            <b-nav-item :to="{name: 'index'}" exact-active-class="active" class="nav-index" no-prefetch @click="onClick('Commitments and Spending')">
              Commitments and Spending
            </b-nav-item>
            <b-nav-item :to="{name: 'spending_flows'}" active-class="active" class="nav-flows" no-prefetch @click="onClick('Spending Flows')">
              Spending Flows
            </b-nav-item>
          </b-navbar-nav>
          <b-navbar-nav class="ml-auto">
            <b-nav-item :to="{name: 'about'}" active-class="active" class="ml-lg-auto nav-about" no-prefetch @click="onClick('About this Dashboard')">
              About this Dashboard
            </b-nav-item>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
      <nuxt class="main-content" />

      <b-container class="footer">
        <b-row>
          <b-col cols="12">
            <a href="https://iatistandard.org/" target="_blank"><img :src="logoPath" width="130"></a>
          </b-col>
        </b-row>
      </b-container>
    </b-container>
  </div>
</template>

<style lang='scss'>
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
.main-content {
  min-height: 100vh;
}
.footer {
  padding: 80px 15px 40px;
  text-align: right;
}

@media only screen and (max-width: 992px) {
  .navbar-nav {
    text-align: center;
  }
  .navbar-collapse {
    margin-bottom: 20px;
  }
  .navbar-iati {
    box-shadow: none;
    margin: 0;
    padding: 10px;
  }
  .navbar-toggler {
    border: none;
    padding-right: 0;
    position: absolute;
    right: 0;
    top: -66px;
  }
}
</style>

<script>
import mixpanel from 'mixpanel-browser'
import config from '../nuxt.config'
export default {
  components: {
  },
  asyncData ({ app, $hello }) {
    $hello('asyncData')
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
        isProd = !!(window.location.host.includes('ocha-dap')) || !!(window.location.host.includes('humdata'))
        this.$store.commit('setProd', isProd)
      }
      return (isProd) ? 'IATI COVID-19 Funding Dashboard' : '*STAGE* IATI COVID-19 Funding Dashboard'
    },
    logoPath () {
      const filePath = (config.dev) ? '/' : '/viz-iati-c19-dashboard/'
      return filePath + 'logo-iati.png'
    }
  },
  beforeCreate () {
    const MIXPANEL_TOKEN = this.isProd ? process.env.NUXT_ENV_MIXPANEL_TOKEN_PROD : process.env.NUXT_ENV_MIXPANEL_TOKEN_DEV
    mixpanel.init(MIXPANEL_TOKEN)
  },
  mounted () {
    this.$mixpanelTrack('index')
    mixpanel.track('page view', {
      'page title': config.head.title,
      'page type': 'datavis'
    })
  },
  methods: {
    onClick (page) {
      mixpanel.track('viz interaction', {
        'page title': config.head.title,
        action: 'switch viz',
        content: config.head.title,
        'current view': page,
        'viz type': 'iati covid-19 dashboard'
      })
    }
  }
}
</script>
