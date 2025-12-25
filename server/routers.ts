import { z } from "zod";
import { systemRouter } from "./_core/systemRouter";
import { router } from "./_core/trpc";
import * as db from "./db";
import { authRouter } from "./routers/auth";

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: authRouter,

  subjects: router({
    list: protectedProcedure.query(() => db.getSubjects()),
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input }) => db.getSubjectById(input.id)),
    create: protectedProcedure
      .input(
        z.object({
          name: z.string().min(1),
          description: z.string().optional(),
          numberOfDays: z.number().default(30),
        })
      )
      .mutation(({ ctx, input }) =>
        db.createSubject({
          name: input.name,
          description: input.description,
          numberOfDays: input.numberOfDays,
          createdBy: ctx.user.id,
        })
      ),
    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          name: z.string().optional(),
          description: z.string().optional(),
          numberOfDays: z.number().optional(),
        })
      )
      .mutation(({ input }) => db.updateSubject(input.id, input)),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => db.deleteSubject(input.id)),
  }),

  lessons: router({
    listBySubject: protectedProcedure
      .input(z.object({ subjectId: z.number() }))
      .query(({ input }) => db.getLessonsBySubject(input.subjectId)),
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input }) => db.getLessonById(input.id)),
    create: protectedProcedure
      .input(
        z.object({
          subjectId: z.number(),
          title: z.string().min(1),
          content: z.string().min(1),
          dayNumber: z.number().min(1).max(30),
          order: z.number().default(1),
        })
      )
      .mutation(({ ctx, input }) =>
        db.createLesson({
          subjectId: input.subjectId,
          title: input.title,
          content: input.content,
          dayNumber: input.dayNumber,
          order: input.order,
          createdBy: ctx.user.id,
        })
      ),
    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          title: z.string().optional(),
          content: z.string().optional(),
          dayNumber: z.number().optional(),
          order: z.number().optional(),
        })
      )
      .mutation(({ input }) => db.updateLesson(input.id, input)),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => db.deleteLesson(input.id)),
  }),

  quizzes: router({
    listBySubject: protectedProcedure
      .input(z.object({ subjectId: z.number() }))
      .query(({ input }) => db.getQuizzesBySubject(input.subjectId)),
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input }) => db.getQuizById(input.id)),
    create: protectedProcedure
      .input(
        z.object({
          subjectId: z.number(),
          title: z.string().min(1),
          description: z.string().optional(),
          type: z.enum(["daily", "monthly", "semester"]),
          dayNumber: z.number().optional(),
          scheduledDate: z.date().optional(),
        })
      )
      .mutation(({ ctx, input }) =>
        db.createQuiz({
          subjectId: input.subjectId,
          title: input.title,
          description: input.description,
          type: input.type,
          dayNumber: input.dayNumber,
          scheduledDate: input.scheduledDate,
          createdBy: ctx.user.id,
        })
      ),
    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          title: z.string().optional(),
          description: z.string().optional(),
          type: z.enum(["daily", "monthly", "semester"]).optional(),
          dayNumber: z.number().optional(),
          scheduledDate: z.date().optional(),
        })
      )
      .mutation(({ input }) => db.updateQuiz(input.id, input)),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => db.deleteQuiz(input.id)),
  }),

  discounts: router({
    list: protectedProcedure.query(() => db.getActiveDiscounts()),
    create: protectedProcedure
      .input(
        z.object({
          title: z.string().min(1),
          description: z.string().optional(),
          discountType: z.enum(["percentage", "fixed"]),
          discountValue: z.number().min(0),
          company: z.string().min(1),
          imageUrl: z.string().optional(),
        })
      )
      .mutation(({ ctx, input }) =>
        db.createDiscount({
          title: input.title,
          description: input.description,
          discountType: input.discountType,
          discountValue: input.discountValue,
          company: input.company,
          imageUrl: input.imageUrl,
          isActive: true,
          createdBy: ctx.user.id,
        })
      ),
    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          title: z.string().optional(),
          description: z.string().optional(),
          discountType: z.enum(["percentage", "fixed"]).optional(),
          discountValue: z.number().optional(),
          company: z.string().optional(),
          imageUrl: z.string().optional(),
          isActive: z.number().optional(),
        })
      )
      .mutation(({ input }) => db.updateDiscount(input.id, input)),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => db.deleteDiscount(input.id)),
  }),

  accessPermissions: router({
    getStudentAccess: protectedProcedure
      .input(z.object({ studentId: z.number(), subjectId: z.number() }))
      .query(({ input }) =>
        db.getStudentSubjectAccess(input.studentId, input.subjectId)
      ),
    create: protectedProcedure
      .input(
        z.object({
          studentId: z.number(),
          subjectId: z.number(),
          hasAccess: z.boolean().default(true),
          startDate: z.date().optional(),
          endDate: z.date().optional(),
        })
      )
      .mutation(({ ctx, input }) =>
        db.createAccessPermission({
          studentId: input.studentId,
          subjectId: input.subjectId,
          hasAccess: input.hasAccess,
          startDate: input.startDate,
          endDate: input.endDate,
          createdBy: ctx.user.id,
        })
      ),
    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          hasAccess: z.boolean().optional(),
          startDate: z.date().optional(),
          endDate: z.date().optional(),
        })
      )
      .mutation(({ input }) => db.updateAccessPermission(input.id, input)),
  }),

  studentProgress: router({
    getProgress: protectedProcedure
      .input(z.object({ studentId: z.number(), subjectId: z.number() }))
      .query(({ input }) =>
        db.getStudentProgress(input.studentId, input.subjectId)
      ),
    markLessonComplete: protectedProcedure
      .input(
        z.object({
          studentId: z.number(),
          subjectId: z.number(),
          lessonId: z.number(),
        })
      )
      .mutation(({ input }) =>
        db.createStudentProgress({
          studentId: input.studentId,
          subjectId: input.subjectId,
          lessonId: input.lessonId,
          isCompleted: true,
          completedAt: new Date(),
        })
      ),
  }),

  chat: router({
    getHistory: protectedProcedure
      .input(z.object({ studentId: z.number(), subjectId: z.number() }))
      .query(async ({ input, ctx }) => {
        // التحقق من أن الطالب لديه صلاحية الوصول للمادة
        const access = await db.getStudentSubjectAccess(input.studentId, input.subjectId);
        if (!access || !access.hasAccess) {
          throw new Error("ليس لديك صلاحية الوصول لهذه المادة");
        }
        return db.getChatHistory(input.studentId, input.subjectId);
      }),
    sendMessage: protectedProcedure
      .input(
        z.object({
          studentId: z.number(),
          subjectId: z.number(),
          question: z.string().min(1),
        })
      )
      .mutation(async ({ input, ctx }) => {
        // التحقق من أن الطالب لديه صلاحية الوصول للمادة
        const access = await db.getStudentSubjectAccess(input.studentId, input.subjectId);
        if (!access || !access.hasAccess) {
          throw new Error("ليس لديك صلاحية الوصول لهذه المادة");
        }

        // الحصول على معلومات المادة
        const subject = await db.getSubjectById(input.subjectId);
        if (!subject) {
          throw new Error("المادة غير موجودة");
        }

        // الحصول على جميع دروس المادة لاستخدامها كسياق
        const lessons = await db.getLessonsBySubject(input.subjectId);
        const lessonsContext = lessons
          .map((lesson) => `- ${lesson.title}: ${lesson.content.substring(0, 500)}`)
          .join("\n");

        // الحصول على سجل المحادثة السابق
        const chatHistory = await db.getChatHistory(input.studentId, input.subjectId);

        // تحضير الرسائل لـ Gemini
        const { callGeminiAPI, convertChatHistoryToGemini } = await import("./_core/gemini");
        
        const historyMessages = convertChatHistoryToGemini(
          chatHistory.map((h) => ({
            question: h.question,
            answer: h.answer,
          }))
        );

        // إضافة السؤال الحالي
        historyMessages.push({
          role: "user",
          parts: [{ text: input.question }],
        });

        // إنشاء system instruction متخصص للمادة
        const systemInstruction = `أنت مساعد تعليمي متخصص في مادة "${subject.name}".

${subject.description ? `وصف المادة: ${subject.description}` : ""}

المنهج الدراسي:
${lessonsContext || "لا توجد دروس متاحة حالياً"}

تعليمات مهمة:
1. يجب أن تجيب فقط على الأسئلة المتعلقة بمادة ${subject.name} والمنهج المحدد أعلاه
2. إذا سألك الطالب عن مادة أخرى أو موضوع خارج المنهج، أخبره بلطف أنك متخصص فقط في ${subject.name}
3. استخدم المعلومات من الدروس المذكورة أعلاه للإجابة
4. قدم إجابات واضحة ومفيدة باللغة العربية
5. إذا لم تكن متأكداً من الإجابة، اعترف بذلك واقترح مراجعة الدرس المناسب`;

        // استدعاء Gemini API
        const answer = await callGeminiAPI(historyMessages, systemInstruction);

        // حفظ الرسالة في قاعدة البيانات
        await db.createChatMessage({
          studentId: input.studentId,
          subjectId: input.subjectId,
          question: input.question,
          answer: answer,
        });

        return {
          question: input.question,
          answer: answer,
        };
      }),
    getStudentSubjects: protectedProcedure
      .input(z.object({ studentId: z.number() }))
      .query(({ input }) => db.getStudentSubjects(input.studentId)),
  }),

  notifications: router({
    getUserNotifications: protectedProcedure
      .input(z.object({ userId: z.number() }))
      .query(({ input }) => db.getUserNotifications(input.userId)),
    create: protectedProcedure
      .input(
        z.object({
          userId: z.number(),
          title: z.string().min(1),
          message: z.string().min(1),
          type: z.enum(["lesson", "quiz", "discount", "grade", "general"]),
          relatedId: z.number().optional(),
        })
      )
      .mutation(({ input }) =>
        db.createNotification({
          userId: input.userId,
          title: input.title,
          message: input.message,
          type: input.type,
          relatedId: input.relatedId,
          isRead: false,
        })
      ),
    markAsRead: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => db.markNotificationAsRead(input.id)),
  }),

  studentAnswers: router({
    getAnswers: protectedProcedure
      .input(z.object({ studentId: z.number(), quizId: z.number() }))
      .query(({ input }) =>
        db.getStudentAnswers(input.studentId, input.quizId)
      ),
    submitAnswer: protectedProcedure
      .input(
        z.object({
          quizId: z.number(),
          studentId: z.number(),
          questionId: z.number(),
          selectedOptionId: z.number().optional(),
          textAnswer: z.string().optional(),
          imageUrl: z.string().optional(),
        })
      )
      .mutation(({ input }) =>
        db.createStudentAnswer({
          quizId: input.quizId,
          studentId: input.studentId,
          questionId: input.questionId,
          selectedOptionId: input.selectedOptionId,
          textAnswer: input.textAnswer,
          imageUrl: input.imageUrl,
          submittedAt: new Date(),
        })
      ),
    gradeAnswer: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          score: z.number(),
          feedback: z.string().optional(),
        })
      )
      .mutation(({ ctx, input }) =>
        db.updateStudentAnswer(input.id, {
          score: input.score,
          feedback: input.feedback,
          gradedAt: new Date(),
          gradedBy: ctx.user.id,
        })
      ),
  }),
});

export type AppRouter = typeof appRouter;
