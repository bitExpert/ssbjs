require('dts-generator').default({
    name: 'ssbjs',
    project: __dirname,
    out: __dirname + '/src/ssb.d.ts'
});
