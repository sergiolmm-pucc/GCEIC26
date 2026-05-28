const fs = require('fs');
const path = require('path');

function fixAppIndex() {
    const filePath = path.join(__dirname, 'app', 'index.js');
    const contentStr = fs.readFileSync(filePath, "utf-8");
    const lines = contentStr.split('\n');
    
    const outLines = [];
    let state = "normal"; 
    for (const line of lines) {
        if (line.startsWith("<<<<<<< HEAD")) {
            state = "in_head";
        } else if (line.startsWith("=======")) {
            state = "in_main";
        } else if (line.startsWith(">>>>>>> main")) {
            state = "normal";
        } else {
            if (state === "normal" || state === "in_main") {
                outLines.push(line);
            }
        }
    }
    
    let content = outLines.join('\n');
    
    const staticServing = `
// ── Grupo 64 — ETEC64 ──
const ETEC64_PATH = '/equipe-64';
const etec64DistPath = path.join(__dirname, 'views', 'etec64', 'dist');
app.use(ETEC64_PATH, express.static(etec64DistPath));
app.get(/^\\/equipe-64(?:\\/.*)?$/, (_req, res) => {
  res.sendFile(path.join(etec64DistPath, 'index.html'));
});

`;
    content = content.replace("module.exports = app;", staticServing + "module.exports = app;");
    
    content = content.replace(
        "{ numero: 25, nome: 'Equipe-25',   rota: '/equipe-25' },",
        "{ numero: 25, nome: 'Equipe-25',   rota: '/equipe-25' },\n  { numero: 64, nome: 'ETEC64', rota: '/equipe-64' },"
    );
    
    fs.writeFileSync(filePath, content, "utf-8");
}

fixAppIndex();
