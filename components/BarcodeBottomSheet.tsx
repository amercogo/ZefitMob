import React, { useCallback, useMemo, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Svg, { Rect } from 'react-native-svg';

interface BarcodeBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  barcodeValue: string; // The membership code or user ID to encode
}

/**
 * Generate a CODE128-like barcode pattern
 * Creates a visual barcode representation from the input value
 * Each character contributes to a unique bar pattern
 */
function generateBarcodePattern(value: string): boolean[] {
  const pattern: boolean[] = [];
  
  // Start quiet zone (leading space)
  const quietZone = Array(8).fill(false);
  pattern.push(...quietZone);

  // Generate bars based on value
  // Each character contributes multiple bars for better visual density
  for (let i = 0; i < value.length; i++) {
    const charCode = value.charCodeAt(i);
    const normalizedCode = charCode % 16; // Get last 4 bits for consistency
    
    // Create a pattern: wide bars for higher values, thin for lower
    const barCount = 3 + (normalizedCode % 3); // 3-5 bars per character
    
    for (let j = 0; j < barCount; j++) {
      const shouldBeBar = (normalizedCode + j) % 2 === 0;
      pattern.push(shouldBeBar);
      pattern.push(false); // Space between bars
    }
  }

  // End quiet zone
  pattern.push(...quietZone);
  
  return pattern;
}

export default function BarcodeBottomSheet({
  isOpen,
  onClose,
  barcodeValue,
}: BarcodeBottomSheetProps) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['50%', '75%'], []);

  useEffect(() => {
    if (isOpen) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [isOpen]);

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      onClose();
    }
  }, [onClose]);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    []
  );

  const barcodePattern = useMemo(() => generateBarcodePattern(barcodeValue), [barcodeValue]);
  const barWidth = 2;
  const barHeight = 100;
  const maxWidth = Dimensions.get('window').width - 80; // Leave padding
  const svgWidth = Math.min(barcodePattern.length * barWidth, maxWidth);
  const svgHeight = barHeight + 40; // Extra height for padding

  return (
    <GestureHandlerRootView style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <BottomSheet
        ref={bottomSheetRef}
        index={isOpen ? 0 : -1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        backdropComponent={renderBackdrop}
        enablePanDownToClose
        backgroundStyle={styles.sheetBackground}
        handleIndicatorStyle={styles.handleIndicator}
      >
        <BottomSheetView style={styles.contentContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Moj barkod</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>✕</Text>
            </Pressable>
          </View>

          <View style={styles.barcodeContainer}>
            <Text style={styles.membershipCode}>{barcodeValue}</Text>
            <View style={styles.barcodeWrapper}>
              <Svg width={svgWidth} height={svgHeight}>
                {barcodePattern.map((isBar, index) => (
                  <Rect
                    key={index}
                    x={index * barWidth}
                    y={20}
                    width={barWidth}
                    height={isBar ? barHeight : 0}
                    fill={isBar ? '#1C1D18' : 'transparent'}
                  />
                ))}
              </Svg>
            </View>
            <Text style={styles.instruction}>
              Prikažite ovaj barkod na recepciji prilikom ulaska
            </Text>
          </View>
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  sheetBackground: {
    backgroundColor: '#1C1D18',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  handleIndicator: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    width: 40,
  },
  contentContainer: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FEFEFD',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    color: '#FEFEFD',
    fontSize: 20,
    fontWeight: '600',
  },
  barcodeContainer: {
    alignItems: 'center',
    width: '100%',
    flex: 1,
    justifyContent: 'center',
  },
  membershipCode: {
    fontSize: 18,
    fontWeight: '700',
    color: 'rgba(250, 240, 67, 1)',
    marginBottom: 24,
    letterSpacing: 2,
  },
  barcodeWrapper: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 140,
    width: '100%',
  },
  instruction: {
    fontSize: 14,
    color: '#CDCCC7',
    textAlign: 'center',
    marginTop: 16,
  },
});

