import Articles from '../dao/handleArticles.js';
import { handleResponse } from './answer.controller.js';

const instanceOfArticles = new Articles();

const articleCreateArticle = async (req, res) => {
    handleResponse(instanceOfArticles.createArticle(req.body), res);
};

const articleCreateAccesory = async (req, res) => {
    handleResponse(instanceOfArticles.createAccesory(req.body), res);
};

const articleCreateService = async (req, res) => {
    handleResponse(instanceOfArticles.createService(req.body), res);
};

const articleGetArticle = async (req, res) => {
    handleResponse(instanceOfArticles.getArticle(req.body), res);
};

const articleList = async (req, res) => {
    handleResponse(instanceOfArticles.listArticle(req.body), res);
};

const articleListWithPrices = async (req, res) => {
    handleResponse(instanceOfArticles.listArticleWithPrices(req.body), res);
};

const articleChangeStatus = async (req, res) => {
    handleResponse(instanceOfArticles.changeStatusArticule(req.body), res);
}

const articleGetAccesories = async (req, res) => {
    handleResponse(instanceOfArticles.getAccesoriesArticles(req.body), res);
}

export default {
    articleCreateArticle,
    articleGetArticle,
    articleList,
    articleChangeStatus,
    articleCreateAccesory,
    articleCreateService,
    articleGetAccesories,
    articleListWithPrices
}