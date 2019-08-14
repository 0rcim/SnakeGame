const path = require("path");
const { exec } = require("child_process");
const project_root_dir = path.resolve(__dirname, "./");
var url = path.resolve(project_root_dir, "./index.html");
switch (process.platform) {
    case "darwin":
        exec(`open ${url}`);
        break;
    case "win32":
        exec(`start ${url}`);
        break;
    default: 
        exec(`xdg-open`, [url]);
};