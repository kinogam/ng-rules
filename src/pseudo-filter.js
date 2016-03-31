export default function pseudoFilter(pseudoStr) {
    let firstChild = pseudoStr.indexOf('first-child') !== -1,
        lastChild = pseudoStr.indexOf('last-child') !== -1,
        nthChild = pseudoStr.indexOf('nth-child') !== -1,
        reverse = pseudoStr.indexOf('not') !== -1;

    return (index, len) => {
        var result = true;

        if (firstChild) {
            result = index === 0;
        }
        else if (lastChild) {
            result = index === len -1;
        }
        else if (nthChild) {
            var content = /nth-child\(([^\)]+)\)/.exec(pseudoStr)[1];
            result = index === Number(content) - 1;
        }

        return reverse ? !result : result;
    };
}