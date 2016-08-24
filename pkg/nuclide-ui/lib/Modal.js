Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

var _commonsNodeStream2;

function _commonsNodeStream() {
  return _commonsNodeStream2 = require('../../commons-node/stream');
}

var _atom2;

function _atom() {
  return _atom2 = require('atom');
}

var _reactForAtom2;

function _reactForAtom() {
  return _reactForAtom2 = require('react-for-atom');
}

var _rxjsBundlesRxUmdMinJs2;

function _rxjsBundlesRxUmdMinJs() {
  return _rxjsBundlesRxUmdMinJs2 = require('rxjs/bundles/Rx.umd.min.js');
}

/**
 * Shows an indefinite, animated LoadingSpinner.
 */

var Modal = (function (_React$Component) {
  _inherits(Modal, _React$Component);

  function Modal(props) {
    _classCallCheck(this, Modal);

    _get(Object.getPrototypeOf(Modal.prototype), 'constructor', this).call(this, props);
    this._handleContainerInnerElement = this._handleContainerInnerElement.bind(this);
    this._handleWindowClick = this._handleWindowClick.bind(this);
  }

  _createClass(Modal, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this._container = document.createElement('div');
      this._panel = atom.workspace.addModalPanel({ item: this._container });
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      (_reactForAtom2 || _reactForAtom()).ReactDOM.unmountComponentAtNode(this._container);
      this._panel.destroy();
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      // Do the initial render.
      this._render();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      if (prevProps.children !== this.props.children) {
        this._render();
      }
    }
  }, {
    key: '_handleWindowClick',
    value: function _handleWindowClick(event) {
      // If the user clicks outside of the modal, close it.
      if (this._innerElement && !this._innerElement.contains(event.target)) {
        this.props.onDismiss();
      }
    }

    // Since we're rendering null, we can't use `findDOMNode(this)`.
  }, {
    key: '_handleContainerInnerElement',
    value: function _handleContainerInnerElement(el) {
      var _this = this;

      if (this._cancelDisposable != null) {
        this._cancelDisposable.dispose();
      }

      this._innerElement = el;
      if (el == null) {
        return;
      }

      el.focus();
      this._cancelDisposable = new (_atom2 || _atom()).CompositeDisposable(atom.commands.add(window, 'core:cancel', function () {
        _this.props.onDismiss();
      }), new (_commonsNodeStream2 || _commonsNodeStream()).DisposableSubscription((_rxjsBundlesRxUmdMinJs2 || _rxjsBundlesRxUmdMinJs()).Observable.fromEvent(window, 'click')
      // Ignore clicks in the current tick. We don't want to capture the click that showed this
      // modal.
      .skipUntil((_rxjsBundlesRxUmdMinJs2 || _rxjsBundlesRxUmdMinJs()).Observable.interval(0).first()).subscribe(this._handleWindowClick)));
    }
  }, {
    key: '_render',
    value: function _render() {
      // Wrap the children to be sure that we have a single element. (Children can be a string, array,
      // etc.)
      var wrappedChildren = (_reactForAtom2 || _reactForAtom()).React.createElement(
        'div',
        {
          tabIndex: '0',
          ref: this._handleContainerInnerElement },
        this.props.children
      );
      (_reactForAtom2 || _reactForAtom()).ReactDOM.render(wrappedChildren, this._container);
    }
  }, {
    key: 'render',
    value: function render() {
      // Don't actually render anything here.
      return null;
    }
  }]);

  return Modal;
})((_reactForAtom2 || _reactForAtom()).React.Component);

exports.Modal = Modal;