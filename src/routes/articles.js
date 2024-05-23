import { Router } from 'express'; 
import ArticleController from '../controllers/article.controller.js';

const articleRoute = Router();

articleRoute.post('/create', ArticleController.articleCreateArticle);
articleRoute.post('/getarticle', ArticleController.articleGetArticle);
articleRoute.get('/list', ArticleController.articleList);
articleRoute.post('/changestatus', ArticleController.articleChangeStatus);

export default articleRoute;