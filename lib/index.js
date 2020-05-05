var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "react"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var react_1 = __importDefault(require("react"));
    function isObjectValueEqual(a, b) {
        var A = Object.getOwnPropertyNames(a);
        var B = Object.getOwnPropertyNames(b);
        if (A.length != B.length) {
            return false;
        }
        for (var i = 0; i < A.length; i++) {
            var propName = A[i];
            var propA = a[propName];
            var propB = b[propName];
            if (typeof propA === "object") {
                var isEqual = isObjectValueEqual(propA, propB);
                return isEqual ? isEqual : false;
            }
            else if (propA !== propB) {
                return false;
            }
        }
        return true;
    }
    var Store = /** @class */ (function () {
        function Store(state) {
            var _this = this;
            this.state = state;
            this.reducers = [];
            this.dispatch = function (action, payload, forceUpdate) {
                if (forceUpdate === void 0) { forceUpdate = false; }
                for (var _i = 0, _a = _this.reducers; _i < _a.length; _i++) {
                    var reducer = _a[_i];
                    if (reducer.type === action.type) {
                        var state = reducer.update(_this.state, payload);
                        if (_this.setState) {
                            if (!forceUpdate && isObjectValueEqual(_this.state, state)) {
                                return;
                            }
                            _this.setState(state);
                        }
                    }
                }
            };
            this.useDispatch = function (action, payload) {
                return react_1.default.useCallback(function () { return _this.dispatch.bind(_this)(action, payload, false); }, [
                    _this.state,
                ]);
            };
            this.createAction = function (payload) {
                var type = Symbol();
                return {
                    type: type,
                    __TYPE: payload,
                };
            };
            this.createReducer = function (action, update) {
                if (!_this.reducers.map(function (item) { return item.type; }).includes(action.type)) {
                    _this.reducers.push({ update: update, type: action.type });
                }
            };
            this.createContext = function () {
                var _a;
                _a = react_1.default.useState(_this.state), _this.state = _a[0], _this.setState = _a[1];
                _this.context = react_1.default.createContext(_this.state);
                return {
                    Context: _this.context,
                    Consumer: _this.context.Consumer,
                    Provider: _this.context.Provider,
                    state: _this.state,
                };
            };
            this.useStore = function () {
                if (!_this || !_this.context) {
                    throw new Error("Missing this, please use \"store.useStore() \"instead of \"{ useStore }\"");
                }
                return {
                    state: react_1.default.useContext(_this.context),
                    dispatch: _this.dispatch.bind(_this),
                    useDispatch: _this.useDispatch.bind(_this),
                };
            };
        }
        return Store;
    }());
    exports.Store = Store;
    function createStore(state) {
        return new Store(state);
    }
    exports.createStore = createStore;
});
