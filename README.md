# ionic-version [![Build Status](https://travis-ci.org/stovmascript/ionic-version.svg?branch=master)](https://travis-ci.org/stovmascript/ionic-version)

Seamlessly shadows the behaviour of [`npm version`](https://docs.npmjs.com/cli/version).

---

## npm-scripts hook (automatic method)

### Setup

```bash
$ npm install ionic-version --save
# or
$ yarn add ionic-version
```

Hook into the "version" or "postversion" npm script in your app's package.json:

```js
{
	"name": "myApp",
	"version": "0.0.1",
	"author": "Ionic Framework",
	"homepage": "http://ionicframework.com/",
	"private": true,
	"scripts": {
		"clean": "ionic-app-scripts clean",
		"build": "ionic-app-scripts build",
		"lint": "ionic-app-scripts lint",
		"ionic:build": "ionic-app-scripts build",
		"ionic:serve": "ionic-app-scripts serve",
		"postversion": "ionic-version"
	},
	// ...
}
```

### Usage

Before you publish a new build of your app, run `npm version <newversion>`.

ionic-version will then update your `config.xml` and thus your `platforms/` code during build. Depending on the script and options you choose, it can also automatically amend the version bump commit and update the Git tag created by `npm version`. This method should be useful in most cases. If you need more control, take a look at the CLI and options below.

## CLI

### Setup

```bash
$ npm install -g ionic-version
# or
$ yarn global add ionic-version
```

### Example usage

```bash
cd myApp/
npm version patch
ionic-version
```

## Options

```
-V, --version      output the version number
-a, --amend        Amend the previous commit. Also updates the latest Git tag to point to the amended commit. This is done automatically when ionic-version is run from the "version" or "postversion" npm script. Use "--never-amend" if you never want to amend.
--skip-tag         For use with "--amend", if you don't want to update Git tags.
-A, --never-amend  Never amend the previous commit.
-q, --quiet        Be quiet, only report errors.
-h, --help         output usage information
```

You can apply these options to the "version" or "postversion" script too. If for example you want to commit the changes made by ionic-version yourself, add the "--never-amend" option:

```js
{
	// ...
	"scripts": {
		"postversion": "ionic-version --never-amend"
	},
	// ...
}
```

## API

```javascript
import version from 'ionic-version';

async function doSomething() {
	const versionResult = await version({
		amend: true,
		// ...
	});
}

// or

version({
	amend: true,
	// ...
})
.then(commitHash => {
	console.log(commitHash);
})
.catch(err => {
	console.error(err);
});
```

### Functions

<dl>
<dt><a href="#version">version(program, projectPath)</a> ⇒ <code>Promise.&lt;(string|Error)&gt;</code></dt>
<dd><p>Versions your app</p>
</dd>
</dl>

### Typedefs

<dl>
<dt><a href="#Promise">Promise</a></dt>
<dd><p>Custom type definition for Promises</p>
</dd>
</dl>

<a name="version"></a>

#### version(program, projectPath) ⇒ <code>Promise.&lt;(string\|Error)&gt;</code>
Versions your app

**Kind**: global function  
**Returns**: <code>Promise.&lt;(string\|Error)&gt;</code> - A promise which resolves with the last commit hash  

| Param | Type | Description |
| --- | --- | --- |
| program | <code>Object</code> | commander/CLI-style options, camelCased |
| projectPath | <code>string</code> | Path to your Ionic project |

<a name="Promise"></a>

#### Promise
Custom type definition for Promises

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| result | <code>\*</code> | See the implementing function for the resolve type and description |
| result | <code>Error</code> | Rejection error object |

## See also

- [npm-version](https://docs.npmjs.com/cli/version)
- [Semantic Versioning (semver)](http://semver.org/)
