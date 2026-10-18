import { execute } from 'munim-ffmpeg';
import * as FileSystem from 'expo-file-system/legacy';

export async function generateThumbnail(input: string, duration: number, filename: string) {
    const outputPath = `${FileSystem.cacheDirectory}${filename}_${Date.now()}_thumbnail.jpg`;
    const timestamp = duration * 0.15

    const result = await execute([
        '-y',
        '-ss',
        String(timestamp),
        '-i',
        input,
        '-frames:v',
        '1',
        '-q:v',
        '2',
        outputPath,
    ]);

    if (!result.success) {
        throw new Error(result.failStackTrace ?? `Thumbnail generation failed: ${result.output}`);
    }

  return outputPath;
}