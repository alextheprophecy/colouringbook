const Replicate = require("replicate")
const replicate = new Replicate()

const DEFAULT_SCHNELL_SEEDS = [19129, 34895, 34135] //19129 good
const DEFAULT_DEV_SEEDS = [19129, 34895, 34135] //19129 good
const SAFETY_CHECKER = false

const randomSavedSeed = (seed_list= DEFAULT_DEV_SEEDS) => {
    return seed_list[Math.floor(Math.random()*seed_list.length)]
}

const randomSeed = () => {
    return Math.floor(Math.random() * 99999)
}

const _runModel = (input, model) =>
    replicate.run(model, {input: input}).then(o => o[0].url())

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
        output_format: "jpg",
        output_quality: 80,
        prompt_strength: 0.8,
        num_inference_steps: 50
    };

    return _runModel(input, "black-forest-labs/flux-dev")
}


module.exports = {
    queryFluxSchnell,
    queryFluxBetter,
    randomSavedSeed,
    randomSeed
}