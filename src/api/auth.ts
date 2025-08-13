import api from './index';

export const authApi = {
    // 用户登录
    login: async () => {
        window.location.href = 'http://localhost:3000/api/auth/login';
    },
    
    // 用户注册
    register: async () => {
        return api.Post('/auth/register');
    },
    
    // 获取用户信息
    getUserInfo: async () => {
        return api.Get('/auth/user');
    },
    
    // 更新用户信息
    updateUserInfo: async () => {
        return api.Put('/auth/user');
    },
    
    // 用户登出
    logout: async () => {
        return api.Post('/auth/logout');
    }
}