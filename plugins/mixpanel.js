import mixpanel from 'mixpanel-browser'
import config from '../nuxt.config'
export default ({ app }, inject) => {
  // Inject $hello(msg) in Vue, context and store.
  inject('mixpanelTrack', (view) => {
    console.log('mixpanelTrack', config.head.title, view, config.env.baseUrl)
    mixpanel.track('viz interaction test', {
      'page title': config.head.title,
      action: 'switch viz',
      content: config.head.title,
      'current view': view,
      'viz type': 'iati covid-19 dashboard'
    })
  })
}
