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
  2. **Mac / Linux**: /Users/UserName/Desktop
6. Add cd to the begin of text
  1. **Windows**: cd C:/Users/UserName/Desktop/MyFolderName
  2. **Mac / Linux**: cd /Users/UserName/Desktop/MyFolderName
7. Go to CMD / Terminal application and paste it
8. Press ENTER key
