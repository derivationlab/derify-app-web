const CracoLessPlugin = require("craco-less");
const path = require("path");
const pathResolve = pathUrl => path.join(__dirname, pathUrl)

module.exports = {
  webpack: {
    alias: {
      "@@": pathResolve("."),
      "@": pathResolve("src"),
    },
  },
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              "@primary-color": "rgba(250,226,71,1)",
              "@btn-primary-color":"rgba(0,0,0,1)",
              "@text-color": "rgba(255,255,255,0.65)",
              "@main-white": "rgba(255,255,255,0.85)",
              "@main-black": "rgba(0,0,0,1)",
              "@main-border-color":"rgba(255,255,255,0.15)",
              "@main-yellow": "rgba(250,226,71,1)",
              "@main-red": "rgba(234,68,107,1)",
              "@main-green": "rgba(0,196,154,1)",
              "@deep-green": "rgba(0, 196, 154, 100)",
              "@main-background": "rgba(20,11,50,1)",
              "@main-blue": "rgba(32, 27, 72, 100)",
              "@main-block": "rgba(32,27,72,1)",
              "@strong-text": "rgba(255, 255, 255, 85)",
              "@support-text": "rgba(255, 255, 255, 45)",
              "@disable-text": "rgba(255, 255, 255, 30)",
              "@new-theme-color": '#fff',
              "@new-linear": 'linear-gradient(90deg, #ec6989 0%, #e7446b 100%);',
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
