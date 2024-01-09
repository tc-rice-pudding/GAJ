function _type(value) {
    return Object.prototype.toString.call(value);
}

/**
 * 支持所有类型的深拷贝
 * @param {*} obj
 * @returns
 */
export function deepClone(obj) {
    if (obj === null) return null;

    if (typeof obj !== 'object') return obj;

    if (_type(obj) === '[object RegExp]') return new RegExp(obj);

    if (_type(obj) === '[object Date]') return new Date(obj);

    let newObj = new obj.constructor();
    for (let key in obj) {
        // if (!obj.hasOwnProperty(key)) break;
        newObj[key] = deepClone(obj[key]);
    }
    return newObj;
}