import Users from '../dao/handlerUser.js';
import { handleResponse } from './answer.controller.js';

const instanceOfUsers = new Users();

export const userRegister = async (req, res) => {
    handleResponse(instanceOfUsers.createUser(req.body), res);
};

export const userShowUsers = async (req, res) => {
    handleResponse(instanceOfUsers.showUsers(), res);
};

export const userShowOneUser = async (req, res) => {
    handleResponse(instanceOfUsers.showOneUser(req.body), res);
};

export const showListTypeUsers = async (req, res)=>{
    handleResponse(instanceOfUsers.showListTypeUsers(), res);
};

export const userRegisterTypeUser = async (req, res) => {
    handleResponse(instanceOfUsers.createTypeUser(req.body), res);
}

export const userShowOneTypeUser = async (req, res) => {
    handleResponse(instanceOfUsers.showOneTypeUser(req.body), res);
}

export const userSwitchState = async (req, res) => {
    handleResponse(instanceOfUsers.userState(req.body), res);
}

export const userSwitchStateTypeUser = async (req, res) => {
    handleResponse(instanceOfUsers.userTypeState(req.body), res);
}

