import ng from 'angular';

const DIRECTIVE_NAME = 'ngFocusOn';

ng.module('mainApp').directive(DIRECTIVE_NAME, [_fn]);

function _fn() {

  function _linkFn($sc, $element, $attr) {
    $sc.$on('ngFocusOn', ($event, name) => {
      if(name == $sc.$eval($attr[DIRECTIVE_NAME])) {
        $element[0].focus();
      }
    });
  }

  return {
    restrict: 'A',
    link: _linkFn
  };
}