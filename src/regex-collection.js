export default {
    'required': (value) => {
        return !(angular.isUndefined(value) || value === null || /^\s*$/.test(value));
    },
    'number': (value) => {
        return /^-?\d+(?:\.\d+)?$/.test(value);
    },
    'email': (value) => {
        return /^(\w+|\.+)((-\w+|\.+)|(\.+\w+))*\@\w+((\.|-)\w+)*\.\w+/.test(value);
    },
    'maxLen': (value, len) => {
        let str = String(value),
            rps_value = str.replace(/^\s+|\s+$/g, '');
        return rps_value.length <= len;
    },
    'eq': (orginVal, compareVal) => {
        return  angular.equals(orginVal, compareVal);
    }
};
            