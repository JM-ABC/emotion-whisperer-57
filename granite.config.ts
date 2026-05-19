const config = {
  brand: {
    // Use a Korean app name for review consistency; change if you prefer
    displayName: '코어 메모리',
    primaryColor: '#3182F6',
  },
  navigationBar: {
    withBackButton: true,
    withHomeButton: true,
    // Example accessory button (mono-tone icon) - remove or change if undesired
    initialAccessoryButton: {
      id: 'home',
      title: '홈',
      icon: { name: 'icon-home-mono' },
    },
  },
};

export default config;
