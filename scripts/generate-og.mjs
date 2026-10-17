import fs from "node:fs/promises";
import path from "node:path";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

const ROOT = process.cwd();
const DIST = path.join(ROOT, "dist");
const OG_DIR = path.join(DIST, "og");

const WIDTH = 1200;
const HEIGHT = 630;

const FONT_DIR = path.join(
  ROOT,
  "node_modules",
  "@fontsource",
  "roboto",
  "files",
);

async function loadFont(filename) {
  const buffer = await fs.readFile(path.join(FONT_DIR, filename));

  return buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength,
  );
}

async function findHtmlFiles(directory) {
  const entries = await fs.readdir(directory, {
    withFileTypes: true,
  });

  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await findHtmlFiles(fullPath)));
    } else if (entry.name.endsWith(".html")) {
      files.push(fullPath);
    }
  }

  return files;
}

function getPageUrl(file) {
  const relative = path.relative(DIST, file);

  if (relative === "index.html") {
    return "/";
  }

  if (relative.endsWith("/index.html")) {
    return "/" + relative.replace(/\/index\.html$/, "").replaceAll("\\", "/");
  }

  return "/" + relative.replace(/\.html$/, "").replaceAll("\\", "/");
}

function decodeHtmlEntities(text) {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) =>
      String.fromCodePoint(parseInt(code, 16)),
    );
}

function getMetadata(html) {
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);

  const descriptionMatch =
    html.match(
      /<meta\b[^>]*\bname=["']description["'][^>]*\bcontent="([^"]*)"/i,
    ) ??
    html.match(
      /<meta\b[^>]*\bcontent="([^"]*)"[^>]*\bname=["']description["']/i,
    );

  const title = decodeHtmlEntities(
    titleMatch?.[1]?.replace(/<[^>]+>/g, "").trim() ?? "SparksLyse",
  );

  const description = decodeHtmlEntities(descriptionMatch?.[1]?.trim() ?? "");

  return {
    title,
    description,
  };
}

function slugify(url) {
  if (url === "/") {
    return "home";
  }

  return url
    .replace(/^\/|\/$/g, "")
    .replaceAll("/", "-")
    .replace(/[^a-zA-Z0-9-_]/g, "-");
}

async function generateImage({
  title,
  description,
  url,
  regularFont,
  boldFont,
}) {
  const svg = await satori(
    {
      type: "div",

      props: {
        style: {
          width: `${WIDTH}px`,
          height: `${HEIGHT}px`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px",
          background: "linear-gradient(135deg, #080812, #10102a, #080812)",
          color: "white",
          fontFamily: "Roboto",
          position: "relative",
          overflow: "hidden",
        },

        children: [
          {
            type: "div",
            props: {
              style: {
                fontSize: "32px",
                fontWeight: 700,
              },
              children: "SPARKSLYSE",
            },
          },

          {
            type: "div",
            props: {
              style: {
                display: "flex",
                flexDirection: "column",
                gap: "18px",
                width: "100%",
                maxWidth: "1000px",
              },

              children: [
                {
                  type: "div",
                  props: {
                    style: {
                      fontSize: title.length > 30 ? "52px" : "68px",
                      fontWeight: 700,
                      lineHeight: 1.05,
                    },
                    children: title,
                  },
                },

                description
                  ? {
                      type: "div",
                      props: {
                        style: {
                          display: "flex",
                          width: "900px",
                          fontSize: "28px",
                          lineHeight: 1.4,
                          color: "#a1a1aa",
                        },
                        children: description,
                      },
                    }
                  : null,
              ],
            },
          },

          {
            type: "div",
            props: {
              style: {
                display: "flex",
                justifyContent: "center",
                fontSize: "30px",
                fontWeight: 700,
                background: "#10102a",
                padding: "10px",
                textAlign: "center",
                border: "1px solid #fff",
                borderRadius: "10px"
              },
              children: `${url.startsWith("/en/") ? "TRY FREE" : "ESSAYER GRATUITEMENT"}`,
            },
          },

          {
            type: "div",
            props: {
              style: {
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                fontSize: "22px",
                color: "#71717a",
              },

              children: [
                {
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                    },
                    children: `sparkslyse-community.github.io${url}`,
                  },
                },

                /* {
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                    },
                    children: "2026",
                  },
                }, */
              ],
            },
          },
        ],
      },
    },

    {
      width: WIDTH,
      height: HEIGHT,

      fonts: [
        {
          name: "Roboto",
          data: regularFont,
          weight: 400,
        },
        {
          name: "Roboto",
          data: boldFont,
          weight: 700,
        },
      ],
    },
  );

  return new Resvg(svg).render().asPng();
}

async function main() {
  console.log("Generating OpenGraph images...");

  await fs.mkdir(OG_DIR, {
    recursive: true,
  });

  const regularFont = await loadFont("roboto-latin-400-normal.woff");

  const boldFont = await loadFont("roboto-latin-700-normal.woff");

  const htmlFiles = await findHtmlFiles(DIST);

  for (const file of htmlFiles) {
    const url = getPageUrl(file);

    if (url.startsWith("/og")) {
      //  || url.startsWith("/404")
      continue;
    }

    const html = await fs.readFile(file, "utf8");

    const metadata = getMetadata(html);

    const png = await generateImage({
      ...metadata,
      url,
      regularFont,
      boldFont,
    });

    const filename = `${slugify(url)}.png`;

    const output = path.join(OG_DIR, filename);

    await fs.writeFile(output, png);

    console.log(`  ✓ ${url} → /og/${filename}`);
  }

  console.log("OpenGraph generation complete.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
