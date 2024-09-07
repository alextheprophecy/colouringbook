const Replicate = require("replicate")
const replicate = new Replicate()

const DEFAULT_SCHNELL_SEEDS = [19129, 34895, 34135] //19129 good
const DEFAULT_DEV_SEEDS = [19129, 34895, 34135] //19129 good
const SAFETY_CHECKER = false

const getSeed = (seed_list) => {
    const a = seed_list[Math.floor(Math.random()*seed_list.length)]
    return 19129
}

const queryFluxSchnell = (prompt, seed= getSeed(DEFAULT_SCHNELL_SEEDS)) => {

    const input = {
        prompt: prompt,
        disable_safety_checker: !SAFETY_CHECKER,
        seed: seed,
        output_quality: 100,
        output_format: "png",
        aspect_ratio: "2:3"
    };

    return replicate.run("black-forest-labs/flux-schnell", {input: input}).then(o=>o[0])
}

const queryFluxBetter = (prompt, seed = getSeed(DEFAULT_DEV_SEEDS)) => {
    const input = {
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

    return replicate.run("black-forest-labs/flux-dev", {input: input}).then(o=>o[0])
}

module.exports = {
    queryFluxSchnell,
    queryFluxBetter
}