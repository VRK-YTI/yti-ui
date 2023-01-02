# YTI UI monorepo

This is a monorepo for all the 'v2' UI projects for YTI.
The purpose of the monorepo is to make it easier to share a common component library with all the UI projects.

## Troubleshooting and documentation

Documentation and common troubleshooting problems can be found in the [docs](./docs/)

## Directories

The top level directory (where this README is located) contains git files, some IDE settings and package.json and package-lock.json that are shared between projects found in package.json. The docs folder is as explained above.

The [common-ui](./common-ui/) folder is the common component library. Read the [common-ui README](./common-ui/README.md) on how to use this in the other projects. The common-ui folder should only contain components that will be used in multiple different projects

The following directories are UI projects for various different YTI services:

- [terminology-ui](./terminology-ui/)
- [datamodel-ui](./datamodel-ui/)

These UI projects

## READMES

If you want specific information on how to run/use the different projects please the README.md files within each project folder

- [common-ui](./common-ui/README.md)
- [terminology-ui](./terminology-ui/README.md)
- [datamodel-ui](./datamodel-ui/README.md)
