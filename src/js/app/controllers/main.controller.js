import ng from 'angular';

const CONTROLLER_NAME = 'mainApp.mainController';

ng.module('mainApp').controller(CONTROLLER_NAME, ['$scope', 'task.service',  _fn]);

function _fn($sc, $taskService) {

  let _data = {
    tasks: null,
    $$state: {
      loading: false
    }
  };

  _init();

  function _init() {
    $sc._NAME = CONTROLLER_NAME;
    $sc.data = _data;

    _data.$$state.loading = true;

    $taskService.getAll().then(responseData => {
      _data.$$state.loading = false;
      _data.tasks = responseData.data;
    }).catch(error => {

    });

  }
}