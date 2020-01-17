import { getValue, setValue, getHValue, delValue } from '../config/RedisConfig'

// setValue('imooc', 'this is a message')

// getValue('imooc').then((res) => {
//   console.log(res)
// })

setValue('imooc3', {
  name: 'ys2',
  age: 16,
  email: '12345@qq.com'
})

getHValue('imooc3').then((res) => {
  console.log(res)
})

// delValue('imooc')