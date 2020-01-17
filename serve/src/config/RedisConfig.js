import redis from 'redis' //需要全局安装redis npm install -S redis
import { promisifyAll } from 'bluebird'
import * as config from './index'

const options = {
  host: config.REDIS.host,
  port: config.REDIS.port,
  detect_buffers: true,
  //这一大串直接复制官方配置
  retry_strategy: function (options) {
    if (options.error && options.error.code === 'ECONNREFUSED') {
        // End reconnecting on a specific error and flush all commands with
        // a individual error
        return new Error('The server refused the connection');
    }
    if (options.total_retry_time > 1000 * 60 * 60) {
        // End reconnecting after a specific timeout and flush all commands
        // with a individual error
        return new Error('Retry time exhausted');
    }
    if (options.attempt > 10) {
        // End reconnecting with built in error
        return undefined;
    }
    // reconnect after
    return Math.min(options.attempt * 100, 3000);
  }
}

// const client = redis.createClient(options)
const client = promisifyAll(redis.createClient(options))

//连接出错 打印日志
client.on('error', (err) => {
  console.log('redis error:', err)
})

const setValue = (key, value, time = 3600) => {
  debugger
  if(typeof value === 'undefined' || value == null || value === '') {
    return
  }
  if(typeof value === 'string') {
    if(typeof time !== 'undefined') {
      client.set(key, value, 'EX', time)
    }
  }
  if(typeof value === 'object') {
    //{k1: 1, k2: 2}
    //Object.keys(value)=>[k1, k2]
    //client.hset(key, k1, 1, redis.print)
    Object.keys(value).forEach((item) => {
      client.hset(key, item, value[item], redis.print)
    })
  }
}

//官方的使用方法
// import { promisify } from 'utils'
// const getAsync = promisify(client.get).bind(client)

const getValue = (key) => {
  return client.getAsync(key)
}

const getHValue = (key) => {
  // return promisify(client.hgetall).bind(client)(key)
  return client.hgetallAsync(key)
}

const delValue = (key) => {
  client.del(key, (err, res) => {
    if(res === 1) {
      console.log('删除成功！！！')
    } else {
      console.log('删除失败！！！')
    }
  })
}

export {
  client,
  setValue,
  getValue,
  getHValue,
  delValue
}