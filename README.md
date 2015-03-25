#jMangaDownloader

##Introducting

How I like so much read manga I'm developing an API with the goal of download all manga chapters from some manga hosting servers. The readers just need to install some dependencies and run script with terminal/console, It'll download every pages was a PNG. The next step will show how you can to do it.

##Step by step - Dependencies
First, We need install some dependencies for your system operation.

###Windows
1. Download PhantomJS:
2. https://code.google.com/p/phantomjs/downloads/detail?name=phantomjs-1.9.2-windows.zip&can=2&q=
3. Download CasperJS:
4. https://github.com/n1k0/casperjs/zipball/1.1-beta3
5. Unzip PhantomJS and CasperJS
6. Make sure just has one hierarchical folder to access all files of the both projects
6. Rename phantomjs folder to phantomjs
7. Rename casperjs folder to casperjs
8. Cut both folders and paste it in the C://
9. Access the PATH environment variable: 

###MAC
1. Open the terminal.
2. If you don't have brew and wget: 
3. ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
4. brew install wget
6. With brew and wget you can to download everything that you need, just do it:
7. brew install casperjs

###Linux
1. Download PhantomJS.

##Step by step - Starting API
