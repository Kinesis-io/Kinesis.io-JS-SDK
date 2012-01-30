var exports;

exports.Port = 8000;
exports.env  = process.env.NODE_ENV == undefined ? 'development' : process.env.NODE_ENV;

if (exports.env == 'production') {
  
} else if (exports.env == 'staging') {
  
}

console.log("Loading \"" + exports.env + "\" environment at port: " + exports.Port);