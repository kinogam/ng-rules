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
        var rps_value = value.replace(/^\s+|\s+$/g, '');
        return rps_value.length <= len;
    }
};
            