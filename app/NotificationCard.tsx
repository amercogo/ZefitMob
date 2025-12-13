import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import { Image } from 'expo-image';

export type Announcement = {
  id: string;
  title: string;
  body: string;
  created_at: string;
  image: any;              // thumbnail za listu
  imageUrl?: string | null; // originalni image_url iz Supabasea
};


interface Props {
  item: Announcement;
  onPress?: () => void;
}

export default function NotificationCard({ item, onPress }: Props) {
  const dateLabel = new Date(item.created_at).toLocaleDateString('bs-BA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.cardOuter,
        pressed && styles.cardOuterPressed,
      ]}
    >
      {/* Žuti prsten */}
      <View style={styles.ring}>
        {/* Unutrašnja kartica */}
        <View style={styles.cardInner}>

          {/* Gornji dio: veća slika + tekst */}
          <View style={styles.topRow}>
            {/* Veća slika */}
            <View style={styles.thumbWrapper}>
              <Image
                source={item.image}
                style={styles.thumb}
                contentFit="cover"
                transition={150}
              />
            </View>

            {/* Tekst */}
            <View style={styles.textBlock}>
              <Text numberOfLines={2} style={styles.title}>
                {item.title}
              </Text>

              <Text numberOfLines={3} style={styles.body}>
                {item.body}
              </Text>
            </View>
          </View>

          {/* Donji dio */}
          <View style={styles.bottomRow}>
            <Text style={styles.dateText}>{dateLabel}</Text>

            {onPress && (
              <View style={styles.chip}>
                <Text style={styles.chipText}>Detaljnije</Text>
              </View>
            )}
          </View>

        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cardOuter: {
    marginBottom: 20,
    borderRadius: 22,
    paddingHorizontal: 20, // Smanjene margine → kartica šira
  },
  cardOuterPressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.95,
  },
  ring: {
    borderRadius: 22,
    padding: 2,
    backgroundColor: 'rgba(250, 240, 67, 0.45)',
  },
  cardInner: {
    borderRadius: 20,
    backgroundColor: '#202019',
    paddingVertical: 14,
    paddingHorizontal: 14,
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // VEĆA SLIKA
  thumbWrapper: {
    width: 100,
    height: 100,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#2A2B22',
    marginRight: 14,
  },
  thumb: {
    width: '100%',
    height: '100%',
  },

  textBlock: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#FDFBED',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  body: {
    color: 'rgba(230,230,220,0.85)',
    fontSize: 13,
    lineHeight: 17,
  },

  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
  },
  dateText: {
    fontSize: 12,
    color: 'rgba(200,200,190,0.7)',
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(250, 240, 67, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(250, 240, 67, 0.7)',
  },
  chipText: {
    fontSize: 12,
    color: '#FDFBED',
    fontWeight: '700',
  },
});
