import ng from 'angular';
import 'format-unicorn';

const SERVICE_NAME = 'taskService';
const HTTP_SCHEME = 'http';
const HTTP_HOST = '127.0.0.1';
const HTTP_PORT = 4000;


class TaskService {

  constructor($http) {
    this.$http = $http;
  }

  /**
   * Get all tasks
   * @returns {Promise<*>}
   */
  async getAll() {
    return await this.$http.get(_getURL('/api/task'));
  }

  /**
   * Retrieves a task by it's own ID
   * @param taskId
   * @returns {Promise<*>}
   */
  async get(taskId) {
    return await this.$http.get(_getURL('/api/task/{taskId}'.formatUnicorn({taskId: taskId})));
  }

  /**
   * Creates a new task
   * @param newTask
   * @returns {Promise<*>}
   */
  async create(newTask) {
    return await this.$http.post(_getURL('/api/task/'), newTask);
  }

  /**
   * Updates a task
   * @param taskId
   * @param taskData
   * @returns {Promise<*>}
   */
  async update(taskId, taskData) {
    return await this.$http.post(_getURL('/api/task/{taskId}'.formatUnicorn({taskId: taskId})), taskData);
  }

  /**
   * Deletes a task
   * @param taskId
   * @returns {Promise<*>}
   */
  async delete(taskId) {
    return await this.$http.delete(_getURL('/api/task/{taskId}'.formatUnicorn({taskId: taskId})));
  }
}

/**
 * Retrieves the full URL used by the API
 * @param methodName
 * @returns {string}
 * @private
 */
function _getURL(methodName) {
  return '{scheme}://{host}:{port}{method}'.formatUnicorn({
    scheme: HTTP_SCHEME,
    host: HTTP_HOST,
    port: HTTP_PORT,
    method: methodName
  });
}

ng.module('mainApp').service(SERVICE_NAME, ['$http', TaskService]);
