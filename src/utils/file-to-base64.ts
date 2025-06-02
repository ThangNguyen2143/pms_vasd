/**
 * Nén file bất kỳ bằng gzip (browser hỗ trợ).
 */
export async function compressFileGzip(file: File): Promise<Blob> {
  if (!("CompressionStream" in window)) {
    throw new Error("CompressionStream is not supported in this browser.");
  }

  const compressedStream = file
    .stream()
    .pipeThrough(new CompressionStream("gzip"));
  const compressedBlob = await new Response(compressedStream).blob();
  return compressedBlob;
}

/**
 * Đọc blob hoặc file thành base64 string (chỉ phần mã hóa).
 */
export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = () => {
      const base64 = (reader.result as string).split(",")[1]; // chỉ lấy phần base64
      resolve(base64);
    };
    reader.onerror = reject;
  });
}

/**
 * Chuyển file thành đối tượng base64 + metadata để gửi về server.
 */
export async function prepareCompressedBase64File(file: File): Promise<{
  fileName: string;
  contentType: string;
  fileData: string;
}> {
  const compressedBlob = await compressFileGzip(file);
  const base64 = await blobToBase64(compressedBlob);
  return {
    fileName: file.name + ".gz",
    contentType: "application/gzip",
    fileData: base64,
  };
}

/**
 * Giải nén base64 gzip từ server và tải file về.
 */
export async function downloadGzipBase64File({
  fileName,
  contentType,
  fileData,
}: {
  fileName: string;
  contentType?: string;
  fileData: string; // base64 đã nén
}) {
  if (contentType != "application/gzip") {
    const byteCharacters = atob(fileData);
    const byteArrays = [];

    for (let i = 0; i < byteCharacters.length; i += 512) {
      const slice = byteCharacters.slice(i, i + 512);
      const byteNumbers = new Array(slice.length)
        .fill(0)
        .map((_, idx) => slice.charCodeAt(idx));
      byteArrays.push(new Uint8Array(byteNumbers));
    }

    const blob = new Blob(byteArrays, {
      type: contentType || "application/octet-stream",
    });
    const url = URL.createObjectURL(blob);

    // Mở hoặc tải về
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } else {
    // Giải mã base64 → Uint8Array
    const byteCharacters = atob(fileData);
    const byteArray = new Uint8Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteArray[i] = byteCharacters.charCodeAt(i);
    }

    if (!("DecompressionStream" in window)) {
      throw new Error("Trình duyệt không hỗ trợ DecompressionStream");
    }

    const decompressedStream = new Response(
      new Blob([byteArray])
        .stream()
        .pipeThrough(new DecompressionStream("gzip"))
    );

    const blob = await decompressedStream.blob();
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = fileName.replace(/\.gz$/, ""); // bỏ .gz nếu có
    a.click();
    URL.revokeObjectURL(url);
  }
}
export async function openGzipBase64FileInNewTab({
  fileName,
  contentType,
  fileData,
}: {
  fileName: string;
  contentType?: string;
  fileData: string;
}) {
  if (contentType !== "application/gzip") {
    // Nếu không phải gzip thì tạo blob và mở tab
    const byteCharacters = atob(fileData);
    const byteArrays = [];

    for (let i = 0; i < byteCharacters.length; i += 512) {
      const slice = byteCharacters.slice(i, i + 512);
      const byteNumbers = new Array(slice.length)
        .fill(0)
        .map((_, idx) => slice.charCodeAt(idx));
      byteArrays.push(new Uint8Array(byteNumbers));
    }

    const blob = new Blob(byteArrays, {
      type: contentType || "application/octet-stream",
    });
    const cleanName = fileName.replace(/\.gz$/, ""); // ✅ Loại bỏ đuôi .gz
    const url = URL.createObjectURL(blob);
    const newWindow = window.open(url, "_blank");

    // Xử lý tiêu đề tab nếu mở được
    if (newWindow && fileName) {
      newWindow.document.title = cleanName;
    }
  } else {
    // Nếu là gzip → giải nén và mở nội dung
    const byteCharacters = atob(fileData);
    const byteArray = new Uint8Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteArray[i] = byteCharacters.charCodeAt(i);
    }

    if (!("DecompressionStream" in window)) {
      throw new Error("Trình duyệt không hỗ trợ DecompressionStream");
    }

    const decompressedStream = new Response(
      new Blob([byteArray])
        .stream()
        .pipeThrough(new DecompressionStream("gzip"))
    );

    const blob = await decompressedStream.blob();
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
    URL.revokeObjectURL(url);
  }
}
