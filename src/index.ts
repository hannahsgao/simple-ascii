import { Jimp } from "jimp";

console.log("[boot] starting ascii app");

const PALETTE = " .:?=%#@";
// " .:?=%#@"
// " .:o=e=k=P#"
const ASPECT = 2;

function luminance(r: number, g: number, b: number) {
// Perceived brightness (sRGB luma): returns 0..255
return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function mapToChar(l: number) {
    const step = Math.floor(l/(255/PALETTE.length));
    return PALETTE[step];
}

async function main() {
    console.log("bruh");
    const imagePath= "src/images/" + String(process.argv[2]);
    const targetWidth = 80;

    if (!imagePath) {
        console.error("Usage: npx ts-node src/index.ts <imagePath> [width]");
        process.exit(1);
    }

    const img = await Jimp.read(imagePath);
    const w = targetWidth;
    const h = Math.floor((targetWidth/img.bitmap.width) * img.bitmap.height);
    img.resize({w, h});

    const { width, height, data } = img.bitmap; 

    let lines: string[] = [];
    for (let y = 0; y < h; y++) {
        let line = "";
        for (let x = 0; x < w; x++) {
            const i = (y * width + x) * 4; 
            const r = data[i + 0],
            g = data[i + 1],
            b = data[i + 2];
            const L = luminance(r, g, b);
            for (let i = 0; i < ASPECT; i++) {
                line += mapToChar(L);
            }
        }
        lines.push(line);
    }

    console.log(lines.join('\n'));
}

main().catch((e) => {
console.error(e);
process.exit(1);
});