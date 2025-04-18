/**
 * Service class for handling awards voting functionality
 */
export class AwardsVotingService {
    static async createCategory(eventId, categoryData) {
        try {
            const categories = JSON.parse(localStorage.getItem(`award_categories_${eventId}`) || '[]');
            const newCategory = {
                id: Date.now().toString(),
                eventId,
                status: 'active',
                createdAt: new Date().toISOString(),
                votes: {},
                totalVotes: 0,
                nominees: [],
                ...categoryData
            };
            
            categories.push(newCategory);
            localStorage.setItem(`award_categories_${eventId}`, JSON.stringify(categories));
            return newCategory;
        } catch (error) {
            console.error('Error creating award category:', error);
            throw new Error('Failed to create award category');
        }
    }

    static async getEventCategories(eventId) {
        try {
            const categories = JSON.parse(localStorage.getItem(`award_categories_${eventId}`) || '[]');
            return categories.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } catch (error) {
            console.error('Error getting award categories:', error);
            throw new Error('Failed to get award categories');
        }
    }

    static async addNominee(eventId, categoryId, nomineeData) {
        try {
            const categories = JSON.parse(localStorage.getItem(`award_categories_${eventId}`) || '[]');
            const categoryIndex = categories.findIndex(c => c.id === categoryId);
            
            if (categoryIndex === -1) throw new Error('Category not found');
            
            const nominee = {
                id: Date.now().toString(),
                votes: 0,
                timestamp: new Date().toISOString(),
                ...nomineeData
            };
            
            categories[categoryIndex].nominees.push(nominee);
            localStorage.setItem(`award_categories_${eventId}`, JSON.stringify(categories));
            return nominee;
        } catch (error) {
            console.error('Error adding nominee:', error);
            throw new Error('Failed to add nominee');
        }
    }

    static async voteForNominee(eventId, categoryId, nomineeId, userId) {
        try {
            const categories = JSON.parse(localStorage.getItem(`award_categories_${eventId}`) || '[]');
            const categoryIndex = categories.findIndex(c => c.id === categoryId);
            
            if (categoryIndex === -1) throw new Error('Category not found');
            
            const category = categories[categoryIndex];
            const nomineeIndex = category.nominees.findIndex(n => n.id === nomineeId);
            
            if (nomineeIndex === -1) throw new Error('Nominee not found');

            // In a real app, we'd validate if the user has already voted
            const voterKey = `${categoryId}_${userId}`;
            if (category.votes[voterKey]) {
                throw new Error('User has already voted in this category');
            }

            category.nominees[nomineeIndex].votes++;
            category.votes[voterKey] = nomineeId;
            category.totalVotes++;
            
            localStorage.setItem(`award_categories_${eventId}`, JSON.stringify(categories));
            return category;
        } catch (error) {
            console.error('Error voting for nominee:', error);
            throw new Error('Failed to submit vote');
        }
    }

    static async getCategoryResults(eventId, categoryId) {
        try {
            const categories = JSON.parse(localStorage.getItem(`award_categories_${eventId}`) || '[]');
            const category = categories.find(c => c.id === categoryId);
            
            if (!category) throw new Error('Category not found');
            
            return {
                categoryName: category.name,
                totalVotes: category.totalVotes,
                nominees: category.nominees.map(nominee => ({
                    ...nominee,
                    percentage: category.totalVotes > 0 
                        ? (nominee.votes / category.totalVotes) * 100 
                        : 0
                })).sort((a, b) => b.votes - a.votes)
            };
        } catch (error) {
            console.error('Error getting category results:', error);
            throw new Error('Failed to get results');
        }
    }

    static async getCategoryAnalytics(eventId) {
        try {
            const categories = await this.getEventCategories(eventId);
            return {
                totalCategories: categories.length,
                activeCategories: categories.filter(c => c.status === 'active').length,
                totalVotes: categories.reduce((sum, c) => sum + c.totalVotes, 0),
                totalNominees: categories.reduce((sum, c) => sum + c.nominees.length, 0),
                averageVotesPerCategory: categories.length > 0 
                    ? categories.reduce((sum, c) => sum + c.totalVotes, 0) / categories.length 
                    : 0
            };
        } catch (error) {
            console.error('Error getting analytics:', error);
            throw new Error('Failed to get analytics');
        }
    }
}