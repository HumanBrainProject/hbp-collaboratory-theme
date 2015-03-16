# collaboratory-theme

A Bootstrap 3 Theme for HBP Collaboratory Extensions

# Development

Run watcher and server using grunt:

```bash
grunt serve
```

You can then access a development server on http://localhost:8100.

Each time a modification is detected, the corresponding files will be
regenerated. If a Sass file is modified, the `dist` folder will be rebuilt
as well, which means that you can link this project with other Bower enable
development folder and have the change propagated.

# Credits

The project structure and build files are inspired by the [Themestrap] template.
The kitchen sink especially is a direct copy of a huge amount of work from this
project.
The main variation is that we use Bootstrap Sass instead of Less.

[Themestrap]: http://code.divshot.com/themestrap/
