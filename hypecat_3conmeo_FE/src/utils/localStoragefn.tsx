export const localStorageFunc = {
  setLocalStorage: async (key: string, data: string) => {
    try {
      localStorage.setItem(key, data);
      return true;
    } catch (error) {
      console.error(
        `Error setting data in localStorage for key "${key}":`,
        error
      );
      return false;
    }
  },
  getLocalStorage: async (key: string) => {
    try {
      localStorage.getItem(key);
      return true;
    } catch (error) {
      console.error(
        `Error setting data in localStorage for key "${key}":`,
        error
      );
      return false;
    }
  },
  removeLocalStorage: async (key: string) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(
        `Error setting data in localStorage for key "${key}":`,
        error
      );
      return false;
    }
  },
  clearLocalStorage: async () => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error(`Error clear: `, error);
      return false;
    }
  },
};
