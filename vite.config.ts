import { resolve } from 'path';
import { defineConfig, normalizePath } from 'vite';
import { glob } from 'glob';

// Get project root (consistent way)
const projectRoot = resolve(__dirname);

// Find all HTML files: root index.html and those under src/pages
const htmlFiles = glob.sync(['index.html', 'src/pages/**/*.html'], {
    cwd: projectRoot, // Search relative to project root
    absolute: true,   // Get absolute paths first
});

// Create the input object for Rollup
const input = htmlFiles.reduce((acc, absolutePath) => {
    // Normalize the absolute path to use forward slashes
    const normalizedAbsolutePath = normalizePath(absolutePath);

    // Get the path relative to the project root
    const relativePath = normalizedAbsolutePath.replace(normalizePath(projectRoot) + '/', '');

    let key = relativePath.replace('.html', '');

    if (key === 'index') {
        key = 'main';
    }
    else if (key.startsWith('src/')) {
         key = key.substring(4);
    }

    acc[key] = absolutePath; // Use the *original absolute path* as the value
    return acc;
}, {});

export default defineConfig({
    base: '/historia_mapasmentales/', // Use relative paths - often works well for simple static sites
    root: projectRoot,

    build: {
        rollupOptions: {
            input: input, // Pass the dynamically generated input object
        },

    },
});