'use strict';

var _ = require('lodash');
var chalk = require('chalk');
var yeoman = require('yeoman-generator');

var Generator = yeoman.generators.Base.extend({

  initializing: function() {
    this.pkg = require('../package.json');
  },

  prompting_init: function() {
    var done = this.async();

    this.log(
      '\n' + chalk.bold.underline('Welcome to the Babel module generator') +
      '\n' +
      '\nWe\'re going to set up a new ' + chalk.bold('Babel') + ' module.' +
      '\n'
    );

    var prompts = [{
      type: 'input',
      name: 'projectName',
      message: 'First, what is the name of your module ?',
      default: 'My Component'
    }];

    this.prompt(prompts, function (props) {
      _.extend(this, props);
      this.packageName = _.kebabCase(_.deburr(this.projectName));
      this.componentName = _.capitalize(_.camelCase(this.projectName));
      this.currentYear = new Date().getFullYear();
      done();
    }.bind(this));
  },

  prompting_names: function() {
    var done = this.async();

    var prompts = [{
      type: 'input',
      name: 'componentName',
      message: 'What is the ClassName for your component ?',
      default: this.componentName
    }, {
      type: 'confirm',
      name: 'isReact',
      message: 'Is this a react component ?',
      default: true
    }];

    this.prompt(prompts, function (props) {
      _.extend(this, props);
      done();
    }.bind(this));
  },

  prompting_project: function() {
    var done = this.async();

    var prompts = [{
      type: 'input',
      name: 'packageName',
      message: 'What will the npm package name be ?',
      default: this.isReact ? 'react-' + this.packageName.replace('-', '') : this.packageName
    }, {
      type: 'input',
      name: 'developerName',
      message: 'What is your name ? (for copyright notice, etc.)',
      default: this.user && this.user.git && this.user.git.name && this.user.git.name()
    }, {
      type: 'input',
      name: 'ghUser',
      message: 'What is your GitHub Username ?',
      default: this.user && this.user.git && this.user.git.email && this.user.git.email().split('.')[0].split('@')[0]
    }, {
      type: 'input',
      name: 'ghRepo',
      message: 'What is the name of the GitHub repo this will be published at ?',
      default: this.packageName
    }, {
      type: 'confirm',
      name: 'createGit',
      message: 'Init git ?',
      default: true
    }, {
      type: 'confirm',
      name: 'createDirectory',
      message: 'Would you like to create a new directory for your project ?',
      default: true
    }, {
      type: 'confirm',
      name: 'createLicence',
      message: 'Add an MIT license ?',
      default: true
    }];

    this.prompt(prompts, function (props) {
      _.extend(this, props);
      if (props.createDirectory) {
        this.destinationRoot(this.packageName);
      }
      this.log('\n');
      done();
    }.bind(this));
  },

  writing: {
    project: function() {
      this.copy('.babelrc', '.babelrc');
      this.copy('.editorconfig', '.editorconfig');
      this.copy('.eslintignore', '.eslintignore');
      this.copy('.eslintrc', '.eslintrc');
      this.copy('.gitignore', '.gitignore');
      this.copy('.npmignore', '.npmignore');
      this.copy('karma.conf.js', 'karma.conf.js');
      this.copy('webpack.config.js', 'webpack.config.js');
      this.copy('webpack.config.dev.js', 'webpack.config.dev.js');
      this.template('README.md', 'README.md');

      if (this.isReact) {
        this.template('package.react.json', 'package.json');
      }
      else {
        this.template('package.json', 'package.json');
      }

      if (this.createLicence) {
        this.copy('LICENSE.txt', 'LICENSE.txt');
      }
    },
    component: function() {
      this.template('src/index.js', 'src/index.js');
      if (this.isReact) {
        this.template('src/Component.react.js', 'src/' + this.componentName + '.js');
      }
      else {
        this.template('src/Component.js', 'src/' + this.componentName + '.js');
      }
    },
    test: function() {
      this.copy('test/test.html', 'test/test.html');
    },
    demo: function() {
      this.copy('demo/index.html', 'demo/index.html');
      this.copy('demo/webpack.config.dev.js', 'demo/webpack.config.dev.js');

      if (this.isReact) {
        this.template('demo/app.react.js', 'demo/app.js');
      }
      else {
        this.template('demo/app.js', 'demo/app.js');
      }
    }
  },

  install: function() {
    this.npmInstall();

    if (this.createGit) {
      this.spawnCommand('git', ['init']);
    }
  },

  end: function() {
    var chdir = this.createDirectory ? '"cd ' + this.packageName + '" then ' : '';
    this.log(
      '\n' + chalk.green.underline('Your new React Component is ready!') +
      '\n' +
      '\nYour component is in /src and your examples are in /example/src.' +
      '\n' +
      '\nType ' + chdir + '"npm start" to run the development build and server tasks.' +
      '\n'
    );
  }

});

module.exports = Generator;
