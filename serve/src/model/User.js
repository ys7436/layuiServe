import mongoose from '../config/DBHelpler'
import moment from 'moment'
const Schema = mongoose.Schema
/**
 * @param {*} unique 唯一索引，向数据库插入数据时会进行判断这个username是否已经存在
 * @param {*} sparse 检索判断，如果这个username不存在，那么这条数据不会被检索
 * @param {*} match 正则表达式，插入数据时会进行判断，否则不会手机号被插入数据库
*/
const UserSchema = new Schema({
  username: { type: String, index: { unique: true }, sparse: true },
  password: { type: String },
  name: { type: String },
  created: { type: Date },
  updated: { type: Date },
  favs: { type: Number, default: 100 },
  gender: { type: String, default: '' },
  roles: { type: Array, default: ['user'] },
  pic: { type: String, default: '/images/police_ca.png' },
  mobile: { type: String, match: /^1[3-9](\d{9})$/, default: '' },
  status: { type: String, default: '0' },
  regmark: { type: String, default: '' },
  location: { type: String, default: '' },
  isVip: { type: String, default: '0' },
  count: { type: Number, default: 0 }
})

UserSchema.pre('save', function (next) {
  this.created = moment().format('YYYY-MM-DD HH:mm:ss')
  next()
})

UserSchema.pre('update', function (next) {
  this.updated = moment().format('YYYY-MM-DD HH:mm:ss')
  next()
})

UserSchema.post('save', function (err, doc, next) {
  /* !!!: 保存数据到数据库时进行username是否唯一判断 */
  if (err.name === 'MongoError' && err.code === 11000) {
    next(new Error('登录用户名已经存在'))
  } else {
    next(err)
  }
})

UserSchema.statics = {
  findById: function (id) {
    return this.findOne({ _id: id }, {
      /* !!!: 哪些数据不需要显示 */
      password: 0,
      username: 0,
      mobile: 0
    })
  }
}

const UserModel = mongoose.model('users', UserSchema)

export default UserModel