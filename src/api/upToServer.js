import axios from 'axios'

const c2 = axios.create({
    baseURL: `/upFile`
})

export function up2Serv(query) {
    return c2({
      url: '/files',
      method: 'post',
      data: query
    }).then(res => res.data)
}

export default c2