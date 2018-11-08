try {
    console.log(require.resolve("webpack"));
} catch (e) {
    console.error("Webpack is not found");
    process.exit(e.code);
}
