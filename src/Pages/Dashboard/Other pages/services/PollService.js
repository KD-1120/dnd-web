/**
 * Service class for handling poll operations
 */
export class PollService {
    static async createPoll(eventId, pollData) {
        try {
            // In a real app, this would be an API call
            const polls = JSON.parse(localStorage.getItem(`polls_${eventId}`) || '[]');
            const newPoll = {
                id: Date.now().toString(),
                eventId,
                status: 'active',
                createdAt: new Date().toISOString(),
                votes: {},
                totalVotes: 0,
                ...pollData
            };
            
            polls.push(newPoll);
            localStorage.setItem(`polls_${eventId}`, JSON.stringify(polls));
            return newPoll;
        } catch (error) {
            console.error('Error creating poll:', error);
            throw new Error('Failed to create poll');
        }
    }

    static async getEventPolls(eventId) {
        try {
            const polls = JSON.parse(localStorage.getItem(`polls_${eventId}`) || '[]');
            return polls.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } catch (error) {
            console.error('Error getting polls:', error);
            throw new Error('Failed to get polls');
        }
    }

    static async votePoll(eventId, pollId, options, userId) {
        try {
            const polls = JSON.parse(localStorage.getItem(`polls_${eventId}`) || '[]');
            const pollIndex = polls.findIndex(p => p.id === pollId);
            
            if (pollIndex === -1) throw new Error('Poll not found');
            
            const poll = polls[pollIndex];

            // Check if poll is still active
            if (new Date(poll.deadline) < new Date()) {
                throw new Error('This poll has ended');
            }

            // Check if user has already voted (in a real app, this would be handled by the backend)
            const voterKey = `${pollId}_${userId}`;
            if (poll.votes[voterKey]) {
                throw new Error('You have already voted in this poll');
            }
            
            // Record the vote
            options.forEach(option => {
                poll.votes[option] = (poll.votes[option] || 0) + 1;
            });
            poll.votes[voterKey] = options;
            poll.totalVotes++;
            
            localStorage.setItem(`polls_${eventId}`, JSON.stringify(polls));
            return poll;
        } catch (error) {
            console.error('Error voting on poll:', error);
            throw error;
        }
    }

    static async getPollResults(eventId, pollId) {
        try {
            const polls = JSON.parse(localStorage.getItem(`polls_${eventId}`) || '[]');
            const poll = polls.find(p => p.id === pollId);
            
            if (!poll) throw new Error('Poll not found');
            
            const results = {
                question: poll.question,
                totalVotes: poll.totalVotes,
                options: poll.options.map(option => ({
                    text: option,
                    votes: poll.votes[option] || 0,
                    percentage: poll.totalVotes > 0 
                        ? ((poll.votes[option] || 0) / poll.totalVotes) * 100 
                        : 0
                })),
                isActive: new Date(poll.deadline) > new Date()
            };

            return results;
        } catch (error) {
            console.error('Error getting poll results:', error);
            throw new Error('Failed to get results');
        }
    }

    static async getPollAnalytics(eventId) {
        try {
            const polls = await this.getEventPolls(eventId);
            return {
                totalPolls: polls.length,
                activePolls: polls.filter(p => new Date(p.deadline) > new Date()).length,
                totalVotes: polls.reduce((sum, p) => sum + p.totalVotes, 0),
                averageVotesPerPoll: polls.length > 0 
                    ? polls.reduce((sum, p) => sum + p.totalVotes, 0) / polls.length 
                    : 0,
                completedPolls: polls.filter(p => new Date(p.deadline) <= new Date()).length
            };
        } catch (error) {
            console.error('Error getting analytics:', error);
            throw new Error('Failed to get analytics');
        }
    }
}

/**
 * Service class for handling Q&A operations
 */
export class QuestionService {
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

    static async getQuestionAnalytics(eventId) {
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
            console.error('Error getting question analytics:', error);
            throw new Error('Failed to get analytics');
        }
    }
}