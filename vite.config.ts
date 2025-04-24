import { defineConfig } from 'vite';

export default defineConfig({
    esbuild: {
        target: 'node18',  // Ou a versão do Node que tu tá usando
        loader: 'ts'
    },
    build: {
        rollupOptions: {
            output: {
                format: 'cjs', // Faz o bundle em formato CJS (CommonJS)
                preserveModules: true, // Preserva a estrutura de módulos
                preserveModulesRoot: 'src', // Preserva a estrutura de módulos
                entryFileNames: '[name].cjs', // Nome do arquivo de saída
            },
            external: [/node_modules/], // Exclui node_modules do bundle
        },
        target: 'node18',  // Ou a versão do Node que tu tá usando
        outDir: 'dist',    // Onde vai ficar o output
        lib: {
            entry: './src/http/server.ts', // O ponto de entrada do teu app
            formats: ['cjs'],  // Faz o bundle em formato CJS (CommonJS)
        },
        sourcemap: true, // Pra debugar fácil (opcional)
        ssr: './src/http/server.ts', // O ponto de entrada do teu app
    },
    resolve: {
        extensions: ['.ts', '.js'], // Adiciona suporte a .ts
    },
});
