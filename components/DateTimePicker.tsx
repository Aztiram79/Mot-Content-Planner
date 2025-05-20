import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme, Platform, Modal } from 'react-native';
import Colors from '@/constants/Colors';
import {
  format,
  addDays,
  addHours,
  setHours,
  setMinutes,
  startOfDay,
} from 'date-fns';

interface DateTimePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  onClose: () => void;
}

export default function DateTimePicker({ value, onChange, onClose }: DateTimePickerProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [tempDate, setTempDate] = useState<Date>(value);
  
  const handleQuickOption = (option: string) => {
    let newDate: Date;
    const now = new Date();
    
    switch (option) {
      case 'now':
        newDate = now;
        break;
      case 'today-noon':
        newDate = setHours(setMinutes(startOfDay(now), 0), 12);
        break;
      case 'today-evening':
        newDate = setHours(setMinutes(startOfDay(now), 0), 18);
        break;
      case 'tomorrow-morning':
        newDate = setHours(setMinutes(startOfDay(addDays(now, 1)), 0), 9);
        break;
      case 'tomorrow-noon':
        newDate = setHours(setMinutes(startOfDay(addDays(now, 1)), 0), 12);
        break;
      case 'tomorrow-evening':
        newDate = setHours(setMinutes(startOfDay(addDays(now, 1)), 0), 18);
        break;
      case 'next-hour':
        newDate = addHours(now, 1);
        break;
      case 'later-today':
        newDate = addHours(now, 3);
        break;
      default:
        newDate = now;
    }
    
    setTempDate(newDate);
  };
  
  const handleSave = () => {
    onChange(tempDate);
  };
  
  const PickerContent = () => (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Select Date & Time</Text>
        <TouchableOpacity onPress={onClose}>
          <Text style={[styles.closeButton, { color: colors.primary }]}>Cancel</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={[styles.selectedDate, { color: colors.text }]}>
        {format(tempDate, 'PPPP')}
      </Text>
      <Text style={[styles.selectedTime, { color: colors.primary }]}>
        {format(tempDate, 'p')}
      </Text>
      
      <View style={styles.optionsContainer}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Options</Text>
        
        <View style={styles.optionsGrid}>
          <TouchableOpacity 
            style={[styles.optionButton, { backgroundColor: colors.gray[100] }]}
            onPress={() => handleQuickOption('now')}
          >
            <Text style={[styles.optionText, { color: colors.text }]}>Now</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.optionButton, { backgroundColor: colors.gray[100] }]}
            onPress={() => handleQuickOption('next-hour')}
          >
            <Text style={[styles.optionText, { color: colors.text }]}>In 1 hour</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.optionButton, { backgroundColor: colors.gray[100] }]}
            onPress={() => handleQuickOption('later-today')}
          >
            <Text style={[styles.optionText, { color: colors.text }]}>Later today</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.optionButton, { backgroundColor: colors.gray[100] }]}
            onPress={() => handleQuickOption('today-noon')}
          >
            <Text style={[styles.optionText, { color: colors.text }]}>Today noon</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.optionButton, { backgroundColor: colors.gray[100] }]}
            onPress={() => handleQuickOption('today-evening')}
          >
            <Text style={[styles.optionText, { color: colors.text }]}>Today evening</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.optionButton, { backgroundColor: colors.gray[100] }]}
            onPress={() => handleQuickOption('tomorrow-morning')}
          >
            <Text style={[styles.optionText, { color: colors.text }]}>Tomorrow morning</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <TouchableOpacity 
        style={[styles.saveButton, { backgroundColor: colors.primary }]}
        onPress={handleSave}
      >
        <Text style={styles.saveButtonText}>Set Date & Time</Text>
      </TouchableOpacity>
    </View>
  );
  
  // For web, we'll use a simple overlay
  if (Platform.OS === 'web') {
    return (
      <View style={styles.webOverlay}>
        <PickerContent />
      </View>
    );
  }
  
  // For native platforms, use the Modal component
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <PickerContent />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  webOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    width: Platform.OS === 'web' ? 400 : '90%',
    maxWidth: 400,
    borderRadius: 12,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
  },
  closeButton: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  selectedDate: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
  selectedTime: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 24,
  },
  optionsContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginBottom: 12,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  optionButton: {
    width: '48%',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  optionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  saveButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
});