# Overview

A simple GUI client for the Sudokill game written in Javascript to be deployed on the [Dr Ecco website](http://cims.nyu.edu/drecco/). The game runs independently without any communication with a server.

# Building

To build the app, type:

    rake build

Note that this requires the [Google Closure compiler](http://code.google.com/closure/compiler/) on the project root directory. You may also need to modify the CLOSURE_ROOT_PATH variable inside the Rakefile to point to the correct directory.

# Testing

To run all tests, simply open test/all_tests.html on a web browser.

# Demo

You can open demo/sudokill.html on a browser to see how it looks like.

