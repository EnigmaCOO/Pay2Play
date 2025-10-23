module.exports = {
  expo: {
    name: 'P2P Mobile',
    slug: 'p2p-mobile',
    version: '1.0.0',
    orientation: 'portrait',
    userInterfaceStyle: 'light',
    splash: {
      backgroundColor: '#1e3a5f',
      resizeMode: 'contain',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.p2p.mobile',
    },
    android: {
      adaptiveIcon: {
        backgroundColor: '#1e3a5f',
      },
      package: 'com.p2p.mobile',
    },
    web: {
      bundler: 'metro',
    },
    plugins: ['expo-router'],
    scheme: 'p2p',
    experiments: {
      typedRoutes: true,
    },
  },
};
