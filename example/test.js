const { autoCompleteGenFunc } = requier('../index.js');
 
function *gen() {
    yield 1;
}
const getData = () => {
    return autoCompleteGenFunc(gen);
}
console.log(getData)