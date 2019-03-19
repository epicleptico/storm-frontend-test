import ng from 'angular';

const CONTROLLER_NAME = 'mainApp.mainController';

ng.module('mainApp').controller(CONTROLLER_NAME, ['$rootScope', _fn]);

function _fn($rs) {

  _init();

  function _init() {
    $rs._NAME = CONTROLLER_NAME;
  }
}