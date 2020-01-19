import axios from 'axios'
let get = function (url) {
  // return new Promise((resolve, reject) => {
  //   let xhr = new XMLHttpRequest()
  //   xhr.open('get', url, true)
  //   xhr.onload = function () {
  //     if (xhr.status === 200) {
  //       console.log('xhr.responseText:', xhr.responseText)
  //       resolve(JSON.parse(xhr.responseText))
  //     } else {
  //       reject(xhr)
  //     }
  //   }
  //   xhr.onerror = function (e) {
  //   //   console.error('xhr__error:', e)
  //     reject(e)
  //   }
  //   xhr.send(null)
  // })
  return axios({
    method: 'get',
    url: url,
    responseType:'json',
    // transformRequest: [function (data, headers) {
    //   // Do whatever you want to transform the data

    //   return JSON.stringify(data);
    // }],
  })
  .then(function(res) {
    console.log('outputConfig')
    console.log(res)
    return Promise.resolve(res.data);
  });
}

// export default {
//   getConfig () {
//     return get('/static/config-prod.json')
//   }
// }
export default function getConfig () {
  return get('/dist/config.json')
}
