import ng from 'angular';

const DIRECTIVE_NAME = 'taskImportance';

ng.module('mainApp').directive(DIRECTIVE_NAME, [_fn]);

const IMPORTANCE_CLASSES = [
  'bg-info',
  'bg-warning',
  'bg-danger'
];


function _fn() {

  function _linkFn($sc, $element, $attr) {

    $sc.$watch($attr[DIRECTIVE_NAME], (newValue) => {

      for(let importanceClass of IMPORTANCE_CLASSES) {
        $element.removeClass(importanceClass);
      }

      let value = parseInt(newValue);

      if(!isNaN(value) && newValue >= 0 && newValue < IMPORTANCE_CLASSES.length) {
        $element.addClass(IMPORTANCE_CLASSES[newValue]);
      }

    });
  }

  return {
    restrict: 'A',
    link: _linkFn
  };
}