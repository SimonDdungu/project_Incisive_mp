import { db } from '@/database/connection/connection';
import { videos } from "@/database/models/videos/video";
import { getFileSize } from '@/helpers/file_size/getFileSize';
import { generateThumbnail } from '@/helpers/thumbnails/generateThumbnails';
import { formatDuration } from '@/helpers/video_formats/format_duration';
import { formatResolution } from '@/helpers/video_formats/format_resolution';
import { Ionicons } from "@expo/vector-icons";
import { randomUUID } from 'expo-crypto';
import * as DocumentPicker from "expo-document-picker";
import { Directory, File, Paths } from "expo-file-system";
import { getVideoInfoAsync } from 'expo-video-metadata';
import { useEffect, useState } from 'react';
import { Alert, FlatList, Image, Pressable, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from "react-native-safe-area-context";



export default function HomeScreen() {
    const [media, setMedia] = useState<any[]>([]);

    const insets = useSafeAreaInsets();

    async function loadVideos(){
        try {
            const storedVideos = await db.select().from(videos);

            const videosDetails = await Promise.all(
                storedVideos.map(async (video) => {
                  try {
                    const info = await getVideoInfoAsync(video.uri, { includeMetadataTags: true, exactDuration: true });
                    const thumbnail = await generateThumbnail(video.uri, info.duration, video.filename);
                    const fileSize = await getFileSize(video.uri);

                    return {...video, metadata: info, thumbnail: thumbnail, fileSize: fileSize};
                  } catch (error) {
                    console.error(`Thumbnail failed for ${video.filename}:`, error);
                  }
                })
              );

            setMedia(videosDetails);

              console.log("Videos: ", media)

        } catch (error) {
            console.error('Failed to load videos:', error);
        }
    };


    useEffect(() => {
      loadVideos();
    }, []);
    
    const importVideos = async () => {
        const selectedFiles = await DocumentPicker.getDocumentAsync({ type: "video/*", multiple: true, copyToCacheDirectory: true });
        if (selectedFiles.canceled) return;

        try {
            const directory = new Directory(Paths.document, "videos");
            directory.create({ idempotent: true, intermediates: true });

            const addedVideos = selectedFiles.assets.map((video) => {
                const destination = new File(directory, `${video.name}-${randomUUID()}`);
                new File(video.uri).copy(destination);
                return { ...video, uri: destination.uri };
            });

            await db.insert(videos).values(addedVideos.map((video) => ({
                id: randomUUID(),
                uri: video.uri,
                filename: video.name,
            })));

            loadVideos();
        } catch (error) {
            console.error('Import video error:', error);
            Alert.alert('Import Error', error instanceof Error ? error.message : String(error));
        }
    };

    

  return (
    <View className="flex-1 bg-black px-5 pt-5">
      
      <Text className="mb-5 pb-4 border-b border-gray-400 text-sm font-medium text-center text-white">
        Videos
      </Text>

      <TextInput className="mb-8 text-sm text-gray-200 placeholder:text-gray-400"
        placeholder="Search..."
      />

      <Pressable className="size-14 rounded-full bg-red-500 items-center justify-center absolute bottom-24 right-5 z-10"
      style={{ position: "absolute", bottom: insets.bottom + 5, right: 20 }}
        onPress={importVideos}
      >
         <Ionicons name="add" size={24} color="white" />
      </Pressable>


      <FlatList
      data={media}
      numColumns={2}
      keyExtractor={(item) => item.uri}
      columnWrapperStyle={{ gap: 12 }}
      contentContainerStyle={{ gap: 12 }}
      renderItem={({ item }) => (
        <Pressable className="flex-1 overflow-hidden rounded-lg bg-neutral-900">

          {/* Video Overlay */}
          <View className="aspect-video items-center justify-center bg-neutral-900 relative">
              {item.thumbnail ? (
                <Image
                  source={{ uri: item.thumbnail}}
                  className="h-full w-full"
                  resizeMode="cover"
                />
              ) : (

                <View>
                  <Text className="text-neutral-400">▶</Text>
                </View>
              
                )}


            <Text className="text-xs text-white absolute top-1 left-1 bg-black/50 rounded-xl px-2"  numberOfLines={1}>
              {formatResolution(item.metadata?.height)}
            </Text>

            <Text className="text-xs text-white absolute bottom-1 right-1 bg-black/50 rounded-xl px-2"  numberOfLines={1}>
              {formatDuration(item.metadata?.duration)}
            </Text>

          </View>


          {/* Other properties */}
          <View className='p-3'>
            <Text className="text-sm text-white mb-2"  numberOfLines={2}>
              {item.metadata?.metadataTags?.title || item.filename}
            </Text>

            <Text className="text-xs text-white text-right"  numberOfLines={2}>
              {item?.fileSize}
            </Text>

          </View>
        </Pressable>
      )}

      ListEmptyComponent={
        <Text className="mt-8 text-center text-sm text-gray-400">
          No videos imported yet.
        </Text>
      }
    />




    </View>
  )
}