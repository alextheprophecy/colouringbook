export const MODEL_COSTS = [5, 3, 1];

export const getModelOptions = (t) => [ 
    {
        id: 0,
        label: t('modifybook.creative_model'),
        description: t('modifybook.creative_model_description'), 
        cost: MODEL_COSTS[0] 
    },
    { 
        id: 1, 
        label: t('modifybook.standard_model'), 
        description: t('modifybook.standard_model_description'), 
        cost: MODEL_COSTS[1] 
    },
    { 
        id: 2, 
        label: t('modifybook.basic_model'), 
        description: t('modifybook.standard_basic_description'), 
        cost: MODEL_COSTS[2] 
    }
]; 