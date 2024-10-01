import { URL } from "url";
import { readFile } from "fs/promises";

/**
 * This function loads the content of files ending with ".css" to an ECMAScript Module
 * so the default export is a string containing the CSS stylesheet.
 */
export async function load(url, context, defaultLoad) {
    if (url.endsWith(".css")) {
        const content = await readFile(new URL(url));

        return {
            format: "module",
            source: `export default ${JSON.stringify(content.toString())};`,
            shortCircuit: true,
        }
    }

    return defaultLoad(url, context, defaultLoad);
}