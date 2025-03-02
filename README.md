# Stencil `jsxImportSource` trial

Patches files in `node_modules/@stencil/core` to experiment with using `jsxImportSource`.

It _almost_ works (the app runs fine), but some things are missing when
`jsxImportSource` is used instead of `jsxFactory`, and need to be ironed out:

- [ ] JSX `key` values end up as DOM attributes instead of `vnode.$key$`.
  - `BUILD.vdomKey` is `false` instead of `true` when using `jsxImportSource`
    for some reason.
- [ ] JSX `ref` is not working.

To run, use

```bash
npm start
```

which will `rm -rf .stencil www/build` to ensure any changes inside
`node_modules/@stencil/core` are included in the build (or the cache gets
stale).
