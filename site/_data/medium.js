var axios  = require('axios');
var toJSON = require('xml2js').parseString;

var url = 'http://ftr.fivefilters.org/makefulltextfeed.php?use_extracted_title=1&url=createfeed.fivefilters.org%2Fmergefeeds.php%3Furl%3Dhttps%253A%252F%252Fwww.ukrinform.ua%252Frss%252Fblock-lastnews';

module.exports = () => {
  return new Promise((resolve, reject) => {
    axios.get(url)
      .then((response) => {
        // turn the feed XML into JSON
        toJSON(response.data, function (err, result) {
          // create a path for each item based on Medium's guid URL
          result.rss.channel[0].item.forEach(element => {
            var url = element.link[0].split('/');
            element.path = url[url.length-1].split('?')[0];
          });
          resolve({'url': url, 'posts': result.rss.channel[0].item});
        });
      })
      .catch((error) => {
        reject(error);
      });
  });
};
