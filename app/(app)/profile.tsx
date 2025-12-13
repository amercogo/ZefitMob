import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { useAuth } from '../../providers/AuthProvider';
import { supabase } from '../../lib/supabase';
import { Clanarina, TipClanarine } from '../../lib/database.types';

export default function ProfileScreen() {
  const { user, member, signOut } = useAuth();

  const [loading, setLoading] = useState(true);
  const [membership, setMembership] = useState<Clanarina | null>(null);
  const [membershipType, setMembershipType] = useState<TipClanarine | null>(null);
  const [visitsCount, setVisitsCount] = useState<number | null>(null);

  const loadProfileData = useCallback(async () => {
    if (!member) {
      setLoading(false);
      return;
    }

    try {
      // 1) Aktivna članarina
      const { data: membershipData } = await supabase
        .from('clanarine_clanova')
        .select('*')
        .eq('clan_id', member.id)
        .in('status', ['active', 'aktivni', 'pending'])
        .order('zavrsetak', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (membershipData) {
        setMembership(membershipData);

        const { data: typeData } = await supabase
          .from('tipovi_clanarina')
          .select('*')
          .eq('id', membershipData.tip_clanarine_id)
          .single();

        if (typeData) {
          setMembershipType(typeData);
        }
      }

      // 2) Broj dolazaka (ukupno)
      const { data: visitsData } = await supabase
        .from('dolasci')
        .select('id')
        .eq('clan_id', member.id);

      if (visitsData) {
        setVisitsCount(visitsData.length);
      }
    } catch (error) {
      console.error('Error loading profile data:', error);
    } finally {
      setLoading(false);
    }
  }, [member]);

  useEffect(() => {
    loadProfileData();
  }, [loadProfileData]);

  const handleSignOut = async () => {
    Alert.alert(
      'Odjava',
      'Da li ste sigurni da se želite odjaviti?',
      [
        { text: 'Otkaži', style: 'cancel' },
        {
          text: 'Odjavi se',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              router.replace('/(auth)/login');
            } catch (e) {
              console.error('Error on sign out:', e);
            }
          },
        },
      ]
    );
  };

  if (!member || loading) {
    return (
      <>
        <Stack.Screen
          options={{
            title: 'Profil',
            headerStyle: { backgroundColor: '#050505' },
            headerTintColor: '#fff',
          }}
        />
        <SafeAreaView style={styles.loadingScreen}>
          <ActivityIndicator size="large" color="rgba(250, 240, 67, 1)" />
          <Text style={styles.loadingText}>Učitavanje profila...</Text>
        </SafeAreaView>
      </>
    );
  }

  // Izračunaj neke label-e
  const membershipName = membershipType?.naziv ?? 'Nema aktivne članarine';
  const membershipStatus = membership
    ? membership.status ?? 'aktivna'
    : 'nema';

  const membershipExpiresText = membership?.zavrsetak
    ? new Date(membership.zavrsetak).toLocaleDateString('bs-BA')
    : '—';

  const memberSinceText = member.napravljeno
    ? new Date(member.napravljeno as unknown as string).toLocaleDateString('bs-BA')
    : 'Nepoznato';

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Moj profil',
          headerStyle: { backgroundColor: '#050505' },
          headerTintColor: '#fff',
        }}
      />

      <LinearGradient
        colors={['#050505', '#11110D', '#1C1D18']}
        style={styles.bg}
      >
        <SafeAreaView style={styles.screen}>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Gornja kartica sa avatarom i osnovnim info */}
            <View style={styles.cardShadow}>
              <LinearGradient
                colors={['#FAF043', '#FFE95A', '#F8F2B0']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.profileCard}
              >
                {/* Avatar */}
                <View style={styles.avatarWrapper}>
                  <View style={styles.avatarCircle}>
                    <Text style={styles.avatarInitial}>
                      {member.ime_prezime?.[0]?.toUpperCase() ?? 'Z'}
                    </Text>
                  </View>
                </View>

                {/* Ime + email */}
                <Text style={styles.name}>{member.ime_prezime}</Text>
                <Text style={styles.email}>{member.email ?? user?.email}</Text>

                {/* Clan kod pill */}
                <View style={styles.codePill}>
                  <Text style={styles.codePillLabel}>CLAN KOD</Text>
                  <Text style={styles.codePillValue}>
                    {member.clan_kod ?? '—'}
                  </Text>
                </View>

                {/* Brza akcija: Moj barkod */}
                <Pressable
                  style={({ pressed }) => [
                    styles.barcodeBtn,
                    pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
                  ]}
                  onPress={() => router.push('/(app)/barkod')}
                >
                  <Text style={styles.barcodeBtnText}>Prikaži barkod</Text>
                </Pressable>
              </LinearGradient>
            </View>

            {/* Stats kartica */}
            <View style={styles.statsCard}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Dolazaka</Text>
                <Text style={styles.statValue}>
                  {visitsCount !== null ? visitsCount : '—'}
                </Text>
              </View>

              <View style={styles.statDivider} />

              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Članarina</Text>
                <Text style={styles.statValue} numberOfLines={1}>
                  {membershipName}
                </Text>
              </View>

              <View style={styles.statDivider} />

              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Status</Text>
                <Text
                  style={[
                    styles.statValue,
                    membership
                      ? styles.statusActive
                      : styles.statusInactive,
                  ]}
                >
                  {membership ? 'AKTIVNA' : 'NEMA'}
                </Text>
              </View>
            </View>

            {/* Detalji sekcija */}
            <View style={styles.detailsCard}>
              <Text style={styles.detailsTitle}>Detalji profila</Text>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Email</Text>
                <Text style={styles.detailValue}>
                  {member.email ?? user?.email ?? '—'}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Telefon</Text>
                <Text style={styles.detailValue}>
                  {member.telefon ?? '—'}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Član od</Text>
                <Text style={styles.detailValue}>{memberSinceText}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Uloga</Text>
                <Text style={styles.detailValue}>
                  {member.role ?? 'clan'}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Status članarine</Text>
                <Text style={styles.detailValue}>
                  {membershipStatus.toUpperCase()}
                  {membershipExpiresText !== '—'
                    ? ` (ističe: ${membershipExpiresText})`
                    : ''}
                </Text>
              </View>
            </View>

            {/* Odjava */}
            <Pressable
              style={({ pressed }) => [
                styles.logoutBtn,
                pressed && { opacity: 0.8, transform: [{ scale: 0.99 }] },
              ]}
              onPress={handleSignOut}
            >
              <Text style={styles.logoutText}>Odjavi se</Text>
            </Pressable>
          </ScrollView>
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
  },
  loadingScreen: {
    flex: 1,
    backgroundColor: '#050505',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FEFEFD',
    marginTop: 16,
    fontSize: 16,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 32,
  },

  // Gornja kartica
  cardShadow: {
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.6,
    shadowRadius: 22,
    elevation: 12,
    marginBottom: 18,
  },
  profileCard: {
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: 'center',
  },
  avatarWrapper: {
    marginBottom: 12,
  },
  avatarCircle: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: '#141410',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(250, 240, 67, 0.9)',
  },
  avatarInitial: {
    fontSize: 40,
    fontWeight: '800',
    color: '#FAF043',
  },
  name: {
    fontSize: 20,
    fontWeight: '800',
    color: '#141410',
    marginTop: 4,
  },
  email: {
    fontSize: 13,
    color: '#3E3F3A',
    marginTop: 2,
  },
  codePill: {
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(20,20,16,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(20,20,16,0.2)',
  },
  codePillLabel: {
    fontSize: 10,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: '#6C6D5C',
    textAlign: 'center',
  },
  codePillValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#141410',
    textAlign: 'center',
    marginTop: 1,
  },

  barcodeBtn: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#141410',
  },
  barcodeBtnText: {
    color: '#FAF043',
    fontWeight: '700',
    fontSize: 13,
  },

  // Stats kartica
  statsCard: {
    backgroundColor: '#202019',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(220,220,210,0.7)',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FDFBED',
    textAlign: 'center',
  },
  statusActive: {
    color: '#A2FF7A',
  },
  statusInactive: {
    color: '#FF7A7A',
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },

  // Detalji profila
  detailsCard: {
    backgroundColor: '#202019',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 24,
  },
  detailsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FDFBED',
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  detailLabel: {
    fontSize: 13,
    color: 'rgba(220,220,210,0.7)',
  },
  detailValue: {
    fontSize: 13,
    color: '#FDFBED',
    maxWidth: '55%',
    textAlign: 'right',
  },

  // Logout
  logoutBtn: {
    alignSelf: 'center',
    paddingHorizontal: 26,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: '#3A211F',
    borderWidth: 1,
    borderColor: '#FF7A7A',
  },
  logoutText: {
    color: '#FFB2B2',
    fontWeight: '700',
    fontSize: 14,
  },
});
