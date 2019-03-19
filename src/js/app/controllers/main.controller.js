import ng from 'angular';
import uuid from 'uuid/v4';

const CONTROLLER_NAME = 'mainApp.mainController';

ng.module('mainApp').controller(CONTROLLER_NAME, ['$scope', 'task.service', '$timeout',  _fn]);

function _fn($sc, $taskService, $timeout) {

  let _data = {
    tasks: null,
    $$state: {
      loading: false
    }
  };

  _init();

  /**
   * When task is done changed...
   * @param task
   */
  $sc.onChange_taskIsDone = function(task) {
    $taskService.update(task.id, {
      isDone: task.isDone == 'true' ? 'true': 'false'
    });
  };

  /**
   * When the task title changes
   * @param task
   */
  $sc.onChange_taskTitle = function(task) {
    task.$$edit.has_error = false;
  };

  /**
   * On keydown on task title
   * @param $event
   * @param task
   */
  $sc.onKeydown_taskTitle = function($event, task) {

    if($event.keyCode === 13) {
      if(task.$$state.isNew) {
        _task_createNew(task);
      }
      else {
        _task_storeChanges(task);

      }
    }

    if($event.keyCode === 27) {
      _task_cancelEdit(task);
    }
  };

  /**
   * When user clicks on add a new task
   */
  $sc.onClick_addNewTask = function() {

    //First of all, close all other tasks to being edited
    _data.tasks.forEach(_task_cancelEdit);

    let _task = _createNewTask();
    _task.$$state.onEditMode = true;

    //Add task to list
    _data.tasks.push(_task);

    //Focus it's input
    $timeout(() => {
      $sc.$broadcast('ngFocusOn', 'task-' + _task.id);
    });

  };

  /**
   * When user attempts to start editing a task
   * @param task
   */
  $sc.onClick_editTask = function($event, task) {
    $event.stopPropagation();
    $event.preventDefault();

    if(!task.id) { return; }

    _task_startEdit(task);

    //Focus it's input
    $timeout(() => {
      $sc.$broadcast('ngFocusOn', 'task-' + task.id);
    });
  };

  /**
   * When user attempts to remove a task
   * @param task
   */
  $sc.onClick_removeTask = function($event, task) {
    $event.stopPropagation();
    $event.preventDefault();
    let _idx = _data.tasks.indexOf(task);

    _data.tasks.splice(_idx, 1);

    $taskService.delete(task.id);
  };

  /**
   * When user cancels editing a task
   * @param task
   */
  $sc.onClick_cancelEditTask = function($event, task) {
    $event.stopPropagation();
    $event.preventDefault();
    _task_cancelEdit(task);
  };

  /**
   * When user attempts to confirm a task
   * @param $event
   * @param task
   */
  $sc.onClick_confirmEditTask = function($event, task) {
    $event.stopPropagation();
    $event.preventDefault();

    if(task.$$state.isNew) {
      _task_createNew(task);
    }
    else {
      _task_storeChanges(task);
    }
  };

  function _init() {
    $sc._NAME = CONTROLLER_NAME;
    $sc.data = _data;

    _data.$$state.loading = true;

    $taskService.getAll().then(responseData => {
      _data.$$state.loading = false;
      _data.tasks = responseData.data.map(_convertTask);
    }).catch(error => {

    });
  }

  /**
   * Creates a new task
   * @returns {{$$edit: {importance: number, title: string, error: null}, importance: number, $$state: {onEditMode: boolean, isNew: boolean}, id: null, title: string, isDone: string}}
   * @private
   */
  function _createNewTask() {
    return {
      id: uuid(),
      importance: 0,
      isDone: 'false',
      title: '',
      $$edit: {
        title: '',
        importance: '0',
        has_error: null
      },
      $$state: {
        onEditMode: false,
        isNew: true
      }
    }
  }

  /**
   * Conerts a task
   * @param task
   * @returns {{$$edit: {importance: number, title: string, error: null}, importance: (*|number|Tasks.importance|{allowNull, type}), $$state: {onEditMode: boolean, isNew: boolean}, id: *, title: *, isDone: (string|string|Tasks.isDone|{allowNull, type})}}
   * @private
   */
  function _convertTask(task) {
    return {
      id: task.id,
      importance: task.importance,
      isDone: task.isDone,
      title: task.title,
      $$edit: {
        title: '',
        importance: 0,
        has_error: null
      },
      $$state: {
        onEditMode: false,
        isNew: false
      }
    }
  }

  /**
   * Start to edit a task
   * @param task
   * @private
   */
  function _task_startEdit(task) {

    //First of all, close all other tasks to being edited
    _data.tasks.forEach(_task_cancelEdit);

    task.$$edit.title = task.title;
    task.$$edit.importance = task.importance.toString();
    task.$$state.onEditMode = true;
  }

  /**
   * Stop editing a task
   * @param task
   * @private
   */
  function _task_cancelEdit(task) {

    task.$$state.onEditMode = false;

    if(task.$$state.isNew) {
      let _idx = _data.tasks.indexOf(task);
      _data.tasks.splice(_idx, 1);
    }

  }

  /**
   * When want's to create new task
   * @param task
   * @private
   */
  function _task_createNew(task) {

    task.$$edit.has_error = false;

    if(task.$$edit.title == null || task.$$edit.title.trim().length === 0) {
      task.$$edit.has_error = true;
      return;
    }

    task.importance = parseInt(task.$$edit.importance);
    task.title = task.$$edit.title;

    task.$$state.onEditMode = false;
    task.$$state.isNew = false;

    task.id = null;

    $taskService.create({
      title: task.title,
      importance: task.importance
    }).then(function(responseData) {
      task.id = responseData.data.id;
    });
  }

  /**
   * Store task changes
   * @param task
   * @private
   */
  function _task_storeChanges(task) {

    task.$$edit.has_error = false;

    if(task.$$edit.title == null || task.$$edit.title.trim().length === 0) {
      task.$$edit.has_error = true;
      return;
    }

    task.importance = parseInt(task.$$edit.importance);
    task.title = task.$$edit.title;

    task.$$state.onEditMode = false;

    $taskService.update(task.id, {
      title: task.title,
      importance: task.importance
    });
  }

}