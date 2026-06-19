export function convertToWebp(file, quality = 0.75) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) return resolve(file);
    if (file.type === "image/webp") return resolve(file);
    if (file.size > 20 * 1024 * 1024) return resolve(file);

    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(blob => {
        if (!blob) return reject(new Error("Error al convertir a WebP"));
        const webpFile = new File(
          [blob],
          file.name.replace(/\.[^.]+$/, ".webp"),
          { type: "image/webp" }
        );
        resolve(webpFile);
      }, "image/webp", quality);
    };
    img.onerror = () => reject(new Error("Error al cargar la imagen"));
    img.src = URL.createObjectURL(file);
  });
}