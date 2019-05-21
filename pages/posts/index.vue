<template>
  <div class="posts-page">
    <h1>Latest posts</h1>
    <PostList :posts="loadedPosts" />
  </div>
</template>

<script>
export default {
  // middleware: 'log',
  computed: {
    loadedPosts() {
      return this.$store.getters.loadedPosts
    }
  }
}
</script>

<style scoped>
.posts-page {
  width: 90%;
  margin: 0 auto;
}
</style>
