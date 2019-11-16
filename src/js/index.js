require('hash-change').on('change', function (hash) {
    console.log('Goto page: ' + hash);
});