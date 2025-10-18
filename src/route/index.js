const suKien = require('./sukien');
function router(app){
    app.use('/sukien',suKien);
}
module.exports = router;