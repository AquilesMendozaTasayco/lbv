import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";
import { getFirestore } from "firebase-admin/firestore";
import sharp from "sharp";
import path from "path";
import fs from "fs/promises";
import os from "os";
import { fileURLToPath } from "url";
import { v4 as uuid } from "uuid";

/* ── Config ───────────────────────────────────────────── */
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SERVICE_ACCOUNT = path.join(__dirname, "service-account.json");
const QUALITY = 75;
const DOWNLOAD_DIR = path.join(os.tmpdir(), "lbv-webp-migration");
const CONCURRENCY = 5;

const COLLECTIONS = [
  { name: "equipo",     fields: ["foto"] },
  { name: "noticias",   fields: ["imagen"] },
  { name: "publicaciones", fields: ["imagen"] },
  { name: "servicios",  fields: ["imagen"] },
  { name: "banners",    fields: ["imagen"] },
];

let totalConverted = 0;
let totalSkipped = 0;
let totalFailed = 0;

/* ── Init Firebase Admin ──────────────────────────────── */
function initFirebase() {
  if (getApps().length) return;
  initializeApp({ credential: cert(SERVICE_ACCOUNT), storageBucket: "lbv-web.firebasestorage.app" });
}

/* ── Helpers ──────────────────────────────────────────── */
function isWebp(url) {
  return url.toLowerCase().endsWith(".webp") || url.includes(".webp?");
}

async function ensureDir(p) {
  await fs.mkdir(p, { recursive: true });
}

async function downloadFile(url, dest) {
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  const buf = Buffer.from(await resp.arrayBuffer());
  await fs.writeFile(dest, buf);
  return buf;
}

async function convertToWebp(inputPath, outputPath) {
  await sharp(inputPath).webp({ quality: QUALITY }).toFile(outputPath);
}

/* ── Process a single image ───────────────────────────── */
async function processImage(docId, fieldName, currentUrl, collectionName, bucket) {
  if (!currentUrl || isWebp(currentUrl)) {
    totalSkipped++;
    return null;
  }

  const tmpId = uuid();
  const inputPath = path.join(DOWNLOAD_DIR, `${tmpId}_input`);
  const outputPath = path.join(DOWNLOAD_DIR, `${tmpId}.webp`);

  try {
    /* download */
    await downloadFile(currentUrl, inputPath);

    /* convert */
    await convertToWebp(inputPath, outputPath);
    const webpBuf = await fs.readFile(outputPath);

    /* upload to storage */
    const destPath = `${collectionName}/${docId}_${fieldName}_${Date.now()}.webp`;
    const file = bucket.file(destPath);
    await file.save(webpBuf, {
      metadata: { contentType: "image/webp", cacheControl: "public, max-age=31536000" },
    });
    await file.makePublic();

    const newUrl = `https://storage.googleapis.com/lbv-web.firebasestorage.app/${destPath}`;
    totalConverted++;
    console.log(`✅ [${collectionName}/${docId}] ${fieldName} → WebP (${(webpBuf.length / 1024).toFixed(1)} KB)`);
    return newUrl;
  } catch (err) {
    totalFailed++;
    console.error(`❌ [${collectionName}/${docId}] ${fieldName}: ${err.message}`);
    return null;
  } finally {
    await fs.unlink(inputPath).catch(() => {});
    await fs.unlink(outputPath).catch(() => {});
  }
}

/* ── Process a single document ────────────────────────── */
async function processDoc(doc, collectionName, bucket, db) {
  const data = doc.data();
  const updates = {};

  for (const field of COLLECTIONS.find(c => c.name === collectionName).fields) {
    const url = data[field];
    if (!url) continue;
    const newUrl = await processImage(doc.id, field, url, collectionName, bucket);
    if (newUrl) updates[field] = newUrl;
  }

  if (Object.keys(updates).length > 0) {
    await db.collection(collectionName).doc(doc.id).update(updates);
  }
}

/* ── Process a collection ─────────────────────────────── */
async function processCollection(collectionName, bucket, db) {
  console.log(`\n📁 Colección: ${collectionName}`);
  const snap = await db.collection(collectionName).get();
  const docs = snap.docs.filter(d => {
    const data = d.data();
    return COLLECTIONS.find(c => c.name === collectionName).fields.some(f => data[f] && !isWebp(data[f]));
  });

  if (docs.length === 0) {
    console.log(`   Sin imágenes para convertir.`);
    return;
  }

  console.log(`   ${docs.length} documento(s) con imágenes por procesar`);

  /* process in batches for concurrency */
  for (let i = 0; i < docs.length; i += CONCURRENCY) {
    const batch = docs.slice(i, i + CONCURRENCY);
    await Promise.all(batch.map(doc => processDoc(doc, collectionName, bucket, db)));
  }
}

/* ── Main ──────────────────────────────────────────────── */
async function main() {
  console.log("🚀 Iniciando migración de imágenes a WebP\n");

  await ensureDir(DOWNLOAD_DIR);
  initFirebase();

  const bucket = getStorage().bucket();
  const db = getFirestore();

  for (const { name } of COLLECTIONS) {
    await processCollection(name, bucket, db);
  }

  /* cleanup */
  await fs.rm(DOWNLOAD_DIR, { recursive: true, force: true }).catch(() => {});

  console.log("\n═══════════════════════════════════════");
  console.log(`📊 Resumen:`);
  console.log(`   ✅ Convertidas: ${totalConverted}`);
  console.log(`   ⏭️  Saltadas (ya WebP): ${totalSkipped}`);
  console.log(`   ❌ Fallidas: ${totalFailed}`);
  console.log("═══════════════════════════════════════\n");
}

main().catch(console.error);
