# Webpack Demo

## About

Webpack is a static module bundler for JavaScript applications. It builds a dependency graph mapping modules in your project and generates one or more bundles.

There are 6 Core Concepts in Webpack to understand.

## The 6 Core Concepts

### Entry

The entry point indicates which module Webpack should use to begin building its dependency graph. It will then figure out which other modules it depends on (directly or indirectly).

By default the value is ./src/index.js, but different entry points can be set by setting an entry property in the config file. For example:

```javascript
module.exports = {
  entry: './path/to/my/entry/file.js'
};
```

### Output

The output property indicates where to emit the bundles it creates and how to name these files. It defaults to ./dist/main.js for the main output file and to the ./dist folder for any other generated file, though this can be configured by specifying an output field in your configuration. For example:

```javascript
const path = require('path');

module.exports = {
  entry: './path/to/my/entry/file.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'my-first-webpack.bundle.js'
  }
};
```

This should be relatively straightforward to understand, a directory path is specified to place the output file in, and a filename is defined. The path module imported at the top allows us to use methods such as resolve() and constants such as __dirname.

### Loaders

Out of the box, webpack only understands JavaScript and JSON files. Loaders allow webpack to process other types of files and convert them into modules that can be consumed by your application.

Loaders have two main properties in a webpack configuration:

* The test property identifies the file type to be transformed.
* The use property identifies the loader that should be used to transform.

```javascript
const path = require('path');

module.exports = {
  output: {
    filename: 'my-first-webpack.bundle.js'
  },
  module: {
    rules: [
      { test: /\.txt$/, use: 'raw-loader' }
    ]
  }
};
```

### Plugins

Loaders transform certain types of modules, and plugins can perform a wider range of tasks such as bundle optimization, asset management and environment variable injection.

To use a plugin, you need to require() it and add it to the plugins array. use the new operator to create an instance of each plugin.

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin'); //installed via npm

const webpack = require('webpack'); //to access built-in plugins

module.exports = {
  module: {
    rules: [
      { test: /\.txt$/, use: 'raw-loader' }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({template: './src/index.html'})
  ]
};
```

### Mode

The mode parameter can be set to development, production or none in order to enable webpack’s built-in optimizations that correspond to each environment. Default is production.

### Browser Compatibility

Webpack supports all browsers that are ES5-compliant. It also needs Promise for import() and require.ensure().

## Getting Started

### Basic Setup

First I created a typical npm project, with two main files inside - index.html and src/index.js. The project structure looks like this:

![Directory](docs/images/image1.png "Project Structure")

* My guess for why index.html is outside is because it’s used as a template file, rather than a javascript source file. index.js is what webpack will really be working with to create the bundles.
* The text for each of the files will be displayed here:

`index.js`

```javascript
function component() {
  const element = document.createElement('div');
  // Lodash, currently included via a script, is required for this line to work
  element.innerHTML = _.join(['Hello', 'webpack'], ' ');

  return element;
}

document.body.appendChild(component());
```

`index.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Getting Started</title>
    <script src="https://unpkg.com/lodash@4.16.6"></script>
</head>
<body>
    <script src="./src/index.js"></script>
</body>
</html>
```

`package.json`

```json
{
  "name": "webpack-demo",
  "version": "1.0.0",
  "description": "",
  "private": true,
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "webpack": "^4.41.5",
    "webpack-cli": "^3.3.10"
  },
  "dependencies": {
    "lodash": "^4.17.15"
  }
}
```

Running this will work, but it’s not ideal, as it doesn’t follow the law of separation of concerns (lodash is being imported in the html file, rather than in index.js) and index.js is just assuming that there’s a global variable in the state, which is very dangerous.

### Creating a Bundle

The next step is to make sure that index.js is able to have all its requirements stated in its own file, rather than relying on some global variable that’s just polluting the workspace. The project structure is also going to be tweaked a little.

#### The dist/ folder

This folder will be created in order to place all the code that will be distributed to production. index.html will be placed here, and its code tweaked to remove the lodash import, and to change the imported script from index.js to main.js, which will be outputted by webpack.

The new directory structure will look like this:

![Directory](docs/images/image2.png "Project Structure")

#### Import bundle

Next, lodash will be installed via npm as a module, and placed into dependencies. index.js will then have an import statement at the top in order to use its functionalities.

`src/index.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Getting Started</title>
</head>
<body>
    <script src="main.js"></script>
</body>
</html>
```

`index.js`

```javascript
import _ from 'lodash';

