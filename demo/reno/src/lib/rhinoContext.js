const rhinoContext = {
  publicPath: "contexts/coffee_maker_wasm.rhn",
  customWritePath: "3.0.0_coffee_maker_wasm.rhn",
};

(function () {
  if (typeof module !== "undefined" && typeof module.exports !== "undefined")
    module.exports = rhinoContext;
})();