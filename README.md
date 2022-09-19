# Welcome to markdown-header

[![](https://badgen.net/github/release/sguerri/vscode-markdown-header)](https://github.com/sguerri/vscode-markdown-header/releases/)
[![](https://img.shields.io/github/workflow/status/sguerri/vscode-markdown-header/Build/v0.1.0)](https://github.com/sguerri/vscode-markdown-header/actions/workflows/build.yml)
[![](https://badgen.net/github/license/sguerri/vscode-markdown-header)](https://www.gnu.org/licenses/)
[![](https://badgen.net/badge/Open%20Source%20%3F/Yes%21/blue?icon=github)](#)

> Markdown YAML header editor for vscodium and vscode

This is an extension for [vscodium](https://vscodium.com/) and [vscode](https://code.visualstudio.com/).

For markdown files having a YAML header, it displays a sidebar with header details.

I will enhance the extension as per my daily usage or others' feedbacks.

**Main features**
* Display header items by type
* Add a YAML header if not existing
* Add / Remove header item
* Update value depending the header type
* Choice selection per header item as per global / project settings
* Switch boolean value true <-> false

**Roadmap**
* See [TODO](https://github.com/sguerri/vscode-markdown-header/blob/main/TODO)

---

- [Welcome to markdown-header](#welcome-to-markdown-header)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Create Header](#create-header)
    - [Add item](#add-item)
    - [Remove item](#remove-item)
    - [Update item](#update-item)
    - [Specific updates](#specific-updates)
  - [Settings](#settings)
  - [Dependencies](#dependencies)
  - [Author](#author)
  - [Issues](#issues)
  - [License](#license)

## Installation

Download latest vsix file in the [releases](https://github.com/sguerri/vscode-markdown-header/releases) section.

Go to `Extensions > Install from VSIX...` and select downloaded file.

## Usage

### Create Header

If no header is detected, this action adds a new YAML header at top of the file.

The file is parsed. If it has a title (`# ...` format), it will be added to `title` header item. Otherwise filename will be added as `title`.

If option `markdownHeader.initWithId` is set to `true`, a random id will be generated.

### Add item

The <kbd>+</kbd> button creates a new header item.

An item cannot be created for an already existing key.

Item value will be parsed as :
 - string (default)
 - boolean (if `true` of `false` is entered)
 - integer (if `parseInt` is no error)

### Remove item

Right click on a header item to remove it. Confirmation will be asked.

`title` header cannot be removed through the extension.

### Update item

A button `Change value` is available to modify an item value.

Data to be entered will have to be complient with previous value type.

**Case of boolean**

Nothing will be prompted. The boolean value switches to reversed value.

**Case of title**

Title cannot be manually modified through the extension. However, if you modify the actual file title (`# ...`), it is possible to update the value in header by using the `Update from markdown context` button.

**Case of date**

If the item key is `date`, a date will be asked.

### Specific updates

It is possible to create specific rules for input validation, by updating the global or project `settings.json` file.

**Several choices**

By adding an array of strings to the `markdownHeader.choices` object, selection of one of these items will be asked instead of free input.

Example, for the header item with key `test`, the settings can be:
```json
{
	"markdownHeader.choices": {
		"test": [ "option1","option2", "option3" ]
	}
}
```

**Minimum or maximum value of interger**

By adding a specific object to the `markdownHeader.choices` object, the input of an integer can be restrained to a specific range.

Example, for the header item with key `test`, the settings can be:
```json
{
	"markdownHeader.choices": {
		"test": {
			"min": 1,
			"max": 10
		}
	}
}
```

Either `min`, `max` or both options can be defined.

## Settings

|||
|:--|:--|
|`markdownHeader.autorefresh`|If `true`, header details will automatically update while file modifications|
|`markdownHeader.initWithId`|If `true`, when creating a new YAML header a random id field will be added|
|`markdownHeader.choices`|See the [Specific updates](#specific-updates) section|

## Dependencies

- [yaml](https://www.npmjs.com/package/yaml)
- [vscode-icons](https://github.com/microsoft/vscode-icons)

## Author

Sébastien Guerri - [github page](https://github.com/sguerri)

## Issues

Contributions, issues and feature requests are welcome!

Feel free to check [issues page](https://github.com/sguerri/vscode-markdown-header/issues). You can also contact me.

## License

Copyright (C) 2022 Sebastien Guerri

markdown-header is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or any later version.

markdown-header is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with markdown-header. If not, see <https://www.gnu.org/licenses/>.