# AngularJS Inspector
Node.js source code inspector for AngularJS projects.

## Overview

AngularJS Inspector is a Node.js command line tool that reads your source code (*.js) files and gives a report that details the following.

- The usage of the $rootScope
- Checks that all $broadcast messages have corresponding $on listeners.
- Reports on the usage of directives in HTML templates.
- Reports on the usage of the $http service.
- Cross references functions assigned to a $scope and their usage in HTML templates.
- Checks for global controllers that are not used.
- Checks for directives that are not used.
- Checks for services and factories that are not used.

## Quick Start

#### Install

```sh
$ npm install -g angularjs-inspector
```

#### Usage

```sh
$ ngInspector /src
```

where ```/src``` is the path to your AngularJS source code.