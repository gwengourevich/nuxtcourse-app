<template>
  <div>
    <TheAdminHeader />
    <nuxt />
  </div>
</template>

<script>
import TheAdminHeader from '@/components/Navigation/TheAdminHeader'
export default {
  components: {
    TheAdminHeader
  },
  middleware: ['checkAuth', 'auth']
}
</script>
