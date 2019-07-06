import request from '@/utils/request'

// export function login(data) {
//   return request({
//     url: '/user/login',
//     method: 'post',
//     data
//   })
// }

export function login (data) {
  return request({
    url: '/login',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    // transformRequest: [
    //   function(data) {
    //     let ret = ''
    //     for (const it in data) {
    //       ret +=
    //         encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
    //     }

    //     return ret.substr(0, ret.length - 1)
    //   }
    // ],
    // data
    params: data
  })
}

export function logout () {
  return request({
    url: '/logout',
    method: 'post'
  })
}
