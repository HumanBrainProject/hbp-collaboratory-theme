'use strict';
module.exports = function (grunt) {
  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);
  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  grunt.initConfig({
    bowerDirectory: require('bower').config.directory,
    pkg: grunt.file.readJSON('package.json'),


    // -----------------------
    // Build Tasks
    // -----------

    scsslint: {
      sass: ['sass/theme.scss'],
      options: {
        bundleExec: true,
        reporterOutput: 'reports/scss-lint-report.xml',
        colorizeOutput: true
      },
    },

    sass: {
      options: {
        sourceMap: true,
        includePaths: ['<%= bowerDirectory %>']
      },
      dist: {
        files: {
            '.tmp/dist/css/bootstrap.css': 'sass/theme.scss'
        }
      }
    },

    cssmin: {
      minify: {
        expand: true,
        cwd: '.tmp/dist/css',
        src: ['*.css', '!*.min.css'],
        dest: '.tmp/dist/css',
        ext: '.min.css'
      }
    },

    assemble: {
      pages: {
        options: {
          data: './bower.json',
          flatten: true,
          assets: '.tmp/dist'
        },
        files: {
          '.tmp/dist/index.html': ['pages/index.html'],
          '.tmp/dist/examples/': ['pages/examples/*.html']
        }
      }
    },

    copy: {
      ci: {
        files: [
          // all .tmp/dist directory
          {expand: true, cwd: '.tmp/dist', src: ['**'], dest: 'dist/'},
          // all sass file to dist/sass
          {expand: true, src: ['sass/*'], dest: 'dist/'}
        ]
      },
      fonts: {
        files: [
          // copy Bootstrap fonts
          {expand: true, cwd: 'bower_components/bootstrap-sass/assets/fonts/bootstrap', src: ['**'], dest: '.tmp/dist/fonts'},
        ]
      }
    },

    clean: ['dist', '.tmp', 'reports'],


    // -----------------------
    // Watch and Serve
    // ---------------

    watch: {
      sass: {
        files: ['sass/*.sass'],
        tasks: ['sass:dist', 'scsslint:sass'],
        options: {
          livereload: true
        }
      },
      cssmin: {
        files: ['.tmp/dist/css/bootstrap.css'],
        tasks: 'cssmin:minify'
      },
      assemble: {
        files: ['pages/*.html', 'pages/examples/*', 'README.md'],
        tasks: ['assemble']
      }
    },

    connect: {
      serve: {
        options: {
          port: grunt.option('port') || '8100',
          hostname: grunt.option('host') || 'localhost',
          base: '.tmp/dist'
        }
      }
    },


    // -----------------------
    // Publish and Release
    // ---------------

    bump: {
      options: {
        files: ['package.json', 'bower.json'],
        updateConfigs: ['pkg'],
        commitFiles: ['package.json', 'bower.json', 'CHANGELOG.md'],
        pushTo: 'origin HEAD:master'
      }
    },
    changelog: {
      options: {
        commitLink: function(h) { return 'https://bbpteam.epfl.ch/reps/gerrit/platform/hbp/collaboratory-theme/commit/?id='+h; },
        issueLink: function(issueId) { return 'https://bbpteam.epfl.ch/project/issues/browse/' + issueId; }
      }
    }
  });


  // register task missed by load-grunt-task
  grunt.loadNpmTasks('assemble');

  // -----------------------
  // Main Targets
  // ------------

  grunt.registerTask('ci', function (target) {
    var tasks = ['default', 'copy:ci'];
    if (target === 'patch' || target === 'minor' || target === 'major') {
      tasks.unshift('bump-only:'+target);
      tasks.push('changelog', 'bump-commit');
    }
    grunt.task.run(tasks);
  });

  grunt.registerTask('serve', ['clean', 'sass', 'copy:fonts', 'assemble', 'connect', 'watch']);

  grunt.registerTask('default', ['clean', 'scsslint', 'sass', 'cssmin', 'copy:fonts', 'assemble']);
};
