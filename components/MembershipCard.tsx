import React from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { Clanarina, TipClanarine } from '../lib/database.types';

interface MembershipCardProps {
  membership: Clanarina | null;
  membershipType: TipClanarine | null;
  loading?: boolean;
  onPress?: () => void;
}

export default function MembershipCard({
  membership,
  membershipType,
  loading = false,
  onPress,
}: MembershipCardProps) {
  if (loading) {
    return (
      <View style={styles.card}>
        <ActivityIndicator size="small" color="rgba(250, 240, 67, 1)" />
        <Text style={styles.loadingText}>Učitavanje podataka o članarini...</Text>
      </View>
    );
  }

  if (!membership) {
    return (
      <Pressable style={styles.card} onPress={onPress}>
        <Text style={styles.title}>Članarina</Text>
        <Text style={styles.noDataText}>Nema aktivne članarine</Text>
      </Pressable>
    );
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('bs-BA', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'aktivni':
        return 'Aktivna';
      case 'pending':
        return 'Čeka aktivaciju';
      case 'expired':
      case 'istekla':
        return 'Istekla';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'aktivni':
        return '#4CAF50';
      case 'pending':
        return '#FF9800';
      case 'expired':
      case 'istekla':
        return '#F44336';
      default:
        return '#CDCCC7';
    }
  };

  return (
    <Pressable style={styles.card} onPress={onPress} android_ripple={{ color: 'rgba(255,255,255,0.1)' }}>
      <View style={styles.header}>
        <Text style={styles.title}>Članarina</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(membership.status) }]}>
          <Text style={styles.statusText}>{getStatusText(membership.status)}</Text>
        </View>
      </View>

      {membershipType && (
        <Text style={styles.membershipType}>{membershipType.naziv}</Text>
      )}

      <View style={styles.infoRow}>
        <Text style={styles.label}>Cijena:</Text>
        <Text style={styles.value}>{membership.cijena.toFixed(2)} BAM</Text>
      </View>

      {membership.zavrsetak && (
        <View style={styles.infoRow}>
          <Text style={styles.label}>Ističe:</Text>
          <Text style={styles.value}>{formatDate(membership.zavrsetak)}</Text>
        </View>
      )}

      {membership.pocetak && (
        <View style={styles.infoRow}>
          <Text style={styles.label}>Početak:</Text>
          <Text style={styles.value}>{formatDate(membership.pocetak)}</Text>
        </View>
      )}
    </Pressable>
  );
}

const TILE = 70;

const styles = StyleSheet.create({
  card: {
    height: TILE,
    borderRadius: 12,
    backgroundColor: 'rgba(250, 240, 67, 0.70)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.10)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    justifyContent: 'center',
    marginTop: 15,
    marginBottom: 30,
    marginRight: 31,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    color: '#1C1D18',
    fontSize: 14,
    fontWeight: '700',
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  membershipType: {
    color: '#1C1D18',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  label: {
    color: '#1C1D18',
    fontSize: 10,
    opacity: 0.7,
  },
  value: {
    color: '#1C1D18',
    fontSize: 10,
    fontWeight: '600',
  },
  loadingText: {
    color: '#1C1D18',
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
  noDataText: {
    color: '#1C1D18',
    fontSize: 12,
    marginTop: 4,
    opacity: 0.7,
  },
});

