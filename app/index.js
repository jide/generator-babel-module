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
    }, {
      type: 'confirm',
      name: 'isReact',
      message: 'Is this a react component ?',
      default: true
    }];

    this.prompt(prompts, function (props) {
      _.extend(this, props);
      this.packageName = _.kebabCase(_.deburr(this.projectName));
      if (this.isReact) {
        this.packageName = 'react-' + this.packageName;
      }
      this.componentName = _.capitalize(_.camelCase(this.projectName));
      this.currentYear = new Date().getFullYear();
      done();
    }.bind(this));
  },

  prompting_names: function() {
    var done = this.async();

    var prompts = [{
      type: 'input',
      name: 'packageName',
      message: 'What is the ClassName for your component ?',
      default: this.componentName
    }, {
      type: 'input',
      name: 'packageName',
      message: 'What will the npm package name be ?',
      default: this.packageName
    }, {
      type: 'input',
      name: 'developerName',
      message: 'What is your name ? (for copyright notice, etc.)'
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
      name: 'ghUser',
      message: 'What is your GitHub Username ?',
      default: _.capitalize(_.camelCase(this.developerName))
    }, {
      type: 'input',
      name: 'ghRepo',
      message: 'What is the name of the GitHub repo this will be published at ?',
      default: this.packageName
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
      this.copy('babelrc', '.babelrc');
      this.copy('editorconfig', '.editorconfig');
      this.copy('eslintignore', '.eslintignore');
      this.copy('eslintrc', '.eslintrc');
      this.copy('gitignore', '.gitignore');
      this.copy('npmignore', '.npmignore');
      this.copy('_karma.conf.js', 'karma.conf.js');
      this.copy('_webpack.config.js', 'webpack.config.js');
      this.copy('_webpack.config.dev.js', 'webpack.config.dev.js');
      this.template('_README.md', 'README.md');

      if (this.isReact) {
        this.template('_package_react.json', 'package.json');
      }
      else {
        this.template('_package.json', 'package.json');
      }

      if (this.createLicence) {
        this.copy('_LICENSE.txt', 'LICENSE.txt');
      }
    },
    component: function() {
      this.template('src/_index.js', 'src/index.js');
      if (this.isReact) {
        this.template('src/_Component_react.js', 'src/' + this.componentName + '.js');
      }
      else {
        this.template('src/_Component.js', 'src/' + this.componentName + '.js');
      }
    },
    test: function() {
      this.copy('test/_test.html', 'test/test.html');
    },
    demo: function() {
      this.copy('demo/_index.html', 'demo/index.html');
      this.copy('demo/_webpack.config.dev.js', 'demo/webpack.config.dev.js');

      if (this.isReact) {
        this.template('demo/_app_react.js', 'demo/app.js');
      }
      else {
        this.template('demo/_app.js', 'demo/app.js');
      }
    }
  },

  install: function() {
    this.npmInstall();
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
