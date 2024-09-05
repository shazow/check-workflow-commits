# check-workflow-commits

Find sneaky pinned commits in Github action workflow files that don't match the stated namespace.

Pass in workflow yaml files as stdin, find `uses:` strings with hashes in them and checks if they exist in the claimed repo.
Returns non-zero code on failure.

Example:

```shell
$ ./check-workflow-commits.sh < .github/workflows/publish.yml
$ $? && echo "Everything is okay" || "Things are bad"
```

Quick and dirty way to add it as a Github workflow lint:

```yml
name: Lint
on: pull_request
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@692973e3d937129bcbf40652eb9f2f61becf3332 # v4.1.7
    - name: Check workflow pinned commits
      run: |
         cat .github/workflows/*.yml | bash <(curl -sSL "https://raw.githubusercontent.com/shazow/check-workflow-commits/main/check-workflow-commits")
```

## TODO

- [ ] Make this into an action that can be included in a workflow as a lint.
- [ ] Rewrite in a proper language that does YAML parsing instead of regexp.

## License

MIT
