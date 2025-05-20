import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, useColorScheme, FlatList, TouchableOpacity } from 'react-native';
import Colors from '@/constants/Colors';
import { getAllPosts } from '@/utils/storage';
import { Post } from '@/types';
import PostItem from '@/components/PostItem';
import { Router, useRouter } from 'expo-router';
import { Filter } from 'lucide-react-native';

export default function PostsScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [filter, setFilter] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    if (filter) {
      setFilteredPosts(posts.filter(post => post.status === filter));
    } else {
      setFilteredPosts(posts);
    }
  }, [filter, posts]);

  const loadPosts = async () => {
    try {
      const allPosts = await getAllPosts();
      // Sort by scheduled date (newest first)
      const sortedPosts = allPosts.sort((a, b) => 
        new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime()
      );
      setPosts(sortedPosts);
      setFilteredPosts(sortedPosts);
    } catch (error) {
      console.error('Failed to load posts:', error);
    }
  };

  const filterOptions = [
    { label: 'All', value: null },
    { label: 'Draft', value: 'Draft' },
    { label: 'Scheduled', value: 'Scheduled' },
    { label: 'Published', value: 'Published' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>All Posts</Text>
        <TouchableOpacity style={[styles.filterButton, { backgroundColor: colors.gray[100] }]}>
          <Filter size={20} color={colors.gray[700]} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.filterContainer}>
        {filterOptions.map(option => (
          <TouchableOpacity
            key={option.label}
            style={[
              styles.filterOption,
              {
                backgroundColor: filter === option.value ? colors.primary : colors.gray[100],
              },
            ]}
            onPress={() => setFilter(option.value)}
          >
            <Text
              style={[
                styles.filterText,
                {
                  color: filter === option.value ? 'white' : colors.gray[700],
                },
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <FlatList
        data={filteredPosts}
        renderItem={({ item }) => (
          <PostItem post={item} onUpdate={loadPosts} />
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.gray[500] }]}>
              No posts found. Create a new post to get started!
            </Text>
            <TouchableOpacity 
              style={[styles.createButton, { backgroundColor: colors.primary }]}
              onPress={() => router.push('/create')}
            >
              <Text style={styles.createButtonText}>Create Post</Text>
            </TouchableOpacity>
          </View>
        }
      />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  filterOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  filterText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  listContainer: {
    padding: 16,
    paddingTop: 0,
  },
  emptyContainer: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    marginBottom: 16,
  },
  createButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  createButtonText: {
    color: 'white',
    fontFamily: 'Inter-Medium',
    fontSize: 16,
  },
});