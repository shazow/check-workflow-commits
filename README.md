# check-workflow-commits

Find sneaky pinned commits in Github action workflow files that don't match the stated namespace.

Pass in workflow yaml files as stdin, find `uses:` strings with hashes in them and checks if they exist in the claimed repo.
Returns non-zero code on failure.

Example:

```shell
$ ./check-workflow-commits.sh < .github/workflows/publish.yml
$ $? && echo "Everything is okay" || "Things are bad"
```

## TODO

- [ ] Make this into an action that can be included in a workflow as a lint.

## License

MIT
