Primate
=======

Primate password manager


Installation
------
If you have nodejs installed, navigate to the main directory and run:
`npm install`

You will also need to install `grunt` globally, run:
`npm install -g grunt-cli`

For testing, you can make use of `karma-cli` and `jasmine-node`:
`npm install -g karma-cli`
`npm install -g jasmine-node`

For documentation, you can use `jsdoc`:
`npm install -g jsdoc`
Then run it with this from the root directory of the application:
`jsdoc -d docs app/js/*.js`

Running the Application
------
Running `grunt` will build a release version of the application in `dists/Primate/` for Windows, Mac OS X and Linux (64bit). The first time this is run it will download node-webkit for each platform and save it to `cache/`, which can take a very long time. Currently there is no progress display, so be aware that there is a few hundred Megabytes which will be downloaded, and if the operation is cancelled early you will need to delete the cache directory to start over.

Once this process completes, an executable will be created for each platform under `dists/Primate/`.
