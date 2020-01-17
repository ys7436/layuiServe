import SignRecord from './../model/SignRecorrd'
import { getJWTPayload } from '../common/Utils'
import User from '../model/User'
import moment from 'moment'
import send from './../config/MailConfig'
import uuid from 'uuid/v4'
import jwt from 'jsonwebtoken'
import { setValue } from '@/config/RedisConfig'
import * as config from '../config'
import { getValue } from '../config/RedisConfig'
class UserController {
  /* !!!: 用户签到接口 */
  async userSign (ctx) {
    /* !!!: 取到ID */
    const obj = await getJWTPayload(ctx.header.authorization)
    /* !!!: 查询上一次签到记录 */
    const record = await SignRecord.findByUid(obj._id)
    const user = await User.findById(obj._id)
    let newRecord = {}
    let result = {}
    /* !!!: 判断签到逻辑 */
    if (record !== null) {
      /* !!!: 有历史数据 */
      /* !!!: 判断用户用户签到记录时间 */
      if (moment().format('YYYY-MM-DD') ===
      moment(record.created).format('YYYY-MM-DD')) {
        /* !!!: 日期如果相等说明今天已经签到 */
        ctx.body = {
          code: 500,
          msg: '您今日已签到',
          favs: user.favs,
          count: user.count,
          lastSign: record.created
        }
        return
      } else {
        /* !!!: 日期如果不相等说明是在连续签到 */
        let count = user.count
        let fav = 0
        /* !!!: 判断连续签到了多少天 */
        if (moment(record.created).format('YYYY-MM-DD') ===
        moment().subtract(1, 'days').format('YYYY-MM-DD')) {
          /* !!!: 如果用户上一次签到的时间是昨天 说明他在连续签到 */
          /* !!!: 判断天数 */
          count += 1
          if (count < 5) {
            fav = 5
          } else if (count >=5 && count < 15) {
            fav = 10
          } else if (count >=15 && count < 30) {
            fav = 15
          } else if (count >=30 && count < 100) {
            fav = 20
          } else if (count >=100 && count < 365) {
            fav = 30
          } else if (count >=365) {
            fav = 50
          }
          await User.updateOne({
            _id: obj._id
          }, {
            $inc: { favs: fav, count: 1 }
          })
          result = {
            favs: user.favs + fav,
            count: user.count + 1
          }
        } else {
          /* !!!: 用户中断了签到 */
          fav = 5
          await User.updateOne({
            _id: obj._id
          }, {
            $set: { count: 1 },
            $inc: { favs: fav }
          })
          result = {
            favs: user.favs + fav,
            count: 1
          }
        }
        /* !!!: 保存用户签到记录 */
        newRecord = new SignRecord({
          uid: obj._id,
          favs: fav
        })
        await newRecord.save()
      }
    } else {
      /* !!!: 无签到数据 第一次签到 */
      /* !!!: 保存用户签到数据 + 积分数据 */
      await User.updateOne({
        _id: obj._id
      }, {
        $set: { count: 1 },
        $inc: { favs: 5 }
      })
      /* !!!: 保存用户签到记录 */
      newRecord = new SignRecord({
        uid: obj._id,
        favs: 5
      })
      await newRecord.save()
      result = {
        favs: user.favs + 5,
        count: 1
      }
    }
    ctx.body = {
      code: 200,
      ...result,
      msg: '接口请求成功',
      lastSign: newRecord.created
    }
  }
  /* !!!: 更新用户基本信息接口 */
  async updateUserInfo (ctx) {
    debugger
    const { body } = ctx.request
    let msg = ''
    /* !!!: 判断token是否过期 */
    const obj = await getJWTPayload(ctx.header.authorization)
    /* !!!: 判断用户是否修改了邮箱 */
    const user = await User.findOne({_id: obj._id})
    if (body.username && body.username !== user.username) {
      /* !!!: 判断修改的用户名是否已经存在数据库中 */
      const tmpUser = await User.findOne({username: body.username})
      if (tmpUser && tmpUser.password) {
        ctx.body = {
          code: 501,
          msg: '此邮箱已经被注册'
        }
        return
      }
      /* !!!: 用户修改了邮箱 */
      const key = uuid()
      await setValue(key, jwt.sign(
        { _id: obj._id }, 
        config.JWT_SECRET,
        {expiresIn: '1h'}
      ))
      await send({
        type: 'email',
        code: '',
        data: {
          username: body.username,
          key: key,
        },
        expire: moment()
          .add(60, 'minutes')
          .format('YYYY-MM-DD HH:mm:ss'),
        // email: user.username,
        email: '1509425462@qq.com',
        user: user.name
      })
      msg = '更新基本资料成功，账号修改需要邮件确认'
      // ctx.body = {
      //   code: 200,
      //   msg: '发送邮件成功',
      //   data: result
      // }
      /* !!!: 发送邮件 */
    }
    const arr = ['username', 'mobile', 'password']
    arr.map(item => {delete body[item]})
    const result = await User.update({_id: obj._id}, body)
    if (result.n === 1 && result.ok === 1) {
      ctx.body = {
        code: 200,
        msg: msg = '' ? '更新成功' : msg
      }
    } else {
      ctx.body = {
        code: 500,
        msg: '更新失败'
      }
    }
  }
  /* !!!: 更新用户名 */
  async updateUsername (ctx) {
    const body = ctx.query
    debugger
    if (body.key) {
      const token = await getValue(body.key)
      const obj = getJWTPayload('Bearer ' + token)
      await User.updateOne({ _id: obj._id }, {
        username: body.username
      })
      ctx.body = {
        code: 200,
        msg: '更新用户名成功'
      }
    }
  }
}

export default new UserController()