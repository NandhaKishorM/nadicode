# Jan Model Management plugin

Created using Jan app example

# Create a Jan Plugin using Typescript

Use this template to bootstrap the creation of a TypeScript Jan plugin. 🚀

## Create Your Own Plugin

To create your own plugin, you can use this repository as a template! Just follow the below instructions:

1. Click the Use this template button at the top of the repository
2. Select Create a new repository
3. Select an owner and name for your new repository
4. Click Create repository
5. Clone your new repository

## Initial Setup

After you've cloned the repository to your local machine or codespace, you'll need to perform some initial setup steps before you can develop your plugin.

> [!NOTE]
>
> You'll need to have a reasonably modern version of
> [Node.js](https://nodejs.org) handy. If you are using a version manager like
> [`nodenv`](https://github.com/nodenv/nodenv) or
> [`nvm`](https://github.com/nvm-sh/nvm), you can run `nodenv install` in the
> root of your repository to install the version specified in
> [`package.json`](./package.json). Otherwise, 20.x or later should work!

1. :hammer_and_wrench: Install the dependencies

   ```bash
   npm install
   ```

1. :building_construction: Package the TypeScript for distribution

   ```bash
   npm run bundle
   ```

1. :white_check_mark: Check your artifact

   There will be a tgz file in your plugin directory now

## Update the Plugin Metadata

The [`package.json`](package.json) file defines metadata about your plugin, such as
plugin name, main entry, description and version.

When you copy this repository, update `package.json` with the name, description for your plugin.

## Update the Plugin Code

The [`src/`](./src/) directory is the heart of your plugin! This contains the
source code that will be run when your plugin extension functions are invoked. You can replace the
contents of this directory with your own code.

There are a few things to keep in mind when writing your plugin code:

- Most Jan Plugin Extension functions are processed asynchronously.
  In `index.ts`, you will see that the extension function will return a `Promise<any>`.

  ```typescript
  import { core } from "@janhq/core";

  function onStart(): Promise<any> {
    return core.invokePluginFunc(MODULE_PATH, "run", 0);
  }
  ```

  For more information about the Jan Plugin Core module, see the
  [documentation](https://github.com/janhq/jan/blob/main/core/README.md).

So, what are you waiting for? Go ahead and start customizing your plugin!

