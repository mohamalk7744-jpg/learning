import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { ScrollView, StyleSheet, View, Pressable, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useAuth } from "@/hooks/use-auth";
import { trpc } from "@/lib/trpc";

export default function LessonDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();

  const lessonId = id ? parseInt(id, 10) : 0;

  const { data: lesson, isLoading } = trpc.lessons.getById.useQuery(
    { id: lessonId },
    { enabled: lessonId > 0 }
  );

  const markCompleteMutation = trpc.studentProgress.markLessonComplete.useMutation({
    onSuccess: () => {
      router.back();
    },
  });

  const handleMarkComplete = () => {
    if (!user?.id || !lesson) return;
    
    markCompleteMutation.mutate({
      studentId: user.id,
      subjectId: lesson.subjectId,
      lessonId: lesson.id,
    });
  };

  if (isLoading) {
    return (
      <ThemedView style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" />
        <ThemedText type="default" style={styles.loadingText}>جاري التحميل...</ThemedText>
      </ThemedView>
    );
  }

  if (!lesson) {
    return (
      <ThemedView style={[styles.container, styles.centerContent]}>
        <ThemedText type="title">الدرس غير موجود</ThemedText>
        <Pressable 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ThemedText style={styles.backButtonText}>العودة</ThemedText>
        </Pressable>
      </ThemedView>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={{
        paddingTop: Math.max(insets.top, 16),
        paddingBottom: Math.max(insets.bottom, 16),
      }}
    >
      <ThemedView style={styles.header}>
        <Pressable 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ThemedText style={styles.backButtonText}>← العودة</ThemedText>
        </Pressable>
        <ThemedText type="title" style={styles.title}>{lesson.title}</ThemedText>
        <ThemedText type="default" style={styles.meta}>
          اليوم الدراسي: {lesson.dayNumber} | الترتيب: {lesson.order}
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.content}>
        <ThemedText type="default" style={styles.lessonContent}>
          {lesson.content}
        </ThemedText>
      </ThemedView>

      <View style={styles.actions}>
        <Pressable 
          style={({ pressed }) => [
            styles.completeButton,
            pressed && styles.completeButtonPressed,
            markCompleteMutation.isPending && styles.completeButtonDisabled
          ]}
          onPress={handleMarkComplete}
          disabled={markCompleteMutation.isPending}
        >
          {markCompleteMutation.isPending ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <ThemedText style={styles.completeButtonText}>✓ تم إكمال الدرس</ThemedText>
          )}
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 12,
    opacity: 0.7,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 16,
  },
  backButton: {
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: "flex-start",
  },
  backButtonText: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "600",
  },
  title: {
    marginBottom: 8,
  },
  meta: {
    fontSize: 14,
    opacity: 0.7,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    marginBottom: 20,
  },
  lessonContent: {
    fontSize: 16,
    lineHeight: 28,
    textAlign: "right",
  },
  actions: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  completeButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: "#34C759",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 50,
  },
  completeButtonPressed: {
    opacity: 0.8,
  },
  completeButtonDisabled: {
    opacity: 0.6,
  },
  completeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

