import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../providers/AuthProvider';

export default function BarkodScreen() {
  const { user, member } = useAuth();

  const barcodeValue =
    member?.barcode_value ||
    member?.clan_kod ||
    user?.id ||
    'NO-CODE';

  const barcodeImageUrl = member?.barcode_image_url ?? null;

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Moj barkod',
          headerStyle: { backgroundColor: '#050505' },
          headerTintColor: '#fff',
        }}
      />

      <LinearGradient
        colors={['#050505', '#151510', '#1C1D18']}
        style={styles.bg}
      >
        <SafeAreaView style={styles.screen}>
          {/* Gornji “badge” sa imenom teretane */}
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Fitness studio ZeFit</Text>
          </View>

          {/* Glavna kartica */}
          <View style={styles.cardShadow}>
            <LinearGradient
              colors={['#FAF043', '#FFE95A', '#F8F2B0']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.card}
            >
              {/* Gornji red: logo + naziv */}
              <View style={styles.cardHeader}>
                <View style={styles.gymInfo}>
                  <Text style={styles.gymName}>ZeFit Digital Pass</Text>
                  <Text style={styles.gymSub}>
                    Digitalna članska kartica
                  </Text>
                </View>

                <Image
                  source={require('../../assets/images/zefit.png')}
                  style={styles.logo}
                  contentFit="contain"
                />
              </View>

              {/* Info o članu */}
              <View style={styles.memberSection}>
                <Text style={styles.memberLabel}>Član</Text>
                <Text style={styles.memberName}>
                  {member?.ime_prezime ?? 'Neregistrovan član'}
                </Text>

                <View style={styles.codeRow}>
                  <View style={styles.codePill}>
                    <Text style={styles.codePillLabel}>CLAN KOD</Text>
                    <Text style={styles.codePillValue}>
                      {member?.clan_kod ?? '—'}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Bijela zona sa barkodom */}
              <View style={styles.barcodeCard}>
                <View style={styles.barcodeWrapper}>
                  {barcodeImageUrl ? (
                    <Image
                      source={{ uri: barcodeImageUrl }}
                      style={styles.barcodeImage}
                      contentFit="contain"
                      transition={200}
                    />
                  ) : (
                    <Text style={styles.generatingText}>
                      Generišem barkod...
                    </Text>
                  )}
                </View>
              </View>

              {/* Tekst ispod barkoda */}
              <Text style={styles.barcodeNumber}>{barcodeValue}</Text>

              {/* Footer info */}
              <View style={styles.footerRow}>
                <Text style={styles.footerLeft}>
                  Status:{' '}
                  <Text style={styles.footerLeftStrong}>
                    {member?.status ?? 'nepoznat'}
                  </Text>
                </Text>
                <Text style={styles.footerRight}>ZeFit • Sarajevo</Text>
              </View>
            </LinearGradient>
          </View>

          {/* Hint ispod kartice */}
          <Text style={styles.hintText}>
            Približite ekran skeneru na recepciji kako biste se prijavili
            na trening.
          </Text>
        </SafeAreaView>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
  screen: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(250, 240, 67, 0.35)',
    backgroundColor: 'rgba(0,0,0,0.45)',
    marginBottom: 18,
  },
  badgeText: {
    color: '#FDFBED',
    fontSize: 12,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  cardShadow: {
    width: '100%',
    borderRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.6,
    shadowRadius: 24,
    elevation: 10,
  },
  card: {
    borderRadius: 28,
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  gymInfo: {
    flexShrink: 1,
    paddingRight: 10,
  },
  gymName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#141410',
  },
  gymSub: {
    fontSize: 12,
    color: '#3E3F3A',
    marginTop: 2,
  },
  logo: {
    width: 56,
    height: 56,
  },
  memberSection: {
    marginTop: 8,
    marginBottom: 12,
  },
  memberLabel: {
    fontSize: 11,
    letterSpacing: 1.3,
    color: '#5A5B4A',
    textTransform: 'uppercase',
  },
  memberName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#141410',
    marginTop: 3,
  },
  codeRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 10,
  },
  codePill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(20,20,16,0.06)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(20,20,16,0.12)',
  },
  codePillLabel: {
    fontSize: 9,
    letterSpacing: 1.2,
    color: '#6C6D5C',
    textTransform: 'uppercase',
  },
  codePillValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1C1D18',
  },
  barcodeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
    minHeight: 150,
  },
  barcodeWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  barcodeImage: {
    width: '100%',
    height: 180,
  },
  generatingText: {
    color: '#555',
    fontSize: 13,
  },
  barcodeNumber: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 4,
    textAlign: 'center',
    color: '#1B1C15',
  },
  footerRow: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerLeft: {
    fontSize: 11,
    color: '#444330',
  },
  footerLeftStrong: {
    fontWeight: '700',
  },
  footerRight: {
    fontSize: 11,
    color: '#444330',
  },
  hintText: {
    marginTop: 22,
    fontSize: 12,
    color: 'rgba(240, 240, 230, 0.8)',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
});
