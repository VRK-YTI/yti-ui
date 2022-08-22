# Unit testing

Frequently asked questions about unit testings have been collected here.

## TypeError: window.matchMedia is not a function

Just add `import '@app/tests/matchMedia.mock';` at the beginning of your test
file. It is already used in some files so just find examples from code.
