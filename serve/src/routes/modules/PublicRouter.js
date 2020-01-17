import Router from 'koa-router'

import PublicController from '../../api/PublicController'
import ContentController from '../../api/ContentController'
import userContorller from '../../api/UserController'

const router = new Router()
router.prefix('/public')
router.get('/getCaptcha', PublicController.getCaptcha)
/* !!!: 文章列表 */
router.get('/list', ContentController.getPostList)
/* !!!: 友情链接 */
router.get('/links', ContentController.getLinks)
/* !!!: 温馨提醒 */
router.get('/tips', ContentController.getTips)
/* !!!: 本周热议 */
router.get('/topWeek', ContentController.getTopWeek)
/* !!!: 确认修改邮件 */
router.get('/reset-email', userContorller.updateUsername)
export default router