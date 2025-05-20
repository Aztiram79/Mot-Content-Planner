import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  useColorScheme,
  Platform,
  Alert
} from 'react-native';
import Colors from '@/constants/Colors';
import { format } from 'date-fns';
import { updatePostStatus, deletePost } from '@/utils/storage';
import { Post } from '@/types';
import { CalendarClock, Hash, MoveHorizontal as MoreHorizontal, Pencil, Trash2 } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

interface PostItemProps {
  post: Post;
  onUpdate: () => void;
}

export default function PostItem({ post, onUpdate }: PostItemProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [showActions, setShowActions] = useState(false);
  
  const getPlatformColor = (platform: string) => {
    return colors.platformColors[platform as keyof typeof colors.platformColors] || colors.gray[500];
  };
  
  const getStatusColor = (status: string) => {
    return colors.statusColors[status as keyof typeof colors.statusColors] || colors.gray[500];
  };
  
  const handleStatusChange = async (newStatus: 'Draft' | 'Scheduled' | 'Published') => {
    try {
      await updatePostStatus(post.id, newStatus);
      onUpdate();
      
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      console.error('Failed to update post status:', error);
    }
  };
  
  const handleDelete = async () => {
    const confirmDelete = async () => {
      try {
        await deletePost(post.id);
        onUpdate();
        
        if (Platform.OS !== 'web') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
      } catch (error) {
        console.error('Failed to delete post:', error);
      }
    };
    
    if (Platform.OS === 'web') {
      if (confirm('Are you sure you want to delete this post?')) {
        confirmDelete();
      }
    } else {
      Alert.alert(
        'Delete Post',
        'Are you sure you want to delete this post?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete', style: 'destructive', onPress: confirmDelete },
        ]
      );
    }
  };
  
  const toggleActions = () => {
    setShowActions(!showActions);
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };
  
  return (
    <View style={[
      styles.container, 
      { 
        backgroundColor: colors.gray[100],
        borderLeftColor: getPlatformColor(post.platform),
      }
    ]}>
      <View style={styles.header}>
        <View style={styles.platformContainer}>
          <Text style={[styles.platform, { color: getPlatformColor(post.platform) }]}>
            {post.platform}
          </Text>
          <View style={[
            styles.statusBadge, 
            { backgroundColor: getStatusColor(post.status) + '20' }
          ]}>
            <Text style={[
              styles.statusText,
              { color: getStatusColor(post.status) }
            ]}>
              {post.status}
            </Text>
          </View>
        </View>
        
        <TouchableOpacity onPress={toggleActions}>
          <MoreHorizontal size={24} color={colors.gray[500]} />
        </TouchableOpacity>
      </View>
      
      {showActions && (
        <View style={[styles.actionsContainer, { backgroundColor: colors.background }]}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleStatusChange('Draft')}
          >
            <Text style={[styles.actionText, { color: colors.text }]}>
              Mark as Draft
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleStatusChange('Scheduled')}
          >
            <Text style={[styles.actionText, { color: colors.text }]}>
              Mark as Scheduled
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleStatusChange('Published')}
          >
            <Text style={[styles.actionText, { color: colors.text }]}>
              Mark as Published
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.deleteButton]}
            onPress={handleDelete}
          >
            <Trash2 size={16} color={colors.error} />
            <Text style={[styles.actionText, { color: colors.error, marginLeft: 4 }]}>
              Delete
            </Text>
          </TouchableOpacity>
        </View>
      )}
      
      <Text style={[styles.postText, { color: colors.text }]}>{post.text}</Text>
      
      <View style={styles.metaContainer}>
        <View style={styles.metaItem}>
          <CalendarClock size={16} color={colors.gray[500]} />
          <Text style={[styles.metaText, { color: colors.gray[600] }]}>
            {format(new Date(post.scheduledDate), 'MMM d, yyyy - h:mm a')}
          </Text>
        </View>
        
        {post.hashtags ? (
          <View style={styles.metaItem}>
            <Hash size={16} color={colors.gray[500]} />
            <Text style={[styles.metaText, { color: colors.gray[600] }]}>
              {post.hashtags}
            </Text>
          </View>
        ) : null}
      </View>
      
      {post.notes ? (
        <View style={[styles.notesContainer, { backgroundColor: colors.gray[200] }]}>
          <Text style={[styles.notesText, { color: colors.gray[700] }]}>
            {post.notes}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
    borderLeftWidth: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  platformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  platform: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  actionsContainer: {
    padding: 8,
    borderRadius: 8,
    marginHorizontal: 12,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  actionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  postText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    lineHeight: 22,
    padding: 12,
    paddingTop: 0,
  },
  metaContainer: {
    padding: 12,
    paddingTop: 0,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  metaText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginLeft: 6,
  },
  notesContainer: {
    padding: 12,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  notesText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    fontStyle: 'italic',
  },
});