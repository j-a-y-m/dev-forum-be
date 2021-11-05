
module.exports.sliceFbErrCode = (code) =>{
    return code.slice(code.indexOf('/')+1).replace(/-/g,' ')
    // .replaceAll('-',' ')
}