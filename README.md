#jMangaDownloader

##Introducting

How I read many manga I'm developing an API with the goal of download all manga chapters from some manga hosting servers. You just need to install some dependencies and execute the script with terminal/console, It'll download every pages as a image (of course). The next steps will teach how you can to use it.

##Step by step - Dependencies

First, We need to install some dependencies for each operating system.

###Windows

1. Download PhantomJS:
  1. https://code.google.com/p/phantomjs/downloads/detail?name=phantomjs-1.9.2-windows.zip&can=2&q=
2. Download CasperJS:
  1. https://github.com/n1k0/casperjs/zipball/1.1-beta3
3. Unzip PhantomJS and CasperJS
  1. Make sure just has one hierarchical folder to access all files for each projects
4. Rename phantomjs folder to phantomjs
5. Rename casperjs folder to casperjs
6. Cut both folders and paste them in the C://
7. Adding new paths application to your PATH Environment Variable:
  1. Search for CMD and open it
  2. Type follow command: setx PATH "%PATH%;C:\phantomjs;C:\casperjs\batchbin"
  4. Press ENTER key
8. Restart your operating system

###MAC

1. Open terminal
2. If you don't have brew and wget: 
  1. ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
  2. brew install wget
3. Now install casperjs:
  1. brew install casperjs

###Linux

1. Open terminal and type:
  1. sudo npm install -g casperjs

##Step by Step - Download Manga Chapters

1. Create a folder and rename it as you wish
2. Download jMangaDownloader.js from this project and save it into your folder

### Navigation to the Folder

1. Search for CMD / Terminal and open it
2. Go to your created folder (**not inside**)
3. Click the right mouse button at your folder
4. Select **Properties** option
5. Copy the local path
  1. If you use **Window System**, change all bars from local path to backslash (ex: C:\Users\UserName\Desktop to C:/Users/UserName/Desktop)
7. Add your folder name with a bar at the end of text
  1. **Windows**: C:/Users/UserName/Desktop/MyFolderName
  2. **Mac / Linux**: /Users/UserName/Desktop/MyFolderName
6. Add cd to the begin of text
  1. **Windows**: cd C:/Users/UserName/Desktop/MyFolderName
  2. **Mac / Linux**: cd /Users/UserName/Desktop/MyFolderName
7. Go to CMD / Terminal application and paste it
8. Press ENTER key

### jMandaDownloader.js

1. Open the jMangaDownloader.js with text editor
2. Go to the end of file
3. You can to see the follow lines:

```
jMangaDownloader.struct.batoto.manga.url = 'http://bato.to/comic/_/comics/dungeon-ni-deai-wo-motomeru-no-wa-machigatteiru-darou-ka-r9803';
jMangaDownloader.struct.batoto.manga.chapters.limit.start = 1;
jMangaDownloader.struct.batoto.manga.chapters.limit.end = 2;

jMangaDownloader.struct.mangareader.manga.url = 'http://www.mangareader.net/world-trigger';
jMangaDownloader.struct.mangareader.manga.chapters.limit.start = 1;
jMangaDownloader.struct.mangareader.manga.chapters.limit.end = 2;
```

- Currently this API support batoto and mangareader english language
- Now if you want to download a manga from batoto change the follow URL:
```
jMangaDownloader.struct.batoto.manga.url = 'http://bato.to/comic/_/comics/dungeon-ni-deai-wo-motomeru-no-wa-machigatteiru-darou-ka-r9803';
```
- If you want to download a manga from start point or end up at some chapters number change the follow numbers:
```
jMangaDownloader.struct.batoto.manga.chapters.limit.start = -1;
jMangaDownloader.struct.batoto.manga.chapters.limit.end = -1;
```
- PS: The -1 negative number tell to the API to download all chapters.
- Now, you can to do the same way for mangareader, like change the URL and if you wish, adding a start or end point.


### Finally

1. Go to CMD / Terminal
2. Type the follow command:
3. casperjs jMangaDownload.js
4. Now you can to see every page downloading
5. In the end you see the follow message: Finally done :)

## Save Point

- Do you want to shut down you computer? Don't worry, do it, because there's a savepoint file for batoto and mangareader inside the manga folder. Just open the file and repeat the datas from jMangaDownload.js.
