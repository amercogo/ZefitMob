// app/obavijest/[id].tsx
import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';

export default function ObavijestDetalj() {
  const { title, body, created_at, image_url } = useLocalSearchParams<{
    title: string;
    body: string;
    created_at: string;
    image_url?: string;
  }>();

  const d = new Date(created_at).toLocaleString('bs-BA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  // Ako postoji image_url iz Supabase → koristi njega, inače lokalnu sliku
  const heroSource = image_url && image_url.length > 0
    ? { uri: image_url }
    : require('../../assets/images/p1.jpg');

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Obavijest',
          presentation: 'modal',
          headerTintColor: '#FEFEFD',
          headerStyle: { backgroundColor: '#050505' },
        }}
      />

      <ScrollView
        style={st.screen}
        contentContainerStyle={st.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Slika skroz na vrhu */}
        <Image
          source={heroSource}
          style={st.hero}
          contentFit="cover"
          transition={200}
        />

        {/* Kartica sa sadržajem */}
        <View style={st.card}>
          {/* Chip/tag */}
          <View style={st.chip}>
            <Text style={st.chipText}>ZeFit • Obavijest</Text>
          </View>

          {/* Naslov – centriran */}
          <Text style={st.title} numberOfLines={3}>
            {title}
          </Text>

          {/* Datum */}
          <Text style={st.date}>{d}</Text>

          {/* Tekst obavijesti */}
          <Text style={st.body}>{body}</Text>

          {/* Dodatne info */}
          <View style={st.metaBox}>
            <View style={st.metaRow}>
              <Text style={st.metaLabel}>Objavio</Text>
              <Text style={st.metaValue}>ZeFit tim</Text>
            </View>
            <View style={st.metaRow}>
              <Text style={st.metaLabel}>Tip</Text>
              <Text style={st.metaValue}>Obavijest za članove</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const st = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#050505',
  },
  container: {
    paddingBottom: 32,
  },
  hero: {
    width: '100%',
    height: 260,
  },
  card: {
    marginTop: -24,
    marginHorizontal: 16,
    paddingHorizontal: 18,
    paddingVertical: 18,
    borderRadius: 20,
    backgroundColor: '#1C1D18',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
  chip: {
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(250, 240, 67, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(250, 240, 67, 0.7)',
    marginBottom: 10,
  },
  chipText: {
    fontSize: 11,
    letterSpacing: 1.3,
    textTransform: 'uppercase',
    color: '#FDFBED',
    fontWeight: '600',
  },
  title: {
    color: '#FEFEFD',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 6,
    textAlign: 'center',
  },
  date: {
    color: '#CDCCC7',
    opacity: 0.85,
    marginBottom: 16,
    textAlign: 'center',
    fontSize: 12,
  },
  body: {
    color: '#FEFEFD',
    lineHeight: 22,
    fontSize: 16,
    marginBottom: 20,
  },
  metaBox: {
    marginTop: 6,
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.12)',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  metaLabel: {
    fontSize: 13,
    color: 'rgba(220,220,210,0.7)',
  },
  metaValue: {
    fontSize: 13,
    color: '#FDFBED',
  },
});
