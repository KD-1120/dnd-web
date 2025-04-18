/**
 * Service class for handling Q&A functionality
 */
export class QAService {
    static async createQuestion(eventId, questionData) {
        try {
            const questions = JSON.parse(localStorage.getItem(`questions_${eventId}`) || '[]');
            const newQuestion = {
                id: Date.now().toString(),
                eventId,
                status: 'pending',
                upvotes: 0,
                responses: [],
                createdAt: new Date().toISOString(),
                ...questionData
            };
            
            questions.push(newQuestion);
            localStorage.setItem(`questions_${eventId}`, JSON.stringify(questions));
            return newQuestion;
        } catch (error) {
            console.error('Error creating question:', error);
            throw new Error('Failed to create question');
        }
    }

    static async getEventQuestions(eventId) {
        try {
            const questions = JSON.parse(localStorage.getItem(`questions_${eventId}`) || '[]');
            return questions.sort((a, b) => {
                // Sort by upvotes first, then by date
                if (a.upvotes !== b.upvotes) return b.upvotes - a.upvotes;
                return new Date(b.createdAt) - new Date(a.createdAt);
            });
        } catch (error) {
            console.error('Error getting questions:', error);
            throw new Error('Failed to get questions');
        }
    }

    static async upvoteQuestion(eventId, questionId) {
        try {
            const questions = JSON.parse(localStorage.getItem(`questions_${eventId}`) || '[]');
            const questionIndex = questions.findIndex(q => q.id === questionId);
            
            if (questionIndex === -1) throw new Error('Question not found');
            
            questions[questionIndex].upvotes++;
            localStorage.setItem(`questions_${eventId}`, JSON.stringify(questions));
            return questions[questionIndex];
        } catch (error) {
            console.error('Error upvoting question:', error);
            throw new Error('Failed to upvote question');
        }
    }

    static async answerQuestion(eventId, questionId, responseContent) {
        try {
            const questions = JSON.parse(localStorage.getItem(`questions_${eventId}`) || '[]');
            const questionIndex = questions.findIndex(q => q.id === questionId);
            
            if (questionIndex === -1) throw new Error('Question not found');
            
            const response = {
                id: Date.now().toString(),
                content: responseContent,
                timestamp: new Date().toISOString()
            };
            
            questions[questionIndex].responses.push(response);
            questions[questionIndex].status = 'answered';
            
            localStorage.setItem(`questions_${eventId}`, JSON.stringify(questions));
            return questions[questionIndex];
        } catch (error) {
            console.error('Error answering question:', error);
            throw new Error('Failed to submit response');
        }
    }

    static async getAnalytics(eventId) {
        try {
            const questions = await this.getEventQuestions(eventId);
            return {
                total: questions.length,
                answered: questions.filter(q => q.status === 'answered').length,
                pending: questions.filter(q => q.status === 'pending').length,
                totalResponses: questions.reduce((sum, q) => sum + q.responses.length, 0),
                averageUpvotes: questions.length > 0 
                    ? questions.reduce((sum, q) => sum + q.upvotes, 0) / questions.length 
                    : 0
            };
        } catch (error) {
            console.error('Error getting analytics:', error);
            throw new Error('Failed to get analytics');
        }
    }
}