# Creating Plugins

You could want to create a plugin for many reasons:

- Create a way to import data
- Create a way to transform samples
- Create a way to label data (or a new data type)
- Create a way to authenticate with a service

## Create a way to import data

This will add a button and dialog to `Samples > Import`. You can customize the dialog to allow to user to import
whatever source they want.

## Create a way to transform samples

This will add a button and dialog to `Samples > Transoform`. You can customize the dialog to allow to user to transform
samples.

## Create a way to label data

This will create a new interface button under `Setup > Data Types`, a new configuration page in `Setup > Configure`, and a
new way to view samples in the `Label` page.

## Create a way to authenticate with a service

This will add a new Authentication Method on the home page of the Universal Data Tool. After the user configures the Authentication
method, it will be saved, and the authentication can be used to access samples, import data etc.

# Discoverability

[npm](https://npmjs.org) is automatically scanned for packages that start with "udt-", so a package like "udt-transform-delete-samples" would be
automatically discovered. If the package is valid, it will be automatically available under the "Community Plugins" in the appropriate locations in the
Universal Data Tool.
