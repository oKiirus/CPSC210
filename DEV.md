# CPSC 210 Project Repository

This repository contains starter code for the class project. While your repository should be private during the term, you are free to share it after the final exam.

For information about the project, see the course webpage.

## Configuring your environment

To start using this project, you need to get your development environment configured so that you can build and execute the code. To do this, follow these steps; the specifics of each step will vary based on your operating system:

1. [Install git](https://git-scm.com/downloads) (v2.X). You should be able to execute `git --version` on the command line after installation is complete.

2. [Install Node](https://nodejs.org/en/download/) (v24.X), which will also install NPM (you should be able to execute `node --version` and `npm --version` on the command line).

3. [Install pnpm](https://pnpm.io/installation#using-other-package-managers) (v10.X, the version the lab workspaces use). You should be able to execute `pnpm --version`.

4. Clone your repository by running `git clone REPO_URL` from the command line. You can get the REPO_URL by clicking on the green button on your project repository page on GitHub. Note that due to new department changes you can no longer access private git resources using https and a username and password. You will need to use either [an access token](https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line) or [SSH](https://help.github.com/en/github/authenticating-to-github/adding-a-new-ssh-key-to-your-github-account).

## Project commands

Once your environment is configured you need to further prepare the project's tooling and dependencies.
In the project folder:

1. `pnpm install` to download the packages specified in your project's *package.json* to the *node_modules* directory.

2. `pnpm build` to type-check your project. `pnpm test` and `pnpm start` run your TypeScript directly, so this is a check rather than a required step; run it before you submit and whenever the editor shows type errors you want to see all at once.

3. `pnpm test` to run the test suite.
 
4. `pnpm test:cover` to run the test suite and generate a coverage report.

5. `pnpm lint` to statically check your project code for errors.

6. `pnpm lint:fix` to resolve any of the lint errors that are automatically fixable.

7. `pnpm start` to run your server on port 3000 (`PORT=3100 pnpm start` for another port). It serves the files in `public/` and, once `src/browser.ts` exists, bundles it into `public/app.js` on every change.

If you are curious, some of these commands are actually shortcuts defined in [package.json -> scripts](./package.json).

## What is in the repository

- `src/server/framework/`: the REST framework from Labs 3 and 4. [FRAMEWORK.md](FRAMEWORK.md) describes it. Leave it as is.
- `src/server/service.ts`: `AppService`, the state your handlers work on, and `startService`, which builds it when the server starts. In Phase 2, put your model here.
- `src/server/routes.ts`: your handlers and the route table. It starts with one example endpoint, `GET /health`.
- `src/start.ts`: what `pnpm start` runs. Leave it as is.
- `src/result.ts`: the `Result` and `Option` types from the course. Import them from here; the project does not use `@ubccpsc/210-toolkit`.
- `public/`: files the server serves when no route matches. Your Phase 3 page goes here.
- `test/`: your tests. `health.test.ts` is an example endpoint test.

## Running and testing from an IDE

The project should work properly with Visual Studio Code or WebStorm (a free download through the [JetBrains student program](https://www.jetbrains.com/community/education/#students/)).

### License

The work you perform on the project is your own. But **the project phase descriptions are considered private materials**. Please wait until the term is complete before sharing your project publicly.  

### GenAI Policy

The use of GenAI on this course project is permitted. Please see the course syllabus for complete details.
