import React from 'react';
import { Image, Modal, StyleSheet, View } from 'react-native';

import { ThemedView } from '@/components/themed-view';
import { ThemedButton } from '@/components/ui';
import { Colors, SPACING } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useI18n } from '@/hooks/useI18n';

interface ImageModalProps {
  imageUri: string | undefined;
  visible: boolean;
  onClose: () => void;
  onDeleteReceipt: () => void;
}

export const ImageModal: React.FC<ImageModalProps> = ({
  imageUri,
  visible,
  onClose,
  onDeleteReceipt
}) => {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { t } = useI18n();

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <ThemedView style={[styles.modalContent, { backgroundColor: colors.background }]}>
          {imageUri && (
            <Image
              source={{ uri: imageUri }}
              style={styles.modalImage}
              resizeMode="contain"
            />
          )}
          <ThemedView style={styles.imageModalButtons}>
            <ThemedButton
              title={t('common.close')}
              onPress={onClose}
              variant="secondary"
              size="small"
            />
            <ThemedButton
              title={t('transactions.deleteReceiptTitle')}
              onPress={onDeleteReceipt}
              variant="delete"
              size="small"
            />
          </ThemedView>
        </ThemedView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    padding: SPACING * 2,
    borderRadius: 16,
    alignItems: "center",
    width: "90%",
    maxHeight: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalImage: { 
    width: "100%", 
    height: "90%", 
    borderRadius: 8 
  },
  imageModalButtons: {
    flexDirection: 'row',
    gap: SPACING,
    marginTop: SPACING,
  },
});
