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

module.exports = {
    queryFluxSchnell
}