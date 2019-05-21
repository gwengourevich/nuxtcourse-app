<template>
  <div class="single-post-page">
    <section class="post">
      <h1 class="post-title">
        {{ loadedPost.title }}
      </h1>
      <div>
        <div class="post-details">
          Author: {{ loadedPost.author }}
        </div>
        <div class="post-details">
          Latest updated on : {{ loadedPost.updatedDate | date }}
        </div>
      </div>
      <p class="post-detail">
        {{ loadedPost.content }}
      </p>
    </section>
    <section class="post-feedback">
      <p>Comments</p>
    </section>
  </div>
</template>

<script>
export default {
  asyncData(context) {
    return context.app.$axios
      .$get(process.env.baseURL + '/posts/' + context.params.id + '.json')
      .then((data) => {
        return {
          loadedPost: data
        }
      })
      .catch(e => context.error(e))
  },
  header: {
    title: 'A blog Post asynchronous'
  }
}
</script>

<style>
  .single-post-page {
    padding: 30px;
    text-align: center;
    box-sizing: border-box;
  }

  .post {
    width: 100%;
  }

  @media (min-width: 768px) {
    .post {
      width: 600px;
      margin: auto;
    }
  }

  .post-title {
    margin: 0;
  }

  .post-details {
    padding: 10px;
    box-sizing: border-box;
    border-bottom: 3px solid #ccc;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  @media (min-width: 768px) {
    .post-details {
      flex-direction: row;
    }
  }

  .post-detail {
    color: rgb(88, 88, 88);
    margin: 0 10px;
  }

  .post-feedback a {
    color: red;
    text-decoration: none;
  }

  .post-feedback a:hover,
  .post-feedback a:active {
    color: salmon;
  }
</style>
