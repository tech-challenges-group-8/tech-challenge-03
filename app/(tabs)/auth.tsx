import { UserProfile } from '@/components/auth/UserProfile';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function ProfileTab() {
  return (
    <View style={styles.container}>
      <UserProfile />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
