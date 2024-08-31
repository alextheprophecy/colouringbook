const Replicate = require("replicate")
const replicate = new Replicate()

const queryFluxSchnell = (prompt) => {

    const input = {
        prompt: prompt,
        output_quality: 100,
        output_format: "png",
        aspect_ratio: "2:3"
    };

    return replicate.run("black-forest-labs/flux-schnell", {input: input}).then(o=>o[0])
}

const queryFluxBetter = (prompt) => {
    const input = {
        prompt: prompt,
        guidance: 3.5,
        num_outputs: 1,
        aspect_ratio: "2:3",
        output_format: "jpg",
        output_quality: 100,
        prompt_strength: 0.8,
        num_inference_steps: 50
    };

    return replicate.run("black-forest-labs/flux-dev", {input: input}).then(o=>o[0])
}

module.exports = {
    queryFluxSchnell,
    queryFluxBetter
}