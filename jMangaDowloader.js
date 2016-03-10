var casper = require('casper').create({
    verbose: false,
    logLevel: "debug",
    stepTimeout: 90000,
    waitTimeout: 90000,
    onStepTimeout: function (timeout, step) {

        this.echo('Timeout: retry!');
        this.clear();
        this.page.stop();
    },
    pageSettings: {
        loadImages: true,
        loadPlugins: false,
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
        sequenceNumber: 'Sequence number of page: ',
        savePoint: '.savepoint',
        notFoundPage: 'Page not found, try again!',
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
        is: {
            mainDirectory: true
        },
        get: {
            fileSystem: function(){

                return require('fs');
            }
        },
        set: {
            mainDirectory: function () {
                
                jMangaDownloader.utils.is.mainDirectory = false;
            }
        },
        create: {
            savePoint: function (server, chapter, enumerator) {
                
                var fs = jMangaDownloader.utils.get.fileSystem();

                var save = 'jMangaDownloader.struct.' + server + '.manga.chapters.limit.start = ' + (chapter + 1) + '; \n'
                save += 'jMangaDownloader.struct.'+ server + '.manga.chapters.label = ' + enumerator + ';'

                fs.write('../' + server + jMangaDownloader.alerts.savePoint + '.txt', save, 'w');
            },
            directory: function(name){

                if(!jMangaDownloader.utils.is.mainDirectory)
                    jMangaDownloader.utils.change.directory('../');

                var fs = jMangaDownloader.utils.get.fileSystem();
                fs.makeDirectory(name);

                jMangaDownloader.utils.change.directory(name);
            }
        },
        change: {
            directory: function (name) {
                
                var fs = jMangaDownloader.utils.get.fileSystem();
                fs.changeWorkingDirectory(name);   

                jMangaDownloader.utils.set.mainDirectory();
            }
        },
        navigator: {
            options: [
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.90 Safari/537.36',
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/600.5.17 (KHTML, like Gecko) Version/7.1.5 Safari/537.85.14',
                'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.91 Safari/537.36',
                'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.118 Safari/537.36',
                'Mozilla/5.0 (Linux; Android 4.4.4; XT1022 Build/KXC21.5-40) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.96 Mobile Safari/537.36',
                'Mozilla/5.0 (iPhone; CPU iPhone OS 8_1 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Mobile/12B411',
                'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:36.0) Gecko/20100101 Firefox/36.0',
                'Mozilla/5.0 (Linux; U; Android 4.2.2; en-ca; arc 7HD Build/JDQ39) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Safari/534.30',
                'Mozilla/5.0 (iPad; CPU OS 6_1_3 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Mobile/10B329'
            ],
            random: function () {

                return this.options[Math.floor(Math.random() * this.options.length) + 0];
            }
        },
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

                if (this.callbacks.length > 0) {

                    this.execute();
                } else {
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
            
            --obj.limit.start;
            --obj.limit.end;

            if (obj.limit.start < 0 || (obj.limit.start > obj.urls.length - 1))
                obj.limit.start = 0;

            if (obj.limit.end < 0 || (obj.limit.end > obj.urls.length - 1))
                obj.limit.end = obj.urls.length - 1;

            if (obj.limit.start > obj.limit.end) {

                obj.limit.start = 0;
                obj.limit.end = obj.urls.length - 1;
            }
            
            var newUrls = new Array();
            for (var i = obj.limit.start; i <= obj.limit.end; ++i)
                newUrls.push(obj.urls[i]);

            obj.urls = newUrls;
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

                        return  url + '_' + index;
                    },
                    urlImage: function () {

                        return document.getElementById("full_image").getElementsByTagName('img')[0].src;
                    },
                    divSelector: function () {

                        return '#comic_page';
                    }
                }
            },
            mangareader: {
                get: {
                    totalPages: function () {

                        return document.getElementById('selectpage').getElementsByTagName('select')[0].getElementsByTagName('option').length;
                    },
                    urlPage: function (url, index) {

                        return  url + '/' + index;
                    },
                    urlImage: function () {

                        return document.getElementById("imgholder").getElementsByTagName('a')[0].getElementsByTagName('img')[0].src;
                    },
                    divSelector: function () {

                        return '#img';
                    }
                }
            }
        },
        start: function (obj) {

            casper.userAgent(jMangaDownloader.utils.navigator.random());

            casper.thenOpen(obj.url, function () {

                obj.totalPages = this.evaluate(obj.utils.get.totalPages);

                if (obj.totalPages !== null) {

                    jMangaDownloader.utils.create.savePoint(obj.server, obj.chapter, obj.enumerator);

                    console.log('');
                    console.log(obj.server.toUpperCase() + ' - Downloading Chapter ' + (obj.chapter + 1) + ' to ' + (obj.end + 1) + ' from ' + obj.totalChapters);

                    casper.then(function () {

                        jMangaDownloader.pages.then(obj);
                    });
                } else {

                    casper.then(function () {

                        jMangaDownloader.pages.start(obj);
                    });
                }
            });
        },
        then: function (obj) {

            if (obj.index <= obj.totalPages) {

                casper.thenOpen(obj.utils.get.urlPage(obj.url, obj.index), function () {

                    var url = this.evaluate(obj.utils.get.urlImage);

                    if (url !== null) {

                        this.waitForSelector(obj.utils.get.divSelector(), function () {

                            console.log(jMangaDownloader.alerts.downloadingPage + obj.index + ' of ' + obj.totalPages);
                            console.log(jMangaDownloader.alerts.sequenceNumber + obj.enumerator);

                            this.captureSelector(obj.enumerator + '.png', obj.utils.get.divSelector());

                            ++obj.index;
                            ++obj.enumerator;

                            casper.then(function () {

                                jMangaDownloader.pages.then(obj);
                            });
                        }, function(){

                            console.log(jMangaDownloader.alerts.notFoundPage);

                            casper.then(function () {

                                jMangaDownloader.pages.then(obj);
                            });
                        });
                    } else {

                        casper.then(function () {

                            jMangaDownloader.pages.then(obj);
                        });
                    }
                });
            } else {

                casper.then(function () {

                    jMangaDownloader.pages.choose(obj);
                });
            }
        },
        choose: function (obj) {

            var hasObj = false;

            for (var server in jMangaDownloader.struct) {

                if (jMangaDownloader.struct[server].manga.chapters.urls.length > 0) {

                    if (typeof obj === 'undefined') {

                        jMangaDownloader.utils.create.directory(server);

                        var firstTime = true;

                        obj = {
                            index: 1,
                            chapter: jMangaDownloader.struct[server].manga.chapters.limit.start,
                            end: jMangaDownloader.struct[server].manga.chapters.limit.end,
                            totalPages: 0,
                            totalChapters: jMangaDownloader.struct[server].manga.chapters.urls.length,
                            enumerator: jMangaDownloader.struct[server].manga.chapters.label,
                            server: server,
                            utils: jMangaDownloader.pages.utils[server],
                            url: jMangaDownloader.struct[server].manga.chapters.urls.shift()
                        };
                    } else {

                        obj.index = 1;
                        obj.chapter += 1;
                        obj.url = jMangaDownloader.struct[server].manga.chapters.urls.shift();

                        if (obj.server !== server) {

                            obj.chapter = 1;
                            obj.enumerator = jMangaDownloader.struct[server].manga.chapters.label;
                            obj.server = server;
                            obj.utils = jMangaDownloader.pages.utils[server];
                        }
                    }

                    if (obj.chapter <= obj.end) {

                        casper.then(function () {

                            jMangaDownloader.pages.start(obj);
                        });

                        hasObj = true;
                    }else{

                        jMangaDownloader.struct[server].manga.chapters.urls = new Array();
                        obj = undefined;
                    }


                    if (firstTime) {

                        firstTime = false;

                        casper.run();
                    }

                    if (hasObj) {

                        break;
                    }
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

                    return tds[i + 1].innerHTML.match('Manga|Manhua') ? true : false;
                },
                getChapters: function () {

                    var chapters = document.getElementsByClassName('row lang_English chapter_row');

                    if (typeof chapters !== 'undefined') {

                        var urls = new Array();

                        for (var i = (chapters.length - 1); i >= 0; --i) {

                            var url = chapters[i].getElementsByTagName('td')[0].getElementsByTagName('a')[0].href;
                            urls.push(url);
                        }

                        return urls;
                    } else
                        return [];
                }
            },
            start: function () {

                casper.start(jMangaDownloader.struct.batoto.manga.url, function () {

                    var isManga = this.evaluate(jMangaDownloader.chapters.batoto.utils.isManga);

                    if (isManga !== null) {

                        if (isManga) {

                            if (this.evaluate(jMangaDownloader.chapters.batoto.utils.isExpand))
                                this.click('.chapter_row_expand');

                            jMangaDownloader.struct.batoto.manga.chapters.urls = this.evaluate(jMangaDownloader.chapters.batoto.utils.getChapters);

                            if (jMangaDownloader.struct.batoto.manga.chapters.urls.length > 0)
                                jMangaDownloader.utils.limitChapters(jMangaDownloader.struct.batoto.manga.chapters);
                            else
                                console.log(jMangaDownloader.alerts.english);
                        } else
                            console.log(jMangaDownloader.alerts.isManga);
                    } else {

                        casper.then(function () {

                            jMangaDownloader.chapters.batoto.start();
                        });
                    }
                });
            },
            run: function () {

                casper.run(function () {

                    console.log('');
                    console.log(jMangaDownloader.alerts.loadedBatoto);
                    console.log(jMangaDownloader.alerts.totalChapters + jMangaDownloader.struct.batoto.manga.chapters.urls.length);

                    jMangaDownloader.utils.waitFor.release();
                });
            },
            init: function () {

                jMangaDownloader.chapters.batoto.start();
                jMangaDownloader.chapters.batoto.run();
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
            start: function () {

                casper.start(jMangaDownloader.struct.mangareader.manga.url, function () {

                    var isManga = this.evaluate(jMangaDownloader.chapters.mangareader.utils.isManga);

                    if (isManga !== null) {

                        if (isManga) {

                            jMangaDownloader.struct.mangareader.manga.chapters.urls = this.evaluate(jMangaDownloader.chapters.mangareader.utils.getChapters);

                            if (jMangaDownloader.struct.mangareader.manga.chapters.urls.length > 0)
                                jMangaDownloader.utils.limitChapters(jMangaDownloader.struct.mangareader.manga.chapters);
                            else
                                console.log(jMangaDownloader.alerts.english);
                        } else
                            console.log(jMangaDownloader.alerts.isManga);
                    } else {

                        casper.then(function () {

                            jMangaDownloader.chapters.mangareader.start();
                        });
                    }
                });
            },
            run: function () {

                casper.run(function () {

                    console.log('');
                    console.log(jMangaDownloader.alerts.loadedMangaReader);
                    console.log(jMangaDownloader.alerts.totalChapters + jMangaDownloader.struct.mangareader.manga.chapters.urls.length);

                    jMangaDownloader.utils.waitFor.release();
                });
            },
            init: function () {

                jMangaDownloader.chapters.mangareader.start();
                jMangaDownloader.chapters.mangareader.run();
            }
        }
    },
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
        
        casper.userAgent(jMangaDownloader.utils.navigator.random());

        this.start();
    }
};

jMangaDownloader.struct.batoto.manga.url = 'http://bato.to/comic/_/comics/dungeon-ni-deai-wo-motomeru-no-wa-machigatteiru-darou-ka-r9803';
jMangaDownloader.struct.batoto.manga.chapters.limit.start = -1;
jMangaDownloader.struct.batoto.manga.chapters.limit.end = -1;

jMangaDownloader.struct.mangareader.manga.url = 'http://www.mangareader.net/world-trigger';
jMangaDownloader.struct.mangareader.manga.chapters.limit.start = -1;
jMangaDownloader.struct.mangareader.manga.chapters.limit.end = -1;

jMangaDownloader.init();
