import { Router } from 'express'; 
import ArticleController from '../controllers/article.controller.js';

const articleRoute = Router();

articleRoute.post('/create', ArticleController.articleCreateArticle);
articleRoute.post('/createaccesory', ArticleController.articleCreateAccesory);
articleRoute.post('/createservice', ArticleController.articleCreateService);
articleRoute.post('/getarticle', ArticleController.articleGetArticle);
articleRoute.get('/list', ArticleController.articleList);
articleRoute.post('/changestatus', ArticleController.articleChangeStatus);
articleRoute.post('/getaccesoriesarticles', ArticleController.articleGetAccesories);

export default articleRoute;