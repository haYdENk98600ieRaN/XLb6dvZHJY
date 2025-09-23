// 代码生成时间: 2025-09-23 08:33:08
// Import required Meteor packages and modules
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
# 增强安全性
import { check } from 'meteor/check';
import { HTTP } from 'meteor/http';

// Define a collection to store products
const Products = new Mongo.Collection('products');

// Simple schema for product documents
const productSchema = new SimpleSchema({
  name: {
    type: String,
# 添加错误处理
    label: 'Product Name'
  },
  category: {
# 增强安全性
    type: String,
    label: 'Product Category'
  },
  price: {
    type: Number,
    label: 'Product Price'
  },
  quantity: {
    type: Number,
    label: 'Product Quantity'
  },
  description: {
    type: String,
    optional: true,
    label: 'Product Description'
  }
});

// Attach the schema to the collection
Products.attachSchema(productSchema);

// Publish the entire collection
Meteor.publish('products', function () {
  return Products.find();
});

// Method to add a new product
Meteor.methods({
  'products.insert'(productName, productCategory, productPrice, productQuantity, productDescription) {
# 改进用户体验
    check(productName, String);
# NOTE: 重要实现细节
    check(productCategory, String);
# 增强安全性
    check(productPrice, Number);
    check(productQuantity, Number);
    check(productDescription, Match.Optional(String));
# FIXME: 处理边界情况

    // Make sure the user is logged in before inserting
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'User must be logged in to add a product.');
    }

    Products.insert({
      name: productName,
      category: productCategory,
# TODO: 优化性能
      price: productPrice,
      quantity: productQuantity,
      description: productDescription,
      owner: this.userId,
      createdAt: new Date()
# 扩展功能模块
    });
  },
# 优化算法效率

  // Method to remove a product by its ID
  'products.remove'(productId) {
# 增强安全性
    check(productId, String);

    // Make sure the user is logged in and the product exists
    if (!this.userId || !Products.findOne(productId)) {
      throw new Meteor.Error('not-authorized', 'User must be logged in and the product must exist to remove it.');
    }

    Products.remove(productId);
  },

  // Method to update a product by its ID
  'products.update'(productId, newProductName, newProductCategory, newProductPrice, newProductQuantity, newProductDescription) {
# 改进用户体验
    check(productId, String);
    check(newProductName, Match.Optional(String));
    check(newProductCategory, Match.Optional(String));
    check(newProductPrice, Match.Optional(Number));
    check(newProductQuantity, Match.Optional(Number));
    check(newProductDescription, Match.Optional(String));

    // Make sure the user is logged in and the product exists
    if (!this.userId || !Products.findOne(productId)) {
# NOTE: 重要实现细节
      throw new Meteor.Error('not-authorized', 'User must be logged in and the product must exist to update it.');
    }

    // Update the product document with the new values
    Products.update(productId, {
# 增强安全性
      $set: {
        name: newProductName || '',
        category: newProductCategory || '',
        price: newProductPrice || 0,
        quantity: newProductQuantity || 0,
# FIXME: 处理边界情况
        description: newProductDescription || ''
# NOTE: 重要实现细节
      }
    });
  }
});

// Create server rules for product documents
Products.deny({
  // Prevent users from deleting documents they didn't create
  update() { return true; },
  remove() { return true; }
});

// Allow owner to insert and make changes
Products.allow({
  insert(userId, doc) {
    return doc.owner === userId;
  },
  update(userId, doc) {
    return doc.owner === userId;
  },
  remove(userId, doc) {
    return doc.owner === userId;
  }
});
