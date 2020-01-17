import User from './test'

const user = {
  name: 'sss',
  age: 30,
  email: 'sss@qq.com'
}

/* !!!: 增 */
const add = async () => {
  const data = new User(user)
  const result = await data.save()
  console.log(result)
}
// add()

/* !!!: 查 */
const check = async () => {
  const result = await User.find()
  console.log(result)
}
// check()

/* !!!: 改 */
const update = async () => {
  const result = await User.updateOne({name: 'sss'}, {
    email: '123@qq.com'
  })
  console.log(result)
}
// update()

/* !!!: 删 */
const deletes = async () => {
  const result = await User.deleteOne({name: 'sss'})
  console.log(result)
}
deletes()