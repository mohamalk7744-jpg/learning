import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { ScrollView, StyleSheet, View, TextInput, Pressable, ActivityIndicator, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/use-auth";
import { trpc } from "@/lib/trpc";

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  // جلب المواد المشتركة للطالب
  const { data: studentSubjects, isLoading: loadingSubjects } = trpc.chat.getStudentSubjects.useQuery(
    { studentId: user?.id || 0 },
    { enabled: !!user?.id }
  );

  // جلب سجل المحادثة
  const { data: chatHistory, isLoading: loadingHistory, refetch: refetchHistory } = 
    trpc.chat.getHistory.useQuery(
      { 
        studentId: user?.id || 0, 
        subjectId: selectedSubjectId || 0 
      },
      { 
        enabled: !!user?.id && !!selectedSubjectId,
        refetchOnMount: true,
      }
    );

  // Mutation لإرسال الرسالة
  const sendMessageMutation = trpc.chat.sendMessage.useMutation({
    onSuccess: () => {
      refetchHistory();
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    },
    onError: (error) => {
      Alert.alert(
        "خطأ",
        error.message || "حدث خطأ أثناء إرسال الرسالة"
      );
    },
  });

  // تحويل سجل المحادثة إلى رسائل للعرض
  const messages = chatHistory?.map((entry, index) => [
    { id: `user-${index}`, type: "user" as const, text: entry.question },
    { id: `bot-${index}`, type: "bot" as const, text: entry.answer },
  ]).flat() || [];

  // إضافة رسالة ترحيبية إذا لم تكن هناك رسائل
  const displayMessages = messages.length === 0 && selectedSubjectId
    ? [{ id: "welcome", type: "bot" as const, text: "مرحباً! أنا بوت التعليم الذكي. كيف يمكنني مساعدتك في هذه المادة؟" }]
    : messages;

  // إرسال رسالة
  const sendMessage = async () => {
    if (!message.trim() || !selectedSubjectId || !user?.id || sendMessageMutation.isPending) return;

    const question = message.trim();
    setMessage("");

    sendMessageMutation.mutate({
      studentId: user.id,
      subjectId: selectedSubjectId,
      question: question,
    });
  };

  // اختيار المادة الأولى تلقائياً
  useEffect(() => {
    if (studentSubjects && studentSubjects.length > 0 && !selectedSubjectId) {
      setSelectedSubjectId(studentSubjects[0].id);
    }
  }, [studentSubjects, selectedSubjectId]);

  if (!user) {
    return (
      <ThemedView style={[styles.container, styles.centerContent]}>
        <ThemedText type="title">الرجاء تسجيل الدخول</ThemedText>
      </ThemedView>
    );
  }

  if (loadingSubjects) {
    return (
      <ThemedView style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" />
        <ThemedText type="default" style={styles.loadingText}>جاري التحميل...</ThemedText>
      </ThemedView>
    );
  }

  if (!studentSubjects || studentSubjects.length === 0) {
    return (
      <ThemedView style={[styles.container, styles.centerContent]}>
        <ThemedText type="title">لا توجد مواد متاحة</ThemedText>
        <ThemedText type="default" style={styles.subtitle}>
          يجب أن تكون مشتركاً في مادة على الأقل لاستخدام البوت
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView 
      style={[
        styles.container,
        {
          paddingTop: Math.max(insets.top, 16),
          paddingBottom: Math.max(insets.bottom, 16),
        }
      ]}
    >
      <ThemedView style={styles.header}>
        <ThemedText type="title">البوت الذكي</ThemedText>
        <ThemedText type="default" style={styles.subtitle}>اسأل أي سؤال عن المنهاج</ThemedText>
        
        {/* اختيار المادة */}
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
      </ThemedView>

      {loadingHistory ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <ScrollView 
          ref={scrollViewRef}
          style={styles.messagesContainer}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {displayMessages.map((msg) => (
            <View 
              key={msg.id}
              style={[
                styles.messageWrapper,
                msg.type === "user" ? styles.userMessageWrapper : styles.botMessageWrapper
              ]}
            >
              <View 
                style={[
                  styles.messageBubble,
                  msg.type === "user" ? styles.userMessage : styles.botMessage
                ]}
              >
                <ThemedText 
                  type="default"
                  style={[
                    styles.messageText,
                    msg.type === "user" && styles.userMessageText
                  ]}
                >
                  {msg.text}
                </ThemedText>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="اكتب سؤالك هنا..."
          placeholderTextColor="#999"
          value={message}
          onChangeText={setMessage}
          multiline
          maxHeight={100}
          editable={!sendMessageMutation.isPending && !!selectedSubjectId}
        />
        <Pressable 
          style={({ pressed }) => [
            styles.sendButton,
            (pressed || sendMessageMutation.isPending || !selectedSubjectId) && styles.sendButtonPressed,
            (!selectedSubjectId || sendMessageMutation.isPending) && styles.sendButtonDisabled
          ]}
          onPress={sendMessage}
          disabled={!selectedSubjectId || sendMessageMutation.isPending}
        >
          {sendMessageMutation.isPending ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <ThemedText style={styles.sendButtonText}>إرسال</ThemedText>
          )}
        </Pressable>
      </View>
    </ThemedView>
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
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 13,
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
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  messageWrapper: {
    marginBottom: 12,
    flexDirection: "row",
  },
  userMessageWrapper: {
    justifyContent: "flex-end",
  },
  botMessageWrapper: {
    justifyContent: "flex-start",
  },
  messageBubble: {
    maxWidth: "80%",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  userMessage: {
    backgroundColor: "#007AFF",
  },
  botMessage: {
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userMessageText: {
    color: "#fff",
  },
  inputContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    alignItems: "flex-end",
  },
  input: {
    flex: 1,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "rgba(0, 0, 0, 0.08)",
    fontSize: 14,
    maxHeight: 100,
  },
  sendButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    minWidth: 70,
  },
  sendButtonPressed: {
    opacity: 0.8,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