function component() {
  const element = document.createElement('div');

  element.innerHTML = _.join(['Hello', 'webpack'], ' ');

  return element;
}

document.body.appendChild(component());
```

### Modules

Be aware that Webpack will only alter import and export statements out of the box. If you want to use other ES2015 features, a transpiler such as Babel should be used as a loader.

### Using a Configuration

Out of the box, webpack doesn’t need configuration. However, when you start using more complex features, a configuration file may be needed. To do this, a new file called webpack.config.js is created at the root directory:

![Directory](docs/images/image3.png "Project Structure")

`webpack.config.js`

```javascript
const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist')
    }
};
```

You can then run it using `npx webpack --config webpack.config.js`

A note about this: the --config webpack.config.js flag is not actually needed in this specific case as webpack.config.js is the default config file name that webpack will look for.

### NPM Scripts

To create a shortcut, we can edit package.json to use a script:

`package.json`

```json
{
  "name": "webpack-demo",
  "version": "1.0.0",
  "description": "",
  "private": true,
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "webpack"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "webpack": "^4.41.5",
    "webpack-cli": "^3.3.10"
  },
  "dependencies": {
    "lodash": "^4.17.15"
  }
}
```

We can then use `npm run build` to create the distribution files.

### Conclusion

This is a basic setup of a webpack project. Next we’ll be working with assets such as images and fonts. The project now looks like this:

![Directory](docs/images/image4.png "Project Structure")

Find the link to the directory [here](https://github.com/AQUIN0S/webpack-demo/tree/5181fa17b44aade7c2ffa073e55ace209fd78b10 "Webpack Getting Started").

## Asset Management

Being able to include any other type of file, as long they have a loader, is one of the core features of Webpack. Before, front-end developers used tools like grunt and gulp to process assets and move them from /src to /dist or /build directories. However, Webpack is able to dynamically bundle all dependencies, where modules explicitly state their dependencies, so that we don't bundle modules that aren't in use.

We'll begin with adding CSS files.

### Setup

First we'll just make some changes to our project, changing the source dist file to be bundle.js, in order to be clearer about its purpose:

`dist/index.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Asset Management</title>
</head>
<body>
    <script src="bundle.js"></script>
</body>
</html>
```

`webpack.config.js`

```javascript
const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    }
};
```

### Loading CSS

In order to `import` a CSS file from within a JavaScript module, `style-loader` and `css-loader` are needed:

```bash
npm install --save-dev style-loader css-loader
```

`webpack.config.js`

```javascript
const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            }
        ]
    }
};
```

> So I believe.... that this is just specifying that when exporting a module, if a .css file is encountered in an import, then it will first need to go through the style-loader and the css-loader programs first.

This should mean that we can use `import './style.css'` in a file that depends on that styling. What I'm not entirely sure on though, is why a JavaScript file would need to import a style. I guess I'll have to just keep reading....

Let's add a new `style.css` file to our project and import it in `index.js`:

![Adding `style.css`](docs/images/image5.png "Adding style.css")

`src/style.css`

```css
.hello {
  color: red;
}
```

`src/index.js`

```javascript
import _ from 'lodash';
import './style.css';

function component() {
  const element = document.createElement('div');

  element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  element.classList.add('hello');

  return element;
}

document.body.appendChild(component());
```

Now run the build:

```bash
npm run build
```

And open up `index.html` in the browser. You'll see that the text is highlighted in red, using the css file passed to the javascript module. Note that the css file isn't referenced whatsoever in index.html.

> Note that it's also good practice to [minimise css](https://webpack.js.org/plugins/mini-css-extract-plugin/#minimizing-for-production "Minimising CSS") for better production load times.

### Loading Images

It's similar with images that you might want to use for backgrounds and icons. The loader used here is called file-loader, so we'll install that:

```bash
npm install --save-dev file-loader
```

Next we'll edit the config file to recognise image files:

`webpack.config.js`

```javascript
const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.(png|svg|jpe?g|gif)$/,
                use: [
                    'file-loader'
                ]
            }
        ]
    },
    mode: 'development'
};
```

I'm going to use an image from one of my favourite spots to add to the webpage:

![Cliff Side](docs/images/Cliffside.jpg "Lake Taupo Cliff")

`src/index.js`

```javascript
import _ from 'lodash';
import './style.css';
import Cliffside from './images/Cliffside.jpg';

