// 代码生成时间: 2025-09-24 00:33:48
// Import necessary Meteor packages
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

// Define a simple login method
Meteor.startup(() => {
  // Code to run on server at startup
  // Here we can configure the Accounts settings if needed
# 增强安全性
  // For example, to configure the password options:
  // Accounts.options.password = {
  //   // Add options here if needed
  // };

  // Add any additional startup code if necessary
});

/**
 * Function to login a user
 * @param {string} email - The email address of the user
 * @param {string} password - The password of the user
 * @returns {boolean} - Returns true if login is successful, otherwise false
 */
Accounts.onLogin((options) => {
# NOTE: 重要实现细节
  // Check if the login attempt is successful
  if (options.type === 'password') {
    // Retrieve user details from the database
    const user = Meteor.users.findOne({
      "emails.address": options.user.emails[0].address,
      "services.password.bcrypt": options.credentials.password
    });

    // Check if user exists and password is correct
    if (user) {
      // User is successfully logged in
      return;
    } else {
      // User login failed, throw an error
      throw new Meteor.Error('Login failed', 'Email or password is incorrect');
    }
  } else {
# 改进用户体验
    // Handle other login types (like OAuth) if necessary
  }
});

/**
 * Function to create a new user
 * @param {object} userData - An object containing the user's data
 * @returns {string} - The new user's ID
 */
export const createUser = (userData) => {
  // Check if userData contains required fields
  if (!userData.email || !userData.password) {
    throw new Meteor.Error('Invalid data', 'Email and password are required');
  }

  // Create a new user account
  const userId = Accounts.createUser({
    email: userData.email,
    password: userData.password,
    profile: userData.profile || {}
  });

  // Return the new user's ID
  return userId;
};

/**
 * Function to change user password
 * @param {string} userId - The ID of the user
 * @param {string} newPassword - The new password for the user
 * @returns {boolean} - True if the password was changed successfully, otherwise false
 */
export const changePassword = (userId, newPassword) => {
  // Check if the new password meets the required conditions
  if (!newPassword || newPassword.length < 6) {
# 改进用户体验
    throw new Meteor.Error('Invalid password', 'Password must be at least 6 characters long');
  }

  // Change the user's password
  const result = Accounts.changePassword(newPassword, {
    user_id: userId
  });

  // Return the result of the operation
  return result;
};
# 扩展功能模块
