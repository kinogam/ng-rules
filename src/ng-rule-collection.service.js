export default {
    'required': (value) => {
        return !(value === undefined || /^\s*$/.test(value));
    },
    'number': (value) => {
        return /^-?\d+(?:\.\d+)?$/.test(value);
    }
};
            