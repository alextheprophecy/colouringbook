const Replicate = require("replicate")
const replicate = new Replicate()

const DEFAULT_SCHNELL_SEEDS = [19129, 34895, 34135] //19129 good
const DEFAULT_DEV_SEEDS = [19129, 34895, 34135, 23006] //19129 good
//34135(a bit too much shading), 23006 -good
//19129 more cartoonish
const SAFETY_CHECKER = false

const randomSavedSeed = (seed_list= DEFAULT_DEV_SEEDS) => {
    return 34135//seed_list[Math.floor(Math.random()*seed_list.length)]
}

const randomSeed = () => {
    return Math.floor(Math.random() * 99999)
}

const _runModel = async (input, model) => {
    const output = await replicate.run(model, {input: input});
    console.log('o:', output);
    
    // output[0] is already a ReadableStream
    const stream = output[0];
    
    // Convert stream to buffer
    const chunks = [];
    for await (const chunk of stream) {
        chunks.push(chunk);
    }
    return Buffer.concat(chunks);
}

const queryFluxSchnell = (prompt, seed = randomSavedSeed(DEFAULT_SCHNELL_SEEDS)) => {
    const input = {
        prompt: prompt,
        disable_safety_checker: !SAFETY_CHECKER,
        seed: seed,
        output_quality: 100,
        output_format: "png",
        aspect_ratio: "2:3"
    };
    return _runModel(input, "black-forest-labs/flux-schnell")
}

const queryFluxBetter = (prompt, seed = randomSavedSeed(DEFAULT_DEV_SEEDS)) => {
    const input = {
        go_fast: false,
        prompt: prompt,
        seed: seed,
        guidance: 3.5,
        num_outputs: 1,
        disable_safety_checker: !SAFETY_CHECKER,
        aspect_ratio: "2:3",
        output_format: "png",
        output_quality: 80,
        prompt_strength: 0.8,
        num_inference_steps: 50
    };

    return _runModel(input, "black-forest-labs/flux-dev")
}

const queryFineTuned = (prompt, {simple=false, seed=randomSeed(), num_outputs=1} = {}) => {
    const weights_url = simple ? 
        `https://civitai.com/api/download/models/888917?type=Model&format=SafeTensor&token=${process.env.CIVITAI_API_TOKEN}`
    :
        `https://civitai.com/api/download/models/977806?type=Model&format=SafeTensor`;

    const prompt_key_words = simple ? "coloring book page, of" : "coloring page, of"

    const model = "lucataco/flux-dev-lora:091495765fa5ef2725a175a57b276ec30dc9d39c22d30410f2ede68a3eab66b3"

    //TODO: input params are tuned for non simple model
    const input = {
        prompt: `${prompt_key_words} ${prompt}`,
        hf_lora: weights_url,
        seed: seed,
        num_outputs: num_outputs,
        disable_safety_checker: !SAFETY_CHECKER,
        output_format: "png",
        aspect_ratio: "2:3",        
        num_inference_steps: 33,
        prompt_strength: 1,
        guidance_scale: 3.5,
        lora_scale: 0.6,
    };
    return _runModel(input, model)
}  


module.exports = {
    queryFluxSchnell,
    queryFluxBetter,
    randomSavedSeed,
    randomSeed,
    queryFineTuned
}