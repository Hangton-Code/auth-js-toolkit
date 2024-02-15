import Compressor from "compressorjs";

export const compressImageAsync = (file: File, options: Compressor.Options) => {
  return new Promise<File>((resolve, reject) => {
    new Compressor(file, {
      ...options,
      success(result) {
        resolve(result as File);
      },
      error(err) {
        reject(err.message);
      },
    });
  });
};
