import { probe } from 'munim-ffmpeg';


export function getDisplayTitle(filename: string): string {
  return filename
    .replace(/\.[^.]+$/, '')
    .replace(/[._-]/g, ' ')
    .replace(
      /\b(144p|240p|360p|480p|540p|576p|640p|720p|1080p|2160p|4K|8K|10bit|8bit|WEBRip|WEB-DL|BluRay|BRRip|BDRip|HDTV|PDTV|DVDRip|HDRip|x264|x265|HEVC|AVC|AAC|DDP?5?\.?1|H\.?264|H\.?265)\b/gi,
      ''
    )
    .replace(/\s+/g, ' ')
    .trim();
}
