export const pick = (keys: string[]) => (props: {[key: string]: any}): {[key: string]: any} => (
  keys.reduce((acc, key) => {
    if (props[key] !== undefined) {
      acc[key] = props[key];
    }

    return acc;
  }, {})
);
