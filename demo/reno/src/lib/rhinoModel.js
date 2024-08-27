const rhinoModel = {
  publicPath: "models/rhino_params.pv",
  customWritePath: "3.0.0_rhino_params.pv",
};

(function () {
  if (typeof module !== "undefined" && typeof module.exports !== "undefined")
    module.exports = rhinoModel;
})();