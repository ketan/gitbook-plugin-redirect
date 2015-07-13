module.exports = {
  hooks: {
    "page:before": function(page) {
      var path = require('path');
      var validUrl = require('valid-url');

      var re = /^!REDIRECT\s+(?:\"([^\"]+)\"|'([^']+)')\s*$/gm;

      var dir = path.dirname(page.rawPath);

      // construct path from gitbook binary to target redirect
      var makePath = function(filename) {
        return path.join(dir, filename);
      };

      var redirectPageContent = function(path){
        return '' +
          '<link rel="canonical" href="' +  path + '">\n' +
          '<meta http-equiv=refresh content="0; url=' + encodeURI(path) + '">\n' +
          '<h1>Redirecting...</h1>\n' +
          '<p>\n' +
          '  This page has moved to \n' +
          '  <a href="' + path + '">' + path +'</a>.\n' +
          '</p>\n' +
          '<p>\n' +
          '  <a href="' + path + '">Click here</a> if you are not redirected.\n' +
          '</p>\n' +
          '<script>window.location.href="' + path + '";</script>\n';
      };

      var redirect = re.exec(page.content);
      if (redirect){
        page.content = page.content.replace(re, function(match, p1, p2) {
          var path = redirect[1] || redirect[2];
          if (validUrl.isUri(path)) {
            return redirectPageContent(path);
          } else {
            return redirectPageContent(makePath(path));
          }
        });
      }

      return page;
    }
  }
};
