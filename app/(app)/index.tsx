import React, { useState, useEffect, useCallback } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import NotificationCard, { Announcement } from '../NotificationCard';
import { supabase } from '../../lib/supabase';
import { Clanarina, Post, TipClanarine } from '../../lib/database.types';
import { useAuth } from '../../providers/AuthProvider';

const SHEET_MIN = 88;

export default function Index() {
  const { user, member, authInitializing } = useAuth();
  const [membership, setMembership] = useState<Clanarina | null>(null);
  const [membershipType, setMembershipType] = useState<TipClanarine | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Učitaj podatke
  const fetchData = useCallback(async () => {
    try {
      if (authInitializing) return;

      if (!user || !member) {
        setLoading(false);
        return;
      }

      // Članarina
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

        if (typeData) setMembershipType(typeData);
      }

      // Objave
      const { data: postsData } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (postsData) setPosts(postsData);
    } catch (error) {
      console.error('Error loading home data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user, member, authInitializing]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, [fetchData]);

  const convertPostToAnnouncement = (post: Post): Announcement => ({
    id: post.id,
    title: post.title,
    body: post.content,
    created_at: post.created_at,
    image: post.image_url
      ? { uri: post.image_url }
      : require('../../assets/images/p1.jpg'),
    imageUrl: post.image_url ?? null,
  });
  

  const membershipTitle = membershipType?.naziv ?? 'Članarina';
  const membershipExpiresText = membership?.zavrsetak
    ? `Ističe: ${new Date(membership.zavrsetak).toLocaleDateString('bs-BA')}`
    : 'Nema aktivne članarine';

  if (authInitializing || loading) {
    return (
      <SafeAreaView style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="rgba(250, 240, 67, 1)" />
        <Text style={styles.loadingText}>Učitavanje...</Text>
      </SafeAreaView>
    );
  }

  return (
    <LinearGradient
      colors={['#050505', '#11110D', '#1C1D18']}
      style={styles.bg}
    >
      <SafeAreaView style={styles.screen}>
        {/* Glavna hero kartica */}
        <View style={styles.cardShadow}>
          <LinearGradient
            colors={['#FAF043', '#FFE95A', '#F8F2B0']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroCard}
          >
            {/* Gornji red kartice: ime + logo */}
            <View style={styles.heroHeader}>
              <View style={styles.heroTextBlock}>
                <Text style={styles.heroTitle}>
                  Zdravo, {member?.ime_prezime ?? 'članu'}!
                </Text>
                <Text style={styles.heroSubtitle}>
                  Spremni za novi trening?
                </Text>
              </View>

              <Image
                style={styles.heroLogo}
                source={require('../../assets/images/zefit.png')}
                contentFit="contain"
              />
            </View>

            {/* Avatar + info o članarini (desno poravnato) */}
            <View style={styles.heroBottomRow}>
              <Pressable
                style={styles.avatarBox}
                onPress={() => router.push('/(app)/profile')}
              >
                <Image
                  source={require('../../assets/images/user.png')}
                  style={styles.avatarImg}
                  contentFit="cover"
                />
              </Pressable>

              <View style={styles.membershipBox}>
                <Text style={styles.membershipLabel}>Aktivna članarina</Text>
                <Text style={styles.membershipTitle}>{membershipTitle}</Text>
                <Text style={styles.membershipExpires}>
                  {membershipExpiresText}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Naslov sekcije obavijesti – centriran i flashy */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionChip}>
            <Text style={styles.sectionTitle}>Obavijesti</Text>
          </View>
          <Text style={styles.sectionSubtitle}>
            Najnovije vijesti iz ZeFita
          </Text>
        </View>

        {/* Lista obavijesti */}
        <FlatList
          data={posts.map(convertPostToAnnouncement)}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <NotificationCard
              item={item}
              onPress={() =>
                router.push({
                  pathname: '/(app)/obavijest',
                  params: {
                    id: item.id,
                    title: item.title,
                    body: item.body,
                    created_at: item.created_at,
                    image_url: item.imageUrl ?? '',
                  },
                })
              }
            />
          )}
          contentContainerStyle={{
            paddingBottom: SHEET_MIN + 24,
          }}
          style={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nema objava</Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />

        {/* Donji “Moj barkod” bar */}
        <Pressable
          style={styles.barcodeHandle}
          onPress={() => router.push('/(app)/barkod')}
        >
          <View style={styles.handleIndicator} />
          <Text style={styles.barcodeHandleText}>Moj barkod</Text>
        </Pressable>
      </SafeAreaView>
    </LinearGradient>
  );
}

const TILE = 70;

const styles = StyleSheet.create({
  bg: {
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
  screen: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 28,
  },

  // Hero kartica
  cardShadow: {
    borderRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 12,
    marginBottom: 18,
  },
  heroCard: {
    borderRadius: 28,
    padding: 18,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroTextBlock: {
    flexShrink: 1,
    paddingRight: 8,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#141410',
  },
  heroSubtitle: {
    fontSize: 13,
    color: '#3E3F3A',
    marginTop: 4,
  },
  heroLogo: {
    width: 60,
    height: 60,
  },

  heroBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  avatarBox: {
    width: TILE,
    height: TILE,
    borderRadius: 24,
    backgroundColor: 'rgba(20,20,16,0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarImg: {
    width: 36,
    height: 36,
    tintColor: '#FAF043',
  },

  // Membership info desno, poravnato
  membershipBox: {
    flex: 1,
    alignItems: 'flex-end',
  },
  membershipLabel: {
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: '#5A5B4A',
    textAlign: 'left',
  },
  membershipTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#141410',
    marginTop: 2,
    textAlign: 'center',
  },
  membershipExpires: {
    fontSize: 12,
    color: '#3E3F3A',
    marginTop: 2,
    textAlign: 'right',
  },

  // Sekcija obavijesti – centrirana i flashy
  sectionHeader: {
    marginTop: 6,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionChip: {
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(250, 240, 67, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(250, 240, 67, 0.45)',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F7F6EC',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontSize: 12,
    color: 'rgba(230,230,220,0.7)',
    marginTop: 6,
    textAlign: 'center',
  },

  list: {
    flex: 1,
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    color: '#CDCCC7',
    fontSize: 14,
  },

  // Donji “Moj barkod” bar
  barcodeHandle: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: SHEET_MIN,
    backgroundColor: 'rgba(250, 240, 67, 0.96)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 15,
    paddingBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
  },
  handleIndicator: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(28, 29, 24, 0.3)',
    borderRadius: 2,
    marginBottom: 6,
  },
  barcodeHandleText: {
    color: '#1C1D18',
    fontSize: 14,
    fontWeight: '700',
  },
});
