import { Router } from 'express'; 
import ArticleController from '../controllers/article.controller.js';

const articleRoute = Router();

articleRoute.post('/create', ArticleController.articleCreateArticle);
articleRoute.post('/createaccesory', ArticleController.articleCreateAccesory);
articleRoute.post('/createservice', ArticleController.articleCreateService);
articleRoute.post('/getarticle', ArticleController.articleGetArticle);
articleRoute.post('/list', ArticleController.articleList);
articleRoute.post('/listwithprices', ArticleController.articleListWithPrices);
articleRoute.post('/changestatus', ArticleController.articleChangeStatus);
articleRoute.post('/getaccesoriesarticles', ArticleController.articleGetAccesories);
articleRoute.post('/createprizeslist', ArticleController.articleCreatePricesList);
articleRoute.post('/getprizeslist', ArticleController.articleGetPricesList);

export default articleRoute;