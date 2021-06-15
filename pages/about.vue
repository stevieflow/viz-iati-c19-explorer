<template lang="md">
<br><br>
<div class="text-center">[coming soon]</div>

</template>
<style>
.logos-section {
  padding: 25px 15px;
  background-color: #007bff;
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
