let appVersion: string | null = null;

export const getAppVersion = async (): Promise<string> => {
  if (appVersion) {
    return appVersion;
  }

  try {
    // Попробуем разные пути для загрузки версии
    const paths = [
      `${process.env.PUBLIC_URL}/VERSION`,
      '/VERSION',
      './VERSION'
    ];

    for (const path of paths) {
      try {
        const response = await fetch(path, {
          headers: {
            'Accept': 'text/plain'
          }
        });
        if (response.ok) {
          const versionText = await response.text();
          appVersion = versionText.trim();
          console.log('Version loaded successfully from:', path, appVersion);
          return appVersion;
        }
      } catch (error) {
        console.warn(`Failed to load version from ${path}:`, error);
      }
    }

    throw new Error('Failed to load version from all paths');
  } catch (error) {
    console.error('Error loading app version:', error);
    appVersion = '2.0.0'; // Fallback version
    return appVersion;
  }
};

export const getAppVersionSync = (): string => {
  return appVersion || '2.0.0';
}; 