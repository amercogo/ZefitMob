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
import NotificationCard, { Announcement } from '../NotificationCard';
import BarcodeBottomSheet from '../../components/BarcodeBottomSheet';
import { supabase } from '../../lib/supabase';
import { Clanarina, Post, TipClanarine } from '../../lib/database.types';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAuth } from '../../providers/AuthProvider';

const SHEET_MIN = 88;

export default function Index() {
  const { user, member } = useAuth();
  const [membership, setMembership] = useState<Clanarina | null>(null);
  const [membershipType, setMembershipType] = useState<TipClanarine | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isBarcodeSheetOpen, setIsBarcodeSheetOpen] = useState(false);

  // Fetch all data on mount and refresh
  const fetchData = useCallback(async () => {
    try {
      if (!user || !member) {
        console.warn('No authenticated user or member found');
        setLoading(false);
        return;
      }

      // === ČLANARINA ZA OVOG ČLANA ===
      const { data: membershipData, error: membershipError } = await supabase
        .from('clanarine_clanova')
        .select('*')
        .eq('clan_id', member.id)
        .in('status', ['active', 'aktivni', 'pending'])
        .order('zavrsetak', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!membershipError && membershipData) {
        setMembership(membershipData);

        const { data: typeData, error: typeError } = await supabase
          .from('tipovi_clanarina')
          .select('*')
          .eq('id', membershipData.tip_clanarine_id)
          .single();

        if (!typeError && typeData) {
          setMembershipType(typeData);
        }
      }

      // === OBJAVE / OBAVIJESTI ===
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (!postsError && postsData) {
        setPosts(postsData);
      } else if (postsError) {
        console.error('Error fetching posts:', postsError);
      }
    } catch (error) {
      console.error('Error in fetchData:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user, member]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, [fetchData]);

  // Convert Post to Announcement format for NotificationCard
  const convertPostToAnnouncement = (post: Post): Announcement => {
    return {
      id: post.id,
      title: post.title,
      body: post.content,
      created_at: post.created_at,
      image: post.image_url
        ? { uri: post.image_url }
        : require('../../assets/images/p1.jpg'),
    };
  };

  const barcodeValue = member?.clan_kod || user?.id || 'NO-CODE';

  const handleBarcodePress = useCallback(() => {
    setIsBarcodeSheetOpen(true);
  }, []);

  const handleCloseBarcodeSheet = useCallback(() => {
    setIsBarcodeSheetOpen(false);
  }, []);

  const membershipTitle = membershipType?.naziv ?? 'Članarina';

  const membershipExpiresText = membership?.zavrsetak
    ? `Ističe: ${new Date(membership.zavrsetak).toLocaleDateString('bs-BA')}`
    : 'Nema aktivne članarine';

  if (loading) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="rgba(250, 240, 67, 1)" />
          <Text style={styles.loadingText}>Učitavanje...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.screen}>
        {/* HEADER: naziv + logo gore */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Fitness studio ZeFit</Text>
            <Text style={styles.subtitle}>
              Dobro došli, {member?.ime_prezime ?? 'članu'}!
            </Text>
          </View>

          <Image
            style={styles.logo}
            source={require('../../assets/images/zefit.png')}
            contentFit="contain"
            transition={200}
          />
        </View>

        {/* GORNJI RED: avatar lijevo + kartica članarine desno */}
        <View style={styles.topRow}>
          {/* AVATAR */}
          <Pressable
            style={styles.avatarBox}
            onPress={() => router.push('/(app)/profile')}
            accessibilityRole="button"
            accessibilityLabel="Otvori profil"
            android_ripple={{ color: 'rgba(255,255,255,0.1)', borderless: true }}
          >
            <Image
              source={require('../../assets/images/user.png')}
              style={styles.avatarImg}
              contentFit="cover"
              transition={150}
            />
          </Pressable>

          {/* MEMBERSHIP CARD */}
          <View style={styles.membershipBox}>
            <Text style={styles.membershipTitle}>{membershipTitle}</Text>
            <Text style={styles.membershipSubtitle}>{membershipExpiresText}</Text>
          </View>
        </View>

        {/* LISTA OBAVIJESTI */}
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
                  },
                })
              }
            />
          )}
          style={styles.list}
          contentContainerStyle={{ paddingBottom: SHEET_MIN + 24, paddingTop: 12 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#FEFEFD"
            />
          }
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nema objava</Text>
            </View>
          }
        />

        {/* DONJI PULL-UP ZA BARKOD */}
        <Pressable
          style={styles.barcodeHandle}
          onPress={handleBarcodePress}
          android_ripple={{ color: 'rgba(255,255,255,0.1)' }}
        >
          <View style={styles.handleIndicator} />
          <Text style={styles.barcodeHandleText}>Moj barkod</Text>
        </Pressable>

        {/* BOTTOM SHEET SA BARKODOM */}
        <BarcodeBottomSheet
          isOpen={isBarcodeSheetOpen}
          onClose={handleCloseBarcodeSheet}
          barcodeValue={barcodeValue}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const TILE = 70;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#1C1D18',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FEFEFD',
    marginTop: 16,
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFAFA',
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    color: '#CDCCC7',
  },
  logo: {
    width: 64,
    height: 64,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    marginTop: 8,
  },
  avatarBox: {
    width: TILE,
    height: TILE,
    borderRadius: 20,
    backgroundColor: 'rgba(250, 240, 67, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImg: {
    width: 36,
    height: 36,
    tintColor: '#1C1D18',
    opacity: 0.9,
  },
  membershipBox: {
    flex: 1,
    height: TILE,
    marginLeft: 12,
    backgroundColor: 'rgba(250, 240, 67, 0.85)',
    borderRadius: 20,
    paddingHorizontal: 16,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  membershipTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1C1D18',
  },
  membershipSubtitle: {
    fontSize: 12,
    marginTop: 2,
    color: '#333',
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
  barcodeHandle: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: SHEET_MIN,
    backgroundColor: 'rgba(250, 240, 67, 0.9)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
    paddingBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  handleIndicator: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(28, 29, 24, 0.3)',
    borderRadius: 2,
    marginBottom: 8,
  },
  barcodeHandleText: {
    color: '#1C1D18',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 4,
  },
});
