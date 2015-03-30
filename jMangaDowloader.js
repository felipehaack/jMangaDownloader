
var casper = require('casper').create({
    verbose: false,
    logLevel: "debug",
    pageSettings: {
        loadImages: true,
        loadPlugins: true,
        webSecurityEnabled: false
    }
});

var jMangaDownloader = {
    alerts: {
        urlManga: 'Manga url isn\'t a string!',
        urlMangaExist: 'Manga url is wrong: ',
        serverChoose: 'Theres any server with this name: ',
        isManga: 'It isn\'t a Manga!',
        english: 'There\'s any chapter in english for download!',
        loadedBatoto: 'Batoto - All chapters was loaded with success!',
        loadedMangaReader: 'Manga Reader - All chapters was loaded with success!',
        totalChapters: 'Total of the chapters: ',
        downloadingPage: 'Downloading page ',
        done: 'Finally done :)'
    },
    struct: {
        batoto: {
            manga: {
                url: '',
                chapters: {
                    label: 1,
                    urls: new Array(),
                    limit: {
                        start: 0,
                        end: 0
                    }
                }
            }
        },
        mangareader: {
            manga: {
                url: '',
                chapters: {
                    label: 1,
                    urls: new Array(),
                    limit: {
                        start: 0,
                        end: 0
                    }
                }
            }
        }
    },
    utils: {
        waitFor: {
            callback: '',
            inExecuting: false,
            callbacks: new Array(),
            execute: function (callback) {

                if (typeof callback === 'function')
                    this.callbacks.push(callback);

                if (this.inExecuting === false) {

                    this.inExecuting = true;
                    this.callbacks[0]();
                }
            },
            release: function () {

                this.callbacks.shift();
                this.inExecuting = false;

                if (this.callbacks.length > 0){

                    console.log('');
                    this.execute();
                }else {
                    if (typeof this.callback === 'function') {

                        this.callback();
                        this.callback = '';
                    } else {

                        console.log(jMangaDownloader.alerts.done);
                        casper.exit();
                    }
                }
            }
        },
        limitChapters: function (obj) {

            if (obj.limit.start > 0 || obj.limit.end > 0) {

                --obj.limit.start;
                --obj.limit.end;

                if(obj.limit.start < 0)
                    obj.limit.start = 0;
                
                if(obj.limit.end < 0)
                    obj.limit.end = obj.urls.length - 1;

                if (obj.limit.start <= obj.limit.end) {

                    if (obj.limit.end <= obj.urls.length - 1) {

                        var newUrls = new Array();
                        for (var i = obj.limit.start; i < obj.limit.end; ++i)
                            newUrls.push(obj.urls[i]);

                        obj.urls = newUrls;
                    }
                }
            }
        }
    },
    pages: {
        utils: {
            batoto: {
                get: {
                    totalPages: function () {

                        return document.getElementById('page_select').getElementsByTagName('option').length;
                    },
                    urlPage: function (url, index) {

                        return  url + '/' + index;
                    },
                    urlImage: function () {

                        return document.getElementById("full_image").getElementsByTagName('img')[0].src;
                    }
                }
            },
            mangareader: {
                get: {
                    totalPages: function () {

                        return document.getElementById('selectpage').getElementsByTagName('select')[0].getElementsByTagName('option').length;
                    },
                    urlPage: function (url, index) {

                        url = url.replace('http://', '');
                        url = url.replace('https://', '');

                        var tr = url.indexOf('/');
                        tr = url.indexOf('/', tr + 1);

                        var pos;
                        for (pos = tr; pos > 0; --pos)
                            if (url[pos] === '-')
                                break;

                        return  'http://' + url.substring(0, pos + 1) + index + url.substring(tr, url.length);
                    },
                    urlImage: function () {

                        return document.getElementById("imgholder").getElementsByTagName('a')[0].getElementsByTagName('img')[0].src;
                    }
                }
            }
        },
        start: function (obj) {

            casper.start(obj.url, function () {

                obj.totalPages = this.evaluate(obj.utils.get.totalPages);
                if (obj.totalPages !== null){

                    console.log('');
                    console.log(obj.server.toUpperCase() + ' - Downloading Chapter: ' + obj.chapter);

                    casper.then(function(){
                        
                        jMangaDownloader.pages.then(obj);
                    });
                }else{

                    casper.then(function(){

                        jMangaDownloader.pages.start(obj);
                    });
                }
            });

            casper.run();
        },
        then: function (obj) {

            if (obj.index <= obj.totalPages) {

                casper.thenOpen(obj.utils.get.urlPage(obj.url, obj.index), function () {

                    var url = this.evaluate(obj.utils.get.urlImage);

                    if (url !== null) {
                        
                        var timestamp = new Date().getTime();

                        console.log(jMangaDownloader.alerts.downloadingPage + obj.index + ' of ' + obj.totalPages);
                        this.download(url, obj.server + '.' + obj.enumerator + '.png', 'GET');
                        
                        var timestamp2 = new Date().getTime();
                        if(timestamp2 - timestamp > 500){
                            
                            ++obj.index;
                            ++obj.enumerator;

                            console.log('Total time: ' + (timestamp2 - timestamp));
                        }

                        this.clear();
                    }else
                        console.log('error doenload then open...');

                    casper.then(function(){

                        jMangaDownloader.pages.then(obj);
                    });
                });
            } else{

                casper.then(function(){

                    jMangaDownloader.pages.choose(obj);
                });
            }
        },
        choose: function (obj) {

            var hasObj = false;

            for (var server in jMangaDownloader.struct) {

                if (jMangaDownloader.struct[server].manga.chapters.urls.length > 0) {

                    hasObj = true;

                    if (typeof obj !== 'undefined') {

                        obj.index = 1;
                        obj.chapter += 1;
                        obj.url = jMangaDownloader.struct[server].manga.chapters.urls.shift();

                        if (obj.server !== server) {

                            obj.chapter = 1;
                            obj.enumerator = jMangaDownloader.struct[server].manga.chapters.label;
                            obj.server = server;
                            obj.utils = jMangaDownloader.pages.utils[server];
                        }

                        jMangaDownloader.pages.start(obj);
                    } else {

                        var objStart = {
                            index: 1,
                            chapter: 1,
                            totalPages: 0,
                            enumerator: jMangaDownloader.struct[server].manga.chapters.label,
                            server: server,
                            utils: jMangaDownloader.pages.utils[server],
                            url: jMangaDownloader.struct[server].manga.chapters.urls.shift()
                        };

                        jMangaDownloader.pages.start(objStart);
                    }

                    break;
                }
            }

            if (!hasObj) {

                console.log(jMangaDownloader.alerts.done);
                casper.exit();
            }
        },
        init: function () {

            jMangaDownloader.pages.choose();
        }
    },
    chapters: {
        batoto: {
            utils: {
                isExpand: function () {

                    return typeof document.getElementsByClassName('chapter_row_expand')[0] !== 'undefined' ? true : false;
                },
                isManga: function () {

                    var tds = document.getElementsByTagName('td');

                    for (var i = 0; i < tds.length; ++i)
                        if (tds[i].innerHTML === 'Type:')
                            break;

                    if (tds[i + 1].innerHTML.indexOf('Manga') > -1)
                        return true;

                    return false;
                },
                getChapters: function () {

                    var chapters = document.getElementsByClassName('row lang_English chapter_row');

                    if (typeof chapters !== 'undefined') {

                        var urls = new Array();

                        for (var i = (chapters.length - 1); i >= 0; --i)
                            urls.push(chapters[i].getElementsByTagName('td')[0].getElementsByTagName('a')[0].href);

                        return urls;
                    } else
                        return [];
                }
            },
            start: function () {

                casper.start(jMangaDownloader.struct.batoto.manga.url, function () {

                    if (this.evaluate(jMangaDownloader.chapters.batoto.utils.isManga)) {

                        if (this.evaluate(jMangaDownloader.chapters.batoto.utils.isExpand))
                            this.click('.chapter_row_expand');

                        jMangaDownloader.struct.batoto.manga.chapters.urls = this.evaluate(jMangaDownloader.chapters.batoto.utils.getChapters);

                        if (jMangaDownloader.struct.batoto.manga.chapters.urls.length > 0)
                            jMangaDownloader.utils.limitChapters(jMangaDownloader.struct.batoto.manga.chapters);
                        else
                            console.log(jMangaDownloader.alerts.english);
                    } else
                        console.log(jMangaDownloader.alerts.isManga);
                });

                casper.run(function () {

                    console.log(jMangaDownloader.alerts.loadedBatoto);
                    console.log(jMangaDownloader.alerts.totalChapters + jMangaDownloader.struct.batoto.manga.chapters.urls.length);

                    jMangaDownloader.utils.waitFor.release();
                });
            },
            init: function () {

                jMangaDownloader.chapters.batoto.start();
            }
        },
        mangareader: {
            utils: {
                isManga: function () {

                    return document.getElementById('mangaproperties').getElementsByTagName('h1')[0].innerHTML.indexOf('Manga') > -1 ? true : false;
                },
                getChapters: function () {

                    var chapters = document.getElementById('chapterlist').getElementsByTagName('table')[0].getElementsByTagName('tbody')[0].getElementsByTagName('tr');

                    if (typeof chapters !== 'undefined') {

                        var urls = new Array();

                        for (var i = 1; i < chapters.length; ++i)
                            urls.push(chapters[i].getElementsByTagName('td')[0].getElementsByTagName('a')[0].href);

                        return urls;
                    } else
                        return [];
                }
            },
            run: function () {

                casper.start(jMangaDownloader.struct.mangareader.manga.url, function () {

                    if (this.evaluate(jMangaDownloader.chapters.mangareader.utils.isManga)) {

                        jMangaDownloader.struct.mangareader.manga.chapters.urls = this.evaluate(jMangaDownloader.chapters.mangareader.utils.getChapters);

                        if (jMangaDownloader.struct.mangareader.manga.chapters.urls.length > 0)
                            jMangaDownloader.utils.limitChapters(jMangaDownloader.struct.mangareader.manga.chapters);
                        else
                            console.log(jMangaDownloader.alerts.english);
                    } else
                        console.log(jMangaDownloader.alerts.isManga);
                });

                casper.run(function () {

                    console.log(jMangaDownloader.alerts.loadedMangaReader);
                    console.log(jMangaDownloader.alerts.totalChapters + jMangaDownloader.struct.mangareader.manga.chapters.urls.length);

                    jMangaDownloader.utils.waitFor.release();
                });
            },
            init: function () {

                jMangaDownloader.chapters.mangareader.run();
            }
        }
    },
    /* wait to get all chapters url from servers and after start to get all images for each chapter */
    start: function () {

        jMangaDownloader.utils.waitFor.callback = jMangaDownloader.pages.init;

        for (var server in jMangaDownloader.struct) {

            if (typeof jMangaDownloader.struct[server].manga.url === 'string') {

                if (jMangaDownloader.struct[server].manga.url.length > 0) {

                    if (jMangaDownloader.struct[server].manga.url.match(new RegExp(/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi))) {

                        switch (server) {

                            case 'batoto':
                            {

                                jMangaDownloader.utils.waitFor.execute(jMangaDownloader.chapters.batoto.init);

                                break;
                            }

                            case 'mangareader':
                            {

                                jMangaDownloader.utils.waitFor.execute(jMangaDownloader.chapters.mangareader.init);

                                break;
                            }

                            default :
                            {

                                console.log(jMangaDownloader.alerts.serverChoose + server);

                                break;
                            }
                        }
                    } else
                        console.log(jMangaDownloader.alerts.urlMangaExist + jMangaDownloader.manga[server].url);
                }
            } else
                console.log(jMangaDownloader.alerts.urlManga);
        }
    },
    init: function () {

        this.start();
    }
};

jMangaDownloader.struct.batoto.manga.url = 'http://bato.to/comic/_/comics/pastel-r724';
jMangaDownloader.struct.batoto.manga.chapters.limit.start = 1;
jMangaDownloader.struct.batoto.manga.chapters.limit.end = 2;

jMangaDownloader.struct.mangareader.manga.url = 'http://www.mangareader.net/383/pastel.html';
jMangaDownloader.struct.mangareader.manga.chapters.limit.start = 1;
jMangaDownloader.struct.mangareader.manga.chapters.limit.end = 2;

jMangaDownloader.init();
