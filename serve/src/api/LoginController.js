import send from '../config/MailConfig'
import moment from 'moment'
//用来鉴权签名
import jsonwebtoken from 'jsonwebtoken'
import * as config from '../config/index'

//用来判断code是否已经过期
import { checkCode } from '../common/Utils'

//用来比对用户名密码
import User from '../model/User'
import { getValue } from '@/config/RedisConfig'

//密码加盐加密处理
import bcrypt from 'bcryptjs'
import SignRecord from './../model/SignRecorrd'
class LoginController {
  constructor () {}
  async forget(ctx) {
    const { body } = ctx.request
    try {
      let result = await send({
        code: '1234',
        expire: moment()
          .add(30, 'minutes')
          .format('YYYY-MM-DD HH:mm:ss'),
        email: body.username,
        user: 'YS'
      })
      ctx.body = {
        code: 200,
        data: result,
        msg: '邮件发送成功'
      }
    } catch(e) {
      console.log(e)
    }
  }
  async login (ctx) {
    const { body } = ctx.request
    let sid = body.sid
    let code = body.code
    //接收用户数据
    //验证验证码正确性时效性
    //验证账户密码是否正确
    //返回token 有两种设置过期时间的方法
    // let token = jsonwebtoken.sign(
    //   {_id: 'ys', exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24},
    //   config.JWT_SECRET
    // )
    //验证验证码是否正确
    let checkCodeResult = await checkCode(sid, code)
    if (checkCodeResult) {
      // 验证用户名密码
      // console.log('ok ok ok!!!')
      // mongoDB查库比对
      let checkUserPassword = false
      let user = await User.findOne({username: body.username})
      if (await bcrypt.compare(body.password, user.password)) {
        checkUserPassword = true
      }
      if (checkUserPassword) {
        //验证通过，返回token
        let token = jsonwebtoken.sign(
          {
            _id: user._id,
            username: body.username,
            code: body.code
          },
          config.JWT_SECRET,
          { expiresIn: '1d' }
        )
        const userObj = user.toJSON()
        const delArr = ['password', 'username', 'roles']
        delArr.map((item) => {
          delete userObj[item]
        })
        // 加入isSign属性，判断用户今日是否已经签到
        const signRecord = await SignRecord.findByUid(userObj._id)
        if (signRecord !== null) {
          if (moment(signRecord.created).format('YYYY-MM-DD') ===
          moment().format('YYYY-MM-DD')) {
            userObj.isSign = true
          } else {
            userObj.isSign = false
          }
          userObj.lastSign = signRecord.created
        } else {
          // 用户今日没有签到
          userObj.isSign = false
        }
        ctx.body = {
          code: 200,
          token: token,
          data: userObj
        }
      } else {
        //用户名密码错误
        ctx.body = {
          code: 404,
          msg: '用户名或者密码错误'
        }
      }
    } else{
      ctx.body = {
        code: 401,
        msg: '图片验证码不正确'
      }
    }
  }
  async reg (ctx) {
    //接收客户端数据
    const { body } = ctx.request
    //校验验证码
    let sid = body.sid
    let code = body.code
    let msg = {}
    let result = await getValue(sid, code)
    let check = true
    if (result) {
      //查库 查看username是否被注册
      let user1 = await User.findOne({username: body.username})
      if(user1 !== null && typeof user1.username !== 'undefined') {
        msg.email12 = ['此邮箱已经被注册，可以通过此邮箱找回密码']
        check = false
      }
      //查库 查看name是否被注册
      let user2 = await User.findOne({name: body.name})
      if(user2 !== null && typeof user2.username !== 'undefined') {
        msg.name = ['此昵称已经被注册，请修改']
        check = false
      }
      //写入数据到数据库
      if(check) {
        body.password = await bcrypt.hash(body.password, 5)
        let user = new User({
          username: body.username,
          name: body.name,
          password: body.password,
          created: moment().format('YYYY-MM-DD HH:mm:ss')
        })
        let result =  await user.save()
        ctx.body = {
          code: 200,
          data: result,
          msg: '注册成功'
        }
        return
      }
    } else {
      msg.code = ['验证码已经失效，请重新获取']
    }
    ctx.body = {
      code: 500,
      msg: msg
    }
  }
}

export default new LoginController()