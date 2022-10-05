const deepMapObject = (data, callback) => {
  const mapper = (value, key) => {
    if (value !== undefined && value !== null && typeof value === 'object') {
      callback(value, key);
    }

    if (value === undefined || value === null) {
    } else if (value.constructor === Object) {
      for (const k in value) {
        mapper(value[k], k);
      }
    } else if (value.constructor === Array) {
      for (let i = 0; i < value.length; i++) {
        mapper(value[i], i);
      }
    }
  };

  mapper(data, undefined);

  return data;
};

export default deepMapObject;
