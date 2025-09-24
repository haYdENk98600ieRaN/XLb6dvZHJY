// 代码生成时间: 2025-09-24 08:49:14
// 测试数据生成器
// 用于创建测试数据

import { Random } from 'meteor/random';

// 生成随机字符串
function generateRandomString(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

// 生成随机邮箱地址
function generateRandomEmail() {
    return `${generateRandomString(10)}@example.com`;
}

// 生成随机数字
function generateRandomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 生成随机日期
function generateRandomDate() {
    let start = new Date(1900, 0, 1);
    let end = new Date(2023, 11, 31);
    let date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return date.toISOString().split('T')[0];  // 仅返回日期部分
}

// 生成随机用户数据
function generateRandomUserData() {
    try {
        // 使用 try-catch 块进行错误处理
        return {
            id: Random.id(),
            name: generateRandomString(10),
            email: generateRandomEmail(),
            age: generateRandomNumber(18, 100),
            birthDate: generateRandomDate()
        };
    } catch (error) {
        console.error("Error generating random user data: ", error);
        throw error;
    }
}

// 主函数，生成并打印一定数量的测试数据
function generateTestData(count) {
    const testData = [];
    for (let i = 0; i < count; i++) {
        const userData = generateRandomUserData();
        testData.push(userData);
    }
    return testData;
}

// 导出模块
export { generateTestData };
