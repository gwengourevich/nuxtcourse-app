import Vuex from 'vuex'
import Cookie from 'js-cookie'

const createStore = () => {
  return new Vuex.Store({
    state: {
      loadedPosts: [],
      token: null
    },
    mutations: {
      setPosts(state, posts) {
        state.loadedPosts = posts
      },
      addPost(state, post) {
        state.loadedPosts.push(post)
      },
      editPost(state, editedPost) {
        const postIndex = state.loadedPosts.findIndex(post => post.id === editedPost.id)
        state.loadedPosts[postIndex] = editedPost
      },
      setToken(state, token) {
        state.token = token
      },
      clearToken(state) {
        state.token = null
      }
    },
    actions: {
      nuxtServerInit(vuexContext, context) {
        return this.$axios
          .get(process.env.baseURL + '/posts.json')
          .then((res) => {
            const postArray = []
            for (const key in res.data) {
              postArray.push({ ...res.data[key], id: key })
            }
            vuexContext.commit('setPosts', postArray)
          })
          .catch(e => context.error(e))
      },
      setPosts(vuexContext, posts) {
        vuexContext.commit('setPosts', posts)
      },
      addPost(vuexContext, post) {
        const createdPost = {
          ...post,
          updatedDate: new Date()
        }
        return this.$axios.post(process.env.baseURL + '/posts.json?auth=' + vuexContext.state.token, createdPost)
          .then((result) => {
            vuexContext.commit('addPost', { ...createdPost, id: result.data.name })
          })
          .catch(e => console.log(e)) // do something in case of error
      },
      editPost(vuexContext, editedPost) {
        return this.$axios
          .$get(process.env.baseURL + '/posts/' + editedPost.id + '.json?auth=' + vuexContext.state.token) // name of the directory
          .then((res) => {
            vuexContext.commit('editPost', editedPost)
          })
          .catch(e => console.error(e))
      },
      authenticateUser(vuexContext, authData) {
        let authUrl = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=' + process.env.fbAPIKey
        if (!authData.isLogin) {
          authUrl = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=' + process.env.fbAPIKey
        }
        return this.$axios
          .$post(authUrl, {
            email: authData.email,
            password: authData.password,
            returnSecureToken: true
          })
          .then((result) => {
            const expirationDate = new Date().getTime() + Number.parseInt(result.expiresIn) * 1000

            vuexContext.commit('setToken', result.idToken)
            localStorage.setItem('token', result.idToken)
            localStorage.setItem('tokenExpiration', expirationDate)
            Cookie.set('jwt', result.idToken)
            Cookie.set('expirationDate', expirationDate)

            return this.$axios.$post('http://localhost:3000/api/track-data', { data: 'Authenticated' })
          })
          .catch((e) => {
            console.log(e)
          })
      },
      setLogoutTimer(vuexContext, duration) {
        setTimeout(() => {
          vuexContext.commit('clearToken')
        }, duration)
      },
      initAuth(vuexContext, req) {
        let token
        let expirationDate
        if (req) {
          if (!req.headers.cookie) {
            return
          }
          const jwtCookie = req.headers.cookie
            .split(';')
            .find(c => c.trim().startsWith('jwt='))
          if (!jwtCookie) {
            return
          }
          token = jwtCookie.split('=')[1]
          expirationDate = req.headers.cookie
            .split(';')
            .find(c => c.trim().startsWith('expirationDate='))
            .split('=')[1]
        } else {
          token = localStorage.getItem('token')
          expirationDate = localStorage.getItem('tokenExpiration')
        }
        if (new Date().getTime() > +expirationDate || !token) {
          console.log('No token or invalid token')
          vuexContext.dispatch('logout')
          return
        }
        vuexContext.commit('setToken', token)
      },
      logout(vuexContext) {
        vuexContext.commit('clearToken')
        Cookie.remove('jwt')
        Cookie.remove('expirationDate')
        if (process.client) {
          localStorage.removeItem('token')
          localStorage.removeItem('tokenExpiration')
        }
      }
    },
    getters: {
      loadedPosts(state) {
        return state.loadedPosts
      },
      isAuthenticated(state) {
        return state.token != null
      }
    }
  })
}

export default createStore
