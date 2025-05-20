import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  useColorScheme, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  Platform,
  Alert 
} from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import { addPost } from '@/utils/storage';
import { Calendar, Check } from 'lucide-react-native';
import { format } from 'date-fns';
import DateTimePicker from '@/components/DateTimePicker';

export default function CreatePostScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const router = useRouter();
  
  const [text, setText] = useState('');
  const [scheduledDate, setScheduledDate] = useState(new Date());
  const [platform, setPlatform] = useState<'Facebook' | 'Instagram' | 'Twitter'>('Instagram');
  const [hashtags, setHashtags] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<'Draft' | 'Scheduled'>('Draft');
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  const handleSave = async () => {
    if (!text.trim()) {
      if (Platform.OS === 'web') {
        alert('Please enter post text');
      } else {
        Alert.alert('Error', 'Please enter post text');
      }
      return;
    }
    
    try {
      await addPost({
        id: Date.now().toString(),
        text,
        scheduledDate: scheduledDate.toISOString(),
        platform,
        hashtags,
        status,
        notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      
      if (Platform.OS === 'web') {
        alert('Post created successfully!');
      } else {
        Alert.alert('Success', 'Post created successfully!');
      }
      
      router.push('/posts');
    } catch (error) {
      console.error('Failed to save post:', error);
      if (Platform.OS === 'web') {
        alert('Failed to save post. Please try again.');
      } else {
        Alert.alert('Error', 'Failed to save post. Please try again.');
      }
    }
  };
  
  const platformOptions = [
    { value: 'Facebook', color: colors.platformColors.Facebook },
    { value: 'Instagram', color: colors.platformColors.Instagram },
    { value: 'Twitter', color: colors.platformColors.Twitter },
  ];
  
  const statusOptions = [
    { value: 'Draft', color: colors.statusColors.Draft },
    { value: 'Scheduled', color: colors.statusColors.Scheduled },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Create Post</Text>
      </View>
      
      <ScrollView style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Post Content</Text>
          <TextInput
            style={[
              styles.textArea, 
              { 
                color: colors.text,
                backgroundColor: colors.gray[100],
                borderColor: colors.gray[300],
              }
            ]}
            placeholder="What's on your mind?"
            placeholderTextColor={colors.gray[400]}
            value={text}
            onChangeText={setText}
            multiline
            maxLength={280}
          />
          <Text style={[styles.counter, { color: colors.gray[500] }]}>
            {text.length}/280
          </Text>
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Date & Time</Text>
          <TouchableOpacity 
            style={[
              styles.dateButton, 
              { 
                backgroundColor: colors.gray[100],
                borderColor: colors.gray[300],
              }
            ]}
            onPress={() => setShowDatePicker(true)}
          >
            <Calendar size={20} color={colors.gray[500]} />
            <Text style={[styles.dateText, { color: colors.text }]}>
              {format(scheduledDate, 'PPP p')}
            </Text>
          </TouchableOpacity>
          
          {showDatePicker && (
            <DateTimePicker
              value={scheduledDate}
              onChange={(date) => {
                setScheduledDate(date);
                setShowDatePicker(false);
              }}
              onClose={() => setShowDatePicker(false)}
            />
          )}
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Platform</Text>
          <View style={styles.optionsContainer}>
            {platformOptions.map(option => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.optionButton,
                  { 
                    borderColor: option.color,
                    backgroundColor: platform === option.value 
                      ? option.color + '20'
                      : colors.background,
                  }
                ]}
                onPress={() => setPlatform(option.value as any)}
              >
                <Text style={[
                  styles.optionText, 
                  { 
                    color: option.color,
                    fontFamily: platform === option.value ? 'Inter-Bold' : 'Inter-Regular'
                  }
                ]}>
                  {option.value}
                </Text>
                {platform === option.value && (
                  <View style={[styles.checkmark, { backgroundColor: option.color }]}>
                    <Check size={12} color="#fff" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Hashtags</Text>
          <TextInput
            style={[
              styles.input, 
              { 
                color: colors.text,
                backgroundColor: colors.gray[100],
                borderColor: colors.gray[300],
              }
            ]}
            placeholder="#summer #vacation"
            placeholderTextColor={colors.gray[400]}
            value={hashtags}
            onChangeText={setHashtags}
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Status</Text>
          <View style={styles.optionsContainer}>
            {statusOptions.map(option => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.statusButton,
                  { 
                    borderColor: option.color,
                    backgroundColor: status === option.value 
                      ? option.color + '20'
                      : colors.background,
                  }
                ]}
                onPress={() => setStatus(option.value as any)}
              >
                <Text style={[
                  styles.optionText, 
                  { 
                    color: option.color,
                    fontFamily: status === option.value ? 'Inter-Bold' : 'Inter-Regular'
                  }
                ]}>
                  {option.value}
                </Text>
                {status === option.value && (
                  <View style={[styles.checkmark, { backgroundColor: option.color }]}>
                    <Check size={12} color="#fff" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Notes</Text>
          <TextInput
            style={[
              styles.textArea, 
              { 
                color: colors.text,
                backgroundColor: colors.gray[100],
                borderColor: colors.gray[300],
                height: 100,
              }
            ]}
            placeholder="Add any additional notes here..."
            placeholderTextColor={colors.gray[400]}
            value={notes}
            onChangeText={setNotes}
            multiline
            maxLength={500}
          />
          <Text style={[styles.counter, { color: colors.gray[500] }]}>
            {notes.length}/500
          </Text>
        </View>
        
        <TouchableOpacity 
          style={[styles.saveButton, { backgroundColor: colors.primary }]}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>Save Post</Text>
        </TouchableOpacity>
        
        <View style={styles.bottomSpace} />
      </ScrollView>
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
  formContainer: {
    flex: 1,
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  textArea: {
    height: 120,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingTop: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlignVertical: 'top',
  },
  counter: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  dateButton: {
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
  },
  optionText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  checkmark: {
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
  saveButton: {
    height: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
  bottomSpace: {
    height: 40,
  },
});