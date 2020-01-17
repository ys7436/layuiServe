import Post from '../model/Post'
import Links from './../model/Links';
class ContentController {
  async getPostList (ctx) {
    const body = ctx.request.query
    /* !!!: 测试数据 */
    // const post = new Post({
    //   'title': 'is a title',
    //   'content': 'test content',
    //   'catalog': 'advise',
    //   'fav': 20,
    //   'isEnd': '0',
    //   'reads': '0',
    //   'answer': '0',
    //   'status': '0',
    //   'isTop': '0',
    //   'sort': '0',
    //   'tags': []
    // })
    // const tmp = await post.save()
    // console.log(tmp)
    const sort = body.sort ? body.sort : 'created'
    const page = body.page ? parseInt(body.page) : 0
    const limit = body.limit ? parseInt(body.limit) : 20
    const options = {}
    if (typeof body.catalog !== 'undefined' && body.catalog !== '') {
      options.catalog = body.catalog
    }
    if (typeof body.isTop !== 'undefined') {
      options.isTop = body.isTop
    }
    if (typeof body.status !== 'undefined' && body.status !== '') {
      options.isEnd = body.status
    }
    if (typeof body.tag !== 'undefined' && body.tag !== '') {
      /* !!!: 此处注意，这样可以查询嵌套属性 直接查询数组 */
      options.tags = { $elemMatch: { name: body.tag } }
    }
    const result = await Post.getList(options, sort, page, limit)
    ctx.body = {
      code: 200,
      data: result,
      msg: '获取文章列表成功'
    }
  }
  /* !!!: 查询友情链接 */
  async getLinks (ctx) {
    const result = await Links.find({ type: 'links' })
    ctx.body = {
      code: 200,
      data: result,
      msg: '获取友情链接成功'
    }
  }
  /* !!!: 查询温馨提醒 */
  async getTips (ctx) {
    const result = await Links.find({ type: 'tips' })
    ctx.body = {
      code: 200,
      data: result,
      msg: '获取温馨提醒成功'
    }
  }
  /* !!!: 查询本周热议 */
  async getTopWeek (ctx) {
    const result = await Post.getTopWeek()
    ctx.body = {
      code: 200,
      data: result,
      msg: '获取本周热议成功'
    }
  }
}

export default new ContentController()