import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, useColorScheme, ScrollView, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { format } from 'date-fns';
import Colors from '@/constants/Colors';
import { getPostsByDate } from '@/utils/storage';
import { Post, CalendarMarking } from '@/types';
import PostItem from '@/components/PostItem';

export default function CalendarScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [selected, setSelected] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [posts, setPosts] = useState<Post[]>([]);
  const [markedDates, setMarkedDates] = useState<CalendarMarking>({});

  useEffect(() => {
    loadPosts();
  }, [selected]);

  const loadPosts = async () => {
    try {
      const postsForDay = await getPostsByDate(selected);
      setPosts(postsForDay);
      
      // Get all posts for marking
      const allPosts = await getPostsByDate();
      const newMarkedDates: CalendarMarking = {};
      
      allPosts.forEach(post => {
        const date = post.scheduledDate.split('T')[0]; // Extract just the date part
        if (date) {
          // Determine dot color based on post status
          let dotColor = colors.statusColors.Draft;
          if (post.status === 'Scheduled') {
            dotColor = colors.statusColors.Scheduled;
          } else if (post.status === 'Published') {
            dotColor = colors.statusColors.Published;
          }
          
          newMarkedDates[date] = {
            marked: true,
            dotColor,
            ...(date === selected ? { selected: true, selectedColor: colors.primary + '40' } : {})
          };
        }
      });
      
      // Make sure the selected date is marked
      if (!newMarkedDates[selected]) {
        newMarkedDates[selected] = {
          marked: false,
          selected: true,
          selectedColor: colors.primary + '40'
        };
      }
      
      setMarkedDates(newMarkedDates);
    } catch (error) {
      console.error('Failed to load posts:', error);
    }
  };

  const getFormattedDate = () => {
    const date = new Date(selected);
    return format(date, 'MMMM d, yyyy');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Content Calendar</Text>
      </View>
      
      <Calendar
        style={styles.calendar}
        theme={{
          calendarBackground: colors.background,
          textSectionTitleColor: colors.gray[600],
          textSectionTitleDisabledColor: colors.gray[400],
          selectedDayBackgroundColor: colors.primary,
          selectedDayTextColor: '#ffffff',
          todayTextColor: colors.primary,
          dayTextColor: colors.text,
          textDisabledColor: colors.gray[400],
          dotColor: colors.primary,
          selectedDotColor: '#ffffff',
          arrowColor: colors.primary,
          disabledArrowColor: colors.gray[300],
          monthTextColor: colors.text,
          indicatorColor: colors.primary,
          textDayFontFamily: 'Inter-Regular',
          textMonthFontFamily: 'Inter-Bold',
          textDayHeaderFontFamily: 'Inter-Medium',
        }}
        onDayPress={day => {
          setSelected(day.dateString);
        }}
        markedDates={markedDates}
      />
      
      <View style={styles.dateContainer}>
        <Text style={[styles.dateText, { color: colors.text }]}>{getFormattedDate()}</Text>
        <Text style={[styles.postCount, { color: colors.gray[500] }]}>
          {posts.length} {posts.length === 1 ? 'post' : 'posts'}
        </Text>
      </View>
      
      <ScrollView style={styles.postsContainer}>
        {posts.length > 0 ? (
          posts.map(post => (
            <PostItem key={post.id} post={post} onUpdate={loadPosts} />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.gray[500] }]}>
              No posts scheduled for this date
            </Text>
          </View>
        )}
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
  calendar: {
    borderRadius: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    margin: 16,
    marginBottom: 8,
  },
  dateContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
  },
  postCount: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  postsContainer: {
    flex: 1,
    padding: 16,
    paddingTop: 8,
  },
  emptyContainer: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
});