function component() {
  const element = document.createElement('div');

  element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  element.classList.add('hello');

  const myImage = new Image(500, 500);
  myImage.src = Cliffside;

  const imageWrapper = document.createElement('div');
  imageWrapper.classList.add("imageWrapper");

  element.appendChild(document.createElement("br"));
  element.appendChild(imageWrapper);
  element.appendChild(myImage);

  return element;
}

document.body.appendChild(component());
```

`src/style.css`

```css
.hello {
    color: red;
}

.imageWrapper {
    width: 500px;
    height: 500px;
    background: url('./images/Lakeside.jpg') no-repeat center center;
    background-size: cover;
}
```

Also notice how in the dist/ folder, the image would have changed names to some unintelligable string. This is just a thing that happens apparently.

> The next step would be to minify and optimize any used images. [`image-webpack-loader`](https://github.com/tcoopman/image-webpack-loader "Image Webpack Loader") and [`url-loader`](https://webpack.js.org/loaders/url-loader "URL Loader") would be useful for that.

### Loading Fonts

The file and url loaders will take any file and output to the build directory, including fonts.

We can update `webpack.config.js` to handle font files then:

`webpack.config.js`

```javascript
const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.(png|svg|jpe?g|gif)$/,
                use: [
                    'file-loader'
                ]
            },
            {
                test: /\.(woff2?|eot|ttf|oft)$/,
                use: [
                    'file-loader'
                ]
            }
        ]
    },
    mode: 'development'
};
```

We then add font files to the project:

![Project Files](docs/images/image6.png "Project Files")

And edit `src/style.css` to use a font:

`src/style.css`

```css
@font-face {
    font-family: 'star-wars';
    /*
     * I initially had a format() method here - don't do that...
     */
    src: url("./assets/fonts/star_jedi/starjedi/Starjedi.ttf");
}

.hello {
    color: red;
}

.imageWrapper {
    width: 500px;
    height: 500px;
    background: url('./assets/images/Lakeside.jpg') no-repeat center center;
    background-size: cover;
}

.starWarsHeader {
    font-family: 'star-wars';
    color: black;
}
```

### Loading Data

Other useful assets are data files such as JSON, CSV, TSV and XML. JSON support is already supported out of the box, meaning `import Data from ./data.json` will work by default. CSVs, TSVs and XML can be imported using `csv-loader` and `xml-loader`.

Yeah I'll give this a go. First install these packages:

```bash
npm install --save-dev csv-loader xml-loader
```

Then add new rules to your config file to handle these new file types:

`webpack.config.js`

```javascript
const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.(png|svg|jpe?g|gif)$/,
                use: [
                    'file-loader'
                ]
            },
            {
                test: /\.(woff2?|eot|ttf|oft)$/,
                use: [
                    'file-loader'
                ]
            },
            {
                test: /\.(csv|tsv)$/,
                use: [
                    'csv-loader'
                ]
            },
            {
                test: /\.xml$/,
                use: [
                    'xml-loader'
                ]
            }
        ]
    },
    mode: 'development'
};
```

Time to add some data files:

![Project Directory](./docs/images/image7.png "Project Directory")

`/src/data.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<note>
    <to>Mary</to>
    <from>John</from>
    <heading>Reminder</heading>
    <body>Call Cindy on Tuesday</body>
</note>
```

`src/index.js`

```javascript
import _ from 'lodash';
import './style.css';
import Cliffside from './assets/images/Cliffside.jpg';
import Data from './data.xml';

function component() {
  const element = document.createElement('div');

  element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  element.classList.add('hello');

  // Adding image element
  const myImage = new Image(500, 500);
  myImage.src = Cliffside;

  // Adding generic element with an image background defined in css
  const imageWrapper = document.createElement('div');
  imageWrapper.classList.add("imageWrapper");

  // Adding font
  const starWarsHeader = document.createElement('h2');
  starWarsHeader.classList.add("starWarsHeader");
  starWarsHeader.appendChild(document.createTextNode("Testing font"));

  element.appendChild(document.createElement("br"));
  element.appendChild(imageWrapper);
  element.appendChild(myImage);
  element.appendChild(starWarsHeader);

  console.log(Data);

  return element;
}

document.body.appendChild(component());
```

### Global Assets

The neat thing about all this, is it means that you can have your directory structure grouped up in a much more intuitive way. Usually, an `/assets` folder is created that holds all your static files, however with webpack what you can do is group components that rely on each other together. Splitting it into components makes code a lot more portable. An example is shown here:

```diff
- |- /assets
+ |– /components
+ |  |– /my-component
+ |  |  |– index.jsx
+ |  |  |– index.css
+ |  |  |– icon.svg
+ |  |  |– img.png
```

Here it's shown you can split your code into components, which are closely grouped together and can be ported together.

The project structure at this point can be found [here](https://github.com/AQUIN0S/webpack-demo/tree/84c141355e50f9e59515387f735800b0564c2677 "Asset Management git repo")

### Wrapping Up

The next guide will not be using a lot of the different assets used in this chapter, so we'll just clear up some of the files now.

![New Project Structure](./docs/images/image8.png "Project Structure")

`src/index.js`

```javascript
import _ from 'lodash';

function component() {
  const element = document.createElement('div');

  element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  element.classList.add('hello');

    return element;
}

document.body.appendChild(component());

```

`webpack.config.js`

```javascript
const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    mode: 'development'
};
```

## Output Management

I'll admit I'm not fully following along with this introduction yet, as they're saying we're manually adding all our assets into `index.html`, which I guess is true, but then also `index.html` only includes the `bundle.js` script path... I guess I'll find out as we go through this what they mean.

### Preparation

First we need to setup this project a little differently from the previous section, adding a file. (And yes, from now on I'll just use diff blocks to represent the project structure):

```diff
  webpack-demo
  |- package.json
  |- webpack.config.js
  |- dist/
  |- src/
    |- index.js
+   |- print.js
  |- node_modules/
```

`src/print.js`

```javascript
function printMe() {
    console.log("I get called from print.js!");
}

export default printMe;
```

`src/index.js`

```javascript
import _ from 'lodash';
import printMe from "./print";

function component() {
  const element = document.createElement('div');
  const btn = document.createElement("button");

  element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  
  btn.appendChild(document.createTextNode("Click me and check the console!"));
  btn.onclick = printMe;

  element.appendChild(btn);

  return element;
}

document.body.appendChild(component());
```

Also need to update the `dist/index.html` file in preparation for webpack splitting entries:

`dist/index.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Output Management</title>
    <script src="./print.bundle.js"></script>
</head>
<body>
    <script src="./app.bundle.js"></script>
</body>
</html>
```

From the looks of it, `dist/index.html` is expecting webpack to spit out two bundles this time: `app.bundle.js` and `print.bundle.js`.

This will require adjusting the config:

`webpack.config.js`

```javascript
const path = require('path');

module.exports = {
    entry: {
        app: './src/index.js',
        print: './src/print.js'
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    mode: 'development'
};
```

Oh, ok I think I see what the problem is: when we run `npm run build` with this configuration, everything will work fine since two `bundle.js` files will be generated in `dist/`: `app.bundle.js` and `print.bundle.js`.

This is fine for now... but as soon as we want to add another one to the config, like `foo.bundle.js`, that does some random other function, then we'll need to edit `index.html` once again to allow it to include the new bundle. This... is not ideal.

This situation can be fixed with the `HtmlWebpackPlugin`.

### Setting up HtmlWebpackPlugin

First, install the plugin and adjust the config file:

```bash
npm install --save-dev html-webpack-plugin
```

`webpack.config.js`

```javascript
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        app: './src/index.js',
        print: './src/print.js'
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "Output Management"
        })
    ],
    mode: 'development'
};
```

Now, HtmlWebpackPlugin will generate its own `dist/index.html` file, which will overwrite the existing one we have in the `dist/` folder. This new `dist/index.html` file will dynamically add all the scripts defined in the config file each time.

### Cleaning up the `dist/` folder

There's a handy plugin to manage cleaning the `dist/` folder before each build, so that only used files are generated. This plugin is called the `clean-webpack-plugin`, so we'll install that.

```bash
npm install --save-dev clean-webpack-plugin
```

`webpack.config.js`

```javascript
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    entry: {
        app: './src/index.js',
        print: './src/print.js'
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: "Output Management"
        })
    ],
    mode: 'development'
};
```

### The Manifest

This is mostly for information - Webpack and its plugins use a manifest which keeps track of how all the modules map to the output bundles. This would be a good place to start if you're interested in working with webpack's output in other ways. Its data can be extracted into a json file using the `WebpackManifestPlugin`.

The link to the directory can be found [here](https://github.com/AQUIN0S/webpack-demo/tree/a803a8377d1873c1bef0c838490c59f112e7c6a9 "Directory structure").
