// Entry point for iisnode on Azure App Service.
// iisnode requires the handler at the wwwroot level;
// this simply delegates to the real Express server in dist/.
require('./dist/app.js');
