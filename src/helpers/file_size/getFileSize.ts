import * as FileSystem from 'expo-file-system/legacy';

export async function getFileSize(inputPath: string){
    const BYTES_PER_KB = 1024;

    const info = await FileSystem.getInfoAsync(inputPath);

    if (!info.exists || info.size == null || info.size < 0) {
        throw new Error('Unable to get file size');
    }

    const size_in_MB = info.size / (BYTES_PER_KB ** 2);
    const size_in_GB = info.size / (BYTES_PER_KB ** 3);
    const size_in_TB = info.size / (BYTES_PER_KB ** 4);
    const size_in_PB = info.size / (BYTES_PER_KB ** 5);

    if (size_in_MB < 1000) {
        return `${size_in_MB.toLocaleString("en-US", { maximumFractionDigits: 1 })} MB`;
    }

    if (size_in_GB < 1000) {
        return `${size_in_GB.toLocaleString("en-US", { maximumFractionDigits: 2 })}GB`;
    }

    if (size_in_TB < 1000) {
        return `${size_in_TB.toLocaleString("en-US", { maximumFractionDigits: 2 })} TB`;
    }

    return `${size_in_PB.toLocaleString("en-US", { maximumFractionDigits: 2 })} PB`;
}