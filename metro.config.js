const blacklist = require('metro-config/src/defaults/blacklist');
const { getDefaultConfig, mergeConfig } = require("metro-config");

const svgConfig = (async () => {
  const { resolver: { sourceExts, assetExts } } = await getDefaultConfig();
  return {
    transformer: {
      babelTransformerPath: require.resolve("react-native-svg-transformer")
    },
    resolver: {
      assetExts: assetExts.filter(ext => ext !== "svg"),
      sourceExts: [...sourceExts, "svg"]
    }
  };
})();

const customConfig = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
  resolver: {
    blacklistRE: blacklist([/ios\/Pods\/.*/])
  }
};

module.exports = mergeConfig(svgConfig, customConfig);