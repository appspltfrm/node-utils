console.log("Hello from TS!");
const args = process.argv.slice(2);
if (args.length > 0) {
    console.log("Arguments:", JSON.stringify(args));
}
