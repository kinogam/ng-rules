export default function pseudoFilter(pseudoStr) {
    let firstChild = pseudoStr.indexOf('first-child') !== -1,
        nthChild = pseudoStr.indexOf('nth-child') !== -1,
        reverse = pseudoStr.indexOf('not') !== -1;

    return (index) => {
        var result = true;

        if(firstChild){
            result = index === 0;
        }
        else if(nthChild){
            var content = /nth-child\(([^\)]+)\)/.exec(pseudoStr)[1];
            result = index === Number(content);
        }

        return reverse? !result : result;
    };
}