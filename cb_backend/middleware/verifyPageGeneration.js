const { verifyCredits } = require("../controllers/user/user.controller");

const CREDIT_COSTS = [5, 3, 1];

const verifyPageGeneration = async (req, res, next) => {
    const { creationSettings } = req.body;
    
    if (!creationSettings) {
        return res.status(400).json({ error: 'Missing creation settings' });
    }

    const { testMode, useAdvancedContext, usingModel, ...generationSettings } = creationSettings;
    
    try {
        // Verify credits
        const creditCost = CREDIT_COSTS[parseInt(usingModel)];
        const credits = await verifyCredits(req.user, creditCost);
        
        // Add processed data to request object
        req.generationData = {
            testMode,
            useAdvancedContext,
            generationSettings: {
                usingModel,
                ...generationSettings
            },
            credits
        };
        
        next();
    } catch (error) {
        return res.status(403).json({ error: error.message });
    }
};

module.exports = verifyPageGeneration; 