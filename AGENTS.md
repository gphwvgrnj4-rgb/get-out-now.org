# get-out-now.org

Placeholder repository for a static website. Currently contains only `README.md`; content will be a single self-contained static HTML file like the sibling `*.org` repos. There is no build step, package manager, dependency install, lint, or test suite.

## Cursor Cloud specific instructions

- Static site, no dependencies to install. Python 3 and Node are preinstalled; nothing is needed to develop or run it.
- Run locally with a static file server from the repo root: `python3 -m http.server 8000`, then open `http://localhost:8000/`.
- There is no HTML entry file yet (only `README.md`), so add e.g. `index.html` before there is anything to serve.
- "Building" just means opening the static file in a browser; there is no lint or automated test tooling.
