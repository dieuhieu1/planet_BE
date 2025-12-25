-- Complete CASCADE migration for all foreign keys related to Users and Quizzes

-- 1. CASCADE for Users -> QuizAttempts
ALTER TABLE "QuizAttempts" 
DROP CONSTRAINT IF EXISTS "QuizAttempts_userId_fkey";

ALTER TABLE "QuizAttempts"
ADD CONSTRAINT "QuizAttempts_userId_fkey" 
    FOREIGN KEY ("userId") 
    REFERENCES "Users"(id) 
    ON DELETE CASCADE;

-- 2. CASCADE for Users -> Quizzes
ALTER TABLE "Quizzes" 
DROP CONSTRAINT IF EXISTS "Quizzes_creatorId_fkey";

ALTER TABLE "Quizzes"
ADD CONSTRAINT "Quizzes_creatorId_fkey" 
    FOREIGN KEY ("creatorId") 
    REFERENCES "Users"(id) 
    ON DELETE CASCADE;

-- 3. CASCADE for QuizAttempts -> AttemptDetails
ALTER TABLE "AttemptDetails" 
DROP CONSTRAINT IF EXISTS "fk_detail_attempt";

ALTER TABLE "AttemptDetails"
ADD CONSTRAINT "fk_detail_attempt" 
    FOREIGN KEY ("attemptId") 
    REFERENCES "QuizAttempts"(id) 
    ON DELETE CASCADE;

-- 4. CASCADE for Quizzes -> Questions (if exists)
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'Questions'
    ) THEN
        ALTER TABLE "Questions" 
        DROP CONSTRAINT IF EXISTS "Questions_quizId_fkey";
        
        ALTER TABLE "Questions"
        ADD CONSTRAINT "Questions_quizId_fkey" 
            FOREIGN KEY ("quizId") 
            REFERENCES "Quizzes"(id) 
            ON DELETE CASCADE;
    END IF;
END $$;

-- 5. CASCADE for Questions -> Answers (if exists)
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'Answers'
    ) THEN
        ALTER TABLE "Answers" 
        DROP CONSTRAINT IF EXISTS "Answers_questionId_fkey";
        
        ALTER TABLE "Answers"
        ADD CONSTRAINT "Answers_questionId_fkey" 
            FOREIGN KEY ("questionId") 
            REFERENCES "Questions"(id) 
            ON DELETE CASCADE;
    END IF;
END $$;

-- 6. CASCADE for AttemptDetails -> Questions/Answers (if exists)
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'AttemptDetails' AND column_name = 'questionId'
    ) THEN
        ALTER TABLE "AttemptDetails" 
        DROP CONSTRAINT IF EXISTS "AttemptDetails_questionId_fkey";
        
        ALTER TABLE "AttemptDetails"
        ADD CONSTRAINT "AttemptDetails_questionId_fkey" 
            FOREIGN KEY ("questionId") 
            REFERENCES "Questions"(id) 
            ON DELETE CASCADE;
    END IF;
END $$;

-- Success message
SELECT 'CASCADE constraints added successfully!' as result;
