//生成验证码的依赖
import svgCaptcha from 'svg-captcha'
import { getValue, setValue, getHValue, delValue } from '@/config/RedisConfig'

class PublicController {
  constructor() {}
  async getCaptcha(ctx) {
    const body = ctx.request.query
    
    //生成svg返回到前端
    const newCaptcha = svgCaptcha.create({
      size: 4,
      ignoreChars: '0O1il',
      color: true,
      noise: Math.floor(Math.random() * 5),
      width: 150,
      height: 38,
      fontSize: 37
    })
    //保存图片验证码的超时时间10分钟 单位秒
    setValue(body.sid,newCaptcha.text, 10  * 60)
    ctx.body = {
      code: 200,
      data: newCaptcha.data
    }
  }
}

export default new PublicController()