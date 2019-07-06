import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import router from '@/router'
// import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000, // request timeout
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json'
  }
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    // if (store.getters.token) {
    //   // let each request carry token
    //   // ['X-Token'] is a custom headers key
    //   // please modify it according to the actual situation
    //   config.headers['X-Token'] = getToken()
    // }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// respone拦截器
service.interceptors.response.use(
  response => response,
  error => {
    // 此处catch到的是非2xx范围的返回值
    console.log('err' + error) // for debug
    if (error.response == null) {
      Message({
        message: `网络异常!!!`,
        type: 'error',
        duration: 3 * 1000
      })
      return Promise.reject(error)
    } else {
      switch (error.response.status) {
        case 401: // 未登录跳转
          MessageBox.alert(`未登录或凭证过期,请重新登陆!`, `错误`, {
            confirmButtonText: '登录',
            showCancelButton: false,
            showClose: false,
            type: 'error'
          }).then(() => {
            store.dispatch('user/resetToken')
            window.location.href = `/#/login?redirect=${window.location.href}`
            // router.push(`/login?redirect=${window.location.href}`)
            // window.location.href = `/#/login`
          })
          break
        default:
          // 其他错误
          Message({
            message: `${error.response.data.message}`,
            type: 'error',
            duration: 3 * 1000
          })
          return Promise.reject(error)
      }
    }
  }
)

export default service
