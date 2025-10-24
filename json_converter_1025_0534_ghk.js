// 代码生成时间: 2025-10-25 05:34:41
// 引入Meteor核心包
import { Meteor } from 'meteor/meteor';

// 创建一个转换服务
class JsonConverter {
  // 将JSON字符串转换为对象
  static parseJsonString(jsonString) {
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      throw new Error('Invalid JSON string: ' + error.message);
    }
  }

  // 将对象转换为JSON字符串
  static serializeObject(object) {
    try {
      return JSON.stringify(object);
    } catch (error) {
      throw new Error('Cannot serialize object: ' + error.message);
    }
  }
}

// 导出转换服务
export { JsonConverter };

// 示例用法
Meteor.startup(() => {
  try {
    const jsonStr = '{"name":"John", "age":30}';
    const obj = JsonConverter.parseJsonString(jsonStr);
    console.log('Parsed Object:', obj);

    const serializedStr = JsonConverter.serializeObject(obj);
    console.log('Serialized String:', serializedStr);
  } catch (error) {
    console.error('Error:', error.message);
  }
});