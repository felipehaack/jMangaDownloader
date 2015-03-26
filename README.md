#jMangaDownloader

##Introducting

How I like so much read manga I'm developing an API with the goal of download all manga chapters from some manga hosting servers. The readers just need to install some dependencies and execute the script with terminal/console, It'll download every pages as a PNG image. The next steps will show how you can to do it.

##Step by step - Dependencies
First, We need to install some dependencies for your operating system.

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
7. Add new paths to PATH environment variable:
  1. Open console and type
  2. setx PATH "%PATH%;C:\phantomjs;C:\casperjs\batchbin"
8. Restart your operating system

###MAC
1. Open the terminal
2. If you don't have brew and wget: 
  1. ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
  2. brew install wget
3. Now install casperjs:
  1. brew install casperjs

###Linux
1. Download PhantomJS.

##Step by step - Starting API
