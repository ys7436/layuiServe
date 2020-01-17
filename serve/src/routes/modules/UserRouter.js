import Router from 'koa-router'
import UserController from '../../api/UserController'

const router = new Router()
router.prefix('/user')

/* !!!: 友情链接 */
router.get('/fav', UserController.userSign)
/* !!!: 更新用户基本信息 */
router.post('/basic', UserController.updateUserInfo)

export default router