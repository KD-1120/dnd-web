/**
 * Service class for handling awards voting functionality
 */
export class AwardsVotingService {
    /**
     * Creates a new award category for an event
     * @param {string} eventId - The event ID
     * @param {Object} categoryData - The category data to create
     * @returns {Promise<Object>} - The created category
     */
    static async createCategory(eventId, categoryData) {
        try {
            const categories = JSON.parse(localStorage.getItem(`award_categories_${eventId}`) || '[]');
            
            // Generate a unique ID
            const categoryId = `category_${Date.now()}`;
            
            // Process nominees to add IDs and initialize votes
            const nominees = categoryData.nominees.map(nominee => ({
                id: `nominee_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
                name: nominee.name,
                description: nominee.description || '',
                votes: 0,
                imageUrl: nominee.imageUrl || '',
            }));
            
            // Create the new category
            const newCategory = {
                id: categoryId,
                eventId,
                status: 'active',
                createdAt: new Date().toISOString(),
                votes: {},
                totalVotes: 0,
                name: categoryData.name,
                description: categoryData.description || '',
                deadline: categoryData.deadline,
                nominees: nominees
            };
            
            categories.push(newCategory);
            localStorage.setItem(`award_categories_${eventId}`, JSON.stringify(categories));
            return newCategory;
        } catch (error) {
            console.error('Error creating award category:', error);
            throw new Error('Failed to create award category');
        }
    }

    /**
     * Gets all award categories for an event
     * @param {string} eventId - The event ID
     * @returns {Promise<Array>} - The list of award categories
     */
    static async getEventCategories(eventId) {
        try {
            const categories = JSON.parse(localStorage.getItem(`award_categories_${eventId}`) || '[]');
            return categories.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } catch (error) {
            console.error('Error getting award categories:', error);
            throw new Error('Failed to get award categories');
        }
    }

    /**
     * Adds a nominee to an award category
     * @param {string} eventId - The event ID
     * @param {string} categoryId - The category ID
     * @param {Object} nomineeData - The nominee data
     * @returns {Promise<Object>} - The added nominee
     */
    static async addNominee(eventId, categoryId, nomineeData) {
        try {
            const categories = JSON.parse(localStorage.getItem(`award_categories_${eventId}`) || '[]');
            const categoryIndex = categories.findIndex(c => c.id === categoryId);
            
            if (categoryIndex === -1) throw new Error('Category not found');
            
            const nominee = {
                id: `nominee_${Date.now()}`,
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

    /**
     * Records a vote for a nominee
     * @param {string} eventId - The event ID
     * @param {string} categoryId - The category ID
     * @param {string} nomineeId - The nominee ID
     * @param {string} userId - The user ID voting
     * @returns {Promise<Object>} - The updated category
     */
    static async voteForNominee(eventId, categoryId, nomineeId, userId) {
        try {
            const categories = JSON.parse(localStorage.getItem(`award_categories_${eventId}`) || '[]');
            const categoryIndex = categories.findIndex(c => c.id === categoryId);
            
            if (categoryIndex === -1) throw new Error('Category not found');
            
            const category = categories[categoryIndex];
            
            // Check if voting is still open
            if (new Date(category.deadline) < new Date()) {
                throw new Error('Voting has ended for this category');
            }
            
            const nomineeIndex = category.nominees.findIndex(n => n.id === nomineeId);
            
            if (nomineeIndex === -1) throw new Error('Nominee not found');

            // Check if user has already voted
            const voterKey = `${categoryId}_${userId}`;
            if (category.votes[voterKey]) {
                throw new Error('You have already voted in this category');
            }

            // Record the vote
            category.nominees[nomineeIndex].votes++;
            category.votes[voterKey] = nomineeId;
            category.totalVotes = (category.totalVotes || 0) + 1;
            
            localStorage.setItem(`award_categories_${eventId}`, JSON.stringify(categories));
            return category;
        } catch (error) {
            console.error('Error voting for nominee:', error);
            throw error;
        }
    }

    /**
     * Gets the results for a category
     * @param {string} eventId - The event ID
     * @param {string} categoryId - The category ID
     * @returns {Promise<Object>} - The category results
     */
    static async getCategoryResults(eventId, categoryId) {
        try {
            const categories = JSON.parse(localStorage.getItem(`award_categories_${eventId}`) || '[]');
            const category = categories.find(c => c.id === categoryId);
            
            if (!category) throw new Error('Category not found');
            
            // Get the winner (if voting has ended)
            const isVotingClosed = new Date(category.deadline) <= new Date();
            let winner = null;
            
            if (isVotingClosed && category.nominees.length > 0) {
                winner = category.nominees.reduce((prev, current) => 
                    (prev.votes > current.votes) ? prev : current
                );
            }
            
            return {
                id: category.id,
                name: category.name,
                description: category.description,
                totalVotes: category.totalVotes || 0,
                deadline: category.deadline,
                isVotingClosed,
                nominees: category.nominees.map(nominee => ({
                    id: nominee.id,
                    name: nominee.name,
                    description: nominee.description,
                    votes: nominee.votes || 0,
                    percentage: category.totalVotes > 0 
                        ? ((nominee.votes || 0) / category.totalVotes) * 100 
                        : 0
                })),
                winner: isVotingClosed ? winner : null
            };
        } catch (error) {
            console.error('Error getting category results:', error);
            throw new Error('Failed to get results');
        }
    }

    /**
     * Gets analytics for award categories in an event
     * @param {string} eventId - The event ID
     * @returns {Promise<Object>} - The analytics data
     */
    static async getCategoryAnalytics(eventId) {
        try {
            const categories = await this.getEventCategories(eventId);
            
            // Count active categories (voting still open)
            const activeCategories = categories.filter(
                c => new Date(c.deadline) > new Date()
            ).length;
            
            // Count total nominees across all categories
            const totalNominees = categories.reduce(
                (sum, c) => sum + c.nominees.length, 0
            );
            
            // Count total votes across all categories
            const totalVotes = categories.reduce(
                (sum, c) => sum + (c.totalVotes || 0), 0
            );
            
            return {
                totalCategories: categories.length,
                activeCategories,
                totalVotes,
                totalNominees,
                averageVotesPerCategory: categories.length > 0 
                    ? totalVotes / categories.length 
                    : 0
            };
        } catch (error) {
            console.error('Error getting category analytics:', error);
            throw new Error('Failed to get analytics');
        }
    }

    /**
     * Updates an award category
     * @param {string} eventId - The event ID
     * @param {string} categoryId - The category ID
     * @param {Object} updateData - The data to update
     * @returns {Promise<Object>} - The updated category
     */
    static async updateCategory(eventId, categoryId, updateData) {
        try {
            const categories = JSON.parse(localStorage.getItem(`award_categories_${eventId}`) || '[]');
            const categoryIndex = categories.findIndex(c => c.id === categoryId);
            
            if (categoryIndex === -1) throw new Error('Category not found');
            
            // Update allowed fields
            const allowedFields = ['name', 'description', 'deadline', 'status'];
            allowedFields.forEach(field => {
                if (updateData[field] !== undefined) {
                    categories[categoryIndex][field] = updateData[field];
                }
            });
            
            // Update nominees if provided
            if (updateData.nominees) {
                // For each nominee in the update data, update or add
                updateData.nominees.forEach(updatedNominee => {
                    if (updatedNominee.id) {
                        // Update existing nominee
                        const nomineeIndex = categories[categoryIndex].nominees.findIndex(
                            n => n.id === updatedNominee.id
                        );
                        
                        if (nomineeIndex !== -1) {
                            categories[categoryIndex].nominees[nomineeIndex] = {
                                ...categories[categoryIndex].nominees[nomineeIndex],
                                name: updatedNominee.name || categories[categoryIndex].nominees[nomineeIndex].name,
                                description: updatedNominee.description !== undefined 
                                    ? updatedNominee.description 
                                    : categories[categoryIndex].nominees[nomineeIndex].description
                            };
                        }
                    } else {
                        // Add new nominee
                        categories[categoryIndex].nominees.push({
                            id: `nominee_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
                            name: updatedNominee.name,
                            description: updatedNominee.description || '',
                            votes: 0,
                            imageUrl: updatedNominee.imageUrl || '',
                        });
                    }
                });
            }
            
            // Record update timestamp
            categories[categoryIndex].updatedAt = new Date().toISOString();
            
            localStorage.setItem(`award_categories_${eventId}`, JSON.stringify(categories));
            return categories[categoryIndex];
        } catch (error) {
            console.error('Error updating category:', error);
            throw new Error('Failed to update category');
        }
    }

    /**
     * Deletes an award category
     * @param {string} eventId - The event ID
     * @param {string} categoryId - The category ID
     * @returns {Promise<boolean>} - Success status
     */
    static async deleteCategory(eventId, categoryId) {
        try {
            const categories = JSON.parse(localStorage.getItem(`award_categories_${eventId}`) || '[]');
            const updatedCategories = categories.filter(c => c.id !== categoryId);
            
            if (updatedCategories.length === categories.length) {
                throw new Error('Category not found');
            }
            
            localStorage.setItem(`award_categories_${eventId}`, JSON.stringify(updatedCategories));
            return true;
        } catch (error) {
            console.error('Error deleting category:', error);
            throw new Error('Failed to delete category');
        }
    }
}