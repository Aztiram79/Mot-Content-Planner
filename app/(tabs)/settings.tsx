import React, { useState } from 'react';
import { View, Text, StyleSheet, useColorScheme, TouchableOpacity, Switch, Alert, Platform, Linking } from 'react-native';
import Colors from '@/constants/Colors';
import { clearAllPosts } from '@/utils/storage';
import { Bell, Download, Trash2, Info, Shield, FileText, ExternalLink, Wifi } from 'lucide-react-native';

export default function SettingsScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [dataCollection, setDataCollection] = useState(true);
  
  const handleClearData = () => {
    const confirmClear = () => {
      clearAllPosts().then(() => {
        if (Platform.OS === 'web') {
          alert('All posts have been deleted');
        } else {
          Alert.alert('Success', 'All posts have been deleted');
        }
      });
    };
    
    if (Platform.OS === 'web') {
      if (confirm('Are you sure you want to delete all posts? This action cannot be undone.')) {
        confirmClear();
      }
    } else {
      Alert.alert(
        'Delete All Posts',
        'Are you sure you want to delete all posts? This action cannot be undone.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete', style: 'destructive', onPress: confirmClear },
        ]
      );
    }
  };
  
  const handleExportData = () => {
    if (Platform.OS === 'web') {
      alert('This feature is not available in the web version');
    } else {
      Alert.alert('Not Available', 'This feature is not available in this version');
    }
  };

  const openPrivacyPolicy = () => {
    Linking.openURL('https://example.com/privacy-policy');
  };

  const openTermsOfService = () => {
    Linking.openURL('https://example.com/terms-of-service');
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Privacy & Data</Text>
        <View style={[styles.settingItem, { borderBottomColor: colors.gray[200] }]}>
          <View style={styles.settingContent}>
            <Shield size={22} color={colors.primary} />
            <Text style={[styles.settingText, { color: colors.text }]}>
              Data Collection
            </Text>
          </View>
          <Switch
            value={dataCollection}
            onValueChange={setDataCollection}
            trackColor={{ false: colors.gray[300], true: colors.primary + '80' }}
            thumbColor={dataCollection ? colors.primary : colors.gray[100]}
          />
        </View>
        <TouchableOpacity 
          style={[styles.settingItem, { borderBottomColor: colors.gray[200] }]}
          onPress={openPrivacyPolicy}
        >
          <View style={styles.settingContent}>
            <FileText size={22} color={colors.primary} />
            <Text style={[styles.settingText, { color: colors.text }]}>
              Privacy Policy
            </Text>
          </View>
          <ExternalLink size={20} color={colors.gray[500]} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.settingItem, { borderBottomColor: colors.gray[200] }]}
          onPress={openTermsOfService}
        >
          <View style={styles.settingContent}>
            <FileText size={22} color={colors.primary} />
            <Text style={[styles.settingText, { color: colors.text }]}>
              Terms of Service
            </Text>
          </View>
          <ExternalLink size={20} color={colors.gray[500]} />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Notifications</Text>
        <View style={[styles.settingItem, { borderBottomColor: colors.gray[200] }]}>
          <View style={styles.settingContent}>
            <Bell size={22} color={colors.primary} />
            <Text style={[styles.settingText, { color: colors.text }]}>
              Post Reminders
            </Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: colors.gray[300], true: colors.primary + '80' }}
            thumbColor={notificationsEnabled ? colors.primary : colors.gray[100]}
          />
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Data Management</Text>
        <TouchableOpacity 
          style={[styles.settingItem, { borderBottomColor: colors.gray[200] }]}
          onPress={handleExportData}
        >
          <View style={styles.settingContent}>
            <Download size={22} color={colors.primary} />
            <Text style={[styles.settingText, { color: colors.text }]}>
              Export Data
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.settingItem}
          onPress={handleClearData}
        >
          <View style={styles.settingContent}>
            <Trash2 size={22} color={colors.error} />
            <Text style={[styles.settingText, { color: colors.error }]}>
              Clear All Data
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>About</Text>
        <View style={styles.settingItem}>
          <View style={styles.settingContent}>
            <Info size={22} color={colors.primary} />
            <View>
              <Text style={[styles.settingText, { color: colors.text }]}>
                Social Media Planner
              </Text>
              <Text style={[styles.versionText, { color: colors.gray[500] }]}>
                Version 1.0.0
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.offlineContainer}>
        <Wifi size={16} color={colors.success} />
        <Text style={[styles.offlineText, { color: colors.success }]}>
          No internet connection required
        </Text>
      </View>
      
      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: colors.gray[500] }]}>
          © 2025 Social Media Planner. All rights reserved.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingTop: 24,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginLeft: 12,
  },
  versionText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginLeft: 12,
  },
  offlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    marginTop: 'auto',
    marginBottom: 8,
  },
  offlineText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginLeft: 6,
  },
  footer: {
    padding: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
});