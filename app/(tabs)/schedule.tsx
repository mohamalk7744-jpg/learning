import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { ScrollView, StyleSheet, View, Pressable, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth } from "@/hooks/use-auth";
import { trpc } from "@/lib/trpc";
import { useState, useEffect } from "react";

export default function ScheduleScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null);

  // جلب المواد المشتركة للطالب
  const { data: studentSubjects, isLoading: loadingSubjects } = trpc.chat.getStudentSubjects.useQuery(
    { studentId: user?.id || 0 },
    { enabled: !!user?.id }
  );

  // جلب الدروس للمادة المختارة
  const { data: lessons, isLoading: loadingLessons } = trpc.lessons.listBySubject.useQuery(
    { subjectId: selectedSubjectId || 0 },
    { enabled: !!selectedSubjectId }
  );

  // جلب الاختبارات للمادة المختارة
  const { data: quizzes, isLoading: loadingQuizzes } = trpc.quizzes.listBySubject.useQuery(
    { subjectId: selectedSubjectId || 0 },
    { enabled: !!selectedSubjectId }
  );

  // اختيار المادة الأولى تلقائياً
  useEffect(() => {
    if (studentSubjects && studentSubjects.length > 0 && !selectedSubjectId) {
      setSelectedSubjectId(studentSubjects[0].id);
    }
  }, [studentSubjects, selectedSubjectId]);

  const handleStartLesson = (lessonId: number) => {
    router.push(`/lesson/${lessonId}`);
  };

  const handleTakeQuiz = (quizId: number) => {
    router.push(`/quiz/${quizId}`);
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={{
        paddingTop: Math.max(insets.top, 16),
        paddingBottom: Math.max(insets.bottom, 16),
      }}
    >
      <ThemedView style={styles.header}>
        <ThemedText type="title">الخطة الدراسية</ThemedText>
        <ThemedText type="default" style={styles.date}>
          {new Date().toLocaleDateString("ar-SA", { 
            weekday: "long", 
            year: "numeric", 
            month: "long", 
            day: "numeric" 
          })}
        </ThemedText>
        
        {/* اختيار المادة */}
        {studentSubjects && studentSubjects.length > 0 && (
          <View style={styles.subjectSelector}>
            <ThemedText type="default" style={styles.subjectLabel}>المادة:</ThemedText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.subjectScroll}>
              {studentSubjects.map((subject) => (
                <Pressable
                  key={subject.id}
                  style={[
                    styles.subjectButton,
                    selectedSubjectId === subject.id && styles.subjectButtonActive
                  ]}
                  onPress={() => setSelectedSubjectId(subject.id)}
                >
                  <ThemedText 
                    style={[
                      styles.subjectButtonText,
                      selectedSubjectId === subject.id && styles.subjectButtonTextActive
                    ]}
                  >
                    {subject.name}
                  </ThemedText>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}
      </ThemedView>

      {loadingLessons || loadingQuizzes ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <>
          {/* Lessons Section */}
          <ThemedView style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>📚 الدروس</ThemedText>
            {lessons && lessons.length > 0 ? (
              lessons.map((lesson) => (
                <Pressable 
                  key={lesson.id}
                  style={({ pressed }) => [
                    styles.lessonItem,
                    pressed && styles.lessonItemPressed
                  ]}
                  onPress={() => handleStartLesson(lesson.id)}
                >
                  <View style={styles.lessonItemContent}>
                    <ThemedText type="defaultSemiBold" style={styles.lessonName}>
                      {lesson.title}
                    </ThemedText>
                    <ThemedText type="default" style={styles.lessonChapter}>
                      اليوم الدراسي: {lesson.dayNumber} | الترتيب: {lesson.order}
                    </ThemedText>
                  </View>
                  <Pressable 
                    style={styles.startButton}
                    onPress={() => handleStartLesson(lesson.id)}
                  >
                    <ThemedText style={styles.startButtonText}>ابدأ</ThemedText>
                  </Pressable>
                </Pressable>
              ))
            ) : (
              <ThemedText type="default" style={styles.emptyText}>
                لا توجد دروس متاحة
              </ThemedText>
            )}
          </ThemedView>

          {/* Quizzes Section */}
          <ThemedView style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>✏️ الاختبارات</ThemedText>
            {quizzes && quizzes.length > 0 ? (
              quizzes.map((quiz) => (
                <Pressable 
                  key={quiz.id}
                  style={({ pressed }) => [
                    styles.quizItem,
                    pressed && styles.quizItemPressed
                  ]}
                  onPress={() => handleTakeQuiz(quiz.id)}
                >
                  <View style={styles.quizItemContent}>
                    <ThemedText type="defaultSemiBold" style={styles.quizName}>
                      {quiz.title}
                    </ThemedText>
                    {quiz.description && (
                      <ThemedText type="default" style={styles.quizDescription}>
                        {quiz.description}
                      </ThemedText>
                    )}
                    <View style={styles.quizMeta}>
                      <ThemedText type="default" style={styles.metaText}>
                        النوع: {quiz.type === "daily" ? "يومي" : quiz.type === "monthly" ? "شهري" : "فصلي"}
                      </ThemedText>
                    </View>
                  </View>
                  <Pressable 
                    style={styles.takeButton}
                    onPress={() => handleTakeQuiz(quiz.id)}
                  >
                    <ThemedText style={styles.takeButtonText}>اختبر</ThemedText>
                  </Pressable>
                </Pressable>
              ))
            ) : (
              <ThemedText type="default" style={styles.emptyText}>
                لا توجد اختبارات متاحة
              </ThemedText>
            )}
          </ThemedView>
        </>
      )}

      {/* Progress Section */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>📊 التقدم</ThemedText>
        <View style={styles.progressCard}>
          <View style={styles.progressItem}>
            <ThemedText type="default">الدروس المكتملة</ThemedText>
            <ThemedText type="defaultSemiBold" style={styles.progressNumber}>12 / 30</ThemedText>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: "40%" }]} />
          </View>
        </View>
      </ThemedView>
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
    paddingVertical: 40,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    marginBottom: 16,
  },
  date: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 4,
  },
  subjectSelector: {
    marginTop: 12,
    gap: 8,
  },
  subjectLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  subjectScroll: {
    marginTop: 4,
  },
  subjectButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.08)",
    marginRight: 8,
  },
  subjectButtonActive: {
    backgroundColor: "#007AFF",
  },
  subjectButtonText: {
    fontSize: 13,
    color: "#000",
  },
  subjectButtonTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  emptyText: {
    textAlign: "center",
    opacity: 0.6,
    paddingVertical: 20,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
    gap: 12,
  },
  sectionTitle: {
    marginBottom: 8,
  },
  lessonItem: {
    flexDirection: "row",
    padding: 12,
    borderRadius: 10,
    backgroundColor: "rgba(0, 122, 255, 0.08)",
    alignItems: "center",
    justifyContent: "space-between",
  },
  lessonItemPressed: {
    opacity: 0.6,
  },
  lessonItemContent: {
    flex: 1,
    gap: 4,
  },
  lessonName: {
    fontSize: 15,
  },
  lessonChapter: {
    fontSize: 13,
    opacity: 0.7,
    marginTop: 4,
  },
  quizDescription: {
    fontSize: 13,
    opacity: 0.7,
    marginTop: 4,
  },
  lessonMeta: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
  },
  metaText: {
    fontSize: 12,
    opacity: 0.6,
  },
  startButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#007AFF",
    marginLeft: 8,
  },
  startButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  quizItem: {
    flexDirection: "row",
    padding: 12,
    borderRadius: 10,
    backgroundColor: "rgba(255, 149, 0, 0.08)",
    alignItems: "center",
    justifyContent: "space-between",
  },
  quizItemPressed: {
    opacity: 0.6,
  },
  quizItemContent: {
    flex: 1,
    gap: 4,
  },
  quizName: {
    fontSize: 15,
  },
  quizMeta: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
  },
  takeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#FF9500",
    marginLeft: 8,
  },
  takeButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  progressCard: {
    padding: 16,
    borderRadius: 10,
    backgroundColor: "rgba(0, 122, 255, 0.08)",
    gap: 12,
  },
  progressItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressNumber: {
    fontSize: 16,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#007AFF",
    borderRadius: 4,
  },
});
