import mongoose from '../config/DBHelpler'
import moment from 'moment'
const Schema = mongoose.Schema

const PostSchema = new Schema({
  'uid': { type: String, ref: 'users' },
  'title': { type: String },
  'content': { type: String },
  'created': { type: String },
  'catalog': { type: String },
  'fav': { type: Number },
  'isEnd': { type: String },
  'reads': { type: String },
  'answer': { type: Number },
  'status': { type: String },
  'isTop': { type: String },
  'sort': { type: String },
  'tags': { type: Array }
})

/* !!!: 保存数据时创建当前时间 */
PostSchema.pre('save', function (next) {
  this.created = moment().format('YYYY-MM-DD HH:mm:ss')
  next()
})

PostSchema.statics  = {
  /**
   * 获取文章列表数据 相当于在PostSchema的原型链上加了一个getList函数
   * @param {Object} options 筛选条件
   * @param {String} sort 排序方式
   * @param {Number} page 分页页数
   * @param {Number} limit 分页条数
   * @param {Function} find 开始查询数据
   * @param {Function} sort 查询回来的数据进行排序
   * @param {Function} skip 查询第几页的数据
   * @param {Function} limit 只允许一次查询多少条
   * @param {Function} populate 查询另一个表的数据（users表的name属性）
  */
  getList: function (options, sort, page, limit) {
    return this.find(options)
    .sort({[sort]: -1})
    .skip(page * limit)
    .limit(limit)
    .populate({
      path: 'uid',
      select: 'name pic location isVip'
    })
  },
  getTopWeek: function () {
    return this.find({
        created: {
          $gte: moment().subtract(7, 'days').format('YYYY-MM-DD HH:mm:ss')
        }
      }, {
      answer: 1,
      title: 1
    }).sort({ answer: -1 }).limit(15)
  }
}

const PostModel = mongoose.model('post', PostSchema)

export default PostModel