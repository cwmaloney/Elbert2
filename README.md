# ELbert2

This runs the (Night of the Living Farm) NOLF and "blue" light shows for Deanna Rose Children's Farmstead

This runs the moving ligths, washers, building outltine pixel, and "ornaments".

## Setup

### Get Project Code from GitHub

1. Recommended - Go to GitHub and create an account so you can post comments, send pull requests, etc. for the project.

1. Suggestion - Ask the project committers to make you a committer for the project.

1. Go to <https://github.com/cwmaloney/farmsteadLightsNolf>

1. Clone or download the source (suggestion /projects/farmsteadLightsNolf).

1. Recommended - Clone instead of download. Cloning creates a local git repository for you with the history of the project. This also allows you to commit, changes to your lcal repository (for checkpointing changes) before pushing changes to the server.

   * Click "Clone or download"
   * Click "Open in Desktop" (This will use GitHub Desktop... a UI for git)
   * If you do not have GitHub Desktop installed, install it when prompted
1. Recommended - Install git command line tools
   * <https://git-scm.com>

### Install Node.js and NPM

Node.js is a JavaScript runtime system for building applications.
This project (like many other projects) uses it to create an HTTP server.  

1. Go to <https://nodejs.org/en/>

2. Download LTS or current version (12.19) for Windows or Mac

3. Run the installer; accept the defaults

4. To verify installation, in a terminal/command window, type: node -v and then npm -v

### Install Visual Studio Code (VS Code)

This project does not require VS Code or any IDE.
Most programmers will find an IDE is very helpful.
VS Code is free and I used it here to gain experience.

1. Go to <https://code.visualstudio.com/>

1. Download the Windows or Mac version - latest stable build

1. For Mac:
   * Unzip the installer and copy the app into your Applications folder

1. For Windows:

   * Run the exe.
   * Restart your computer (to fix path environment variable - per the instructions).

1. To verify installation, launch and close the app

1. ~~Add Extensions to VS Code; On the left navigation pane (Activity bar), click the Extensions icon. Install these extensions:~~
     * ~~npm~~

## Install npm packages

The npm (node package manager) will install the JavaScript packages (libraries) the project needs including:

1. Express library (simple web framework)

npm installs packages in the folder "node_modules" withing the project folder.

1. Install:
     * Open a terminal or command line window
     * "cd" to project folder
     * npm install

## Running the Elbert2 server

1. Optional - Update the software from github.com
    * Open a terminal or command line window
    * cd to project folder
    * git pull

1. Start the service
    * Open a terminal or command line window
    * cd to project folder
    * node nolfShow.js

1. Turn off the moving lights
    * Stop the show
    * Open a terminal or command line window
    * cd to project folder
    * node nolfShow.js off

## Editing and Debugging using VS Code

1. In VS Code, open the project folder (File/Open)
1. On the left navigation pane (Activity bar), click the debug icon
1. Click the green arrow icon in the debug view to start the service and attach the debugger